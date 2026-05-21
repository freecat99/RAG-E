import dotenv from "dotenv";
dotenv.config();

import { pipeline } from "@xenova/transformers";
import { client } from "../data/qdrantClient.js";
import { llmGen, llmHyde } from "../util/openRouter.js";

const COLLECTION_NAME = "algorithms";

//prepares hypothetical answer for better search
const hyde = async(query) => {
    let hydeQuery = await llmHyde(query);

    return hydeQuery;
} 

export async function searchVectorDB(query) {

    let hydeQuery = await hyde(query);
    console.log('hyde', hydeQuery)

    // load embedding model
    const extractor = await pipeline(
        "feature-extraction",
        "Xenova/bge-base-en-v1.5"
    );

    // Some recent models that you can find in MTEB require prepending the text with an instruction to work better for retrieval. For example, if you use BAAI/bge-large-en-v1.5, you should prefix your query with the following instruction: “Represent this sentence for searching relevant passages:”
    const formattedQuery = "Represent this sentence for searching relevant passages: " + hydeQuery;

    // generate query embedding
    const output = await extractor(
        formattedQuery,
        {
            pooling: "mean",
            normalize: true
        }
    );

    const queryEmbedding =
        Array.from(output.data);

    // searchVectorDB Qdrant
    const results = await client.search(
        COLLECTION_NAME,
        {
            vector: queryEmbedding,
            limit: 3
        }
    );

    let knowledge =
    results.map((result) => {
        return `
                TITLE: ${result.payload.title},
                KEYWORDS: ${result.payload.keywords.join(',')},
                THEORY: ${result.payload.theory.slice(0, 300)}
                `
    }).join('\n\n');

    return knowledge;
}

const sanitize = (text) => {

    return text
        // remove extra spaces
        .replace(/\s+/g, " ")

        // remove HTML tags
        .replace(/<[^>]*>/g, "")

        // trim edges
        .trim()

        // limit length
        .slice(0, 1000);
}

export const llmAnswer = async(req, res) => {

    try {

        let question = req.body.question;
        question = sanitize(question);
        
        //retrieve knowledge from vector DB using HyDE
        const knowledge = await searchVectorDB(question);

        //generate answer
        const answer = await llmGen(question, knowledge);
        return res.status(200).json(answer);
        
    } catch (error) {
        console.log('error in llmAnswer', error);
        return res.status(404).json("Trouble generating answer");
    }
}

