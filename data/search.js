import dotenv from "dotenv";
dotenv.config();

import { pipeline } from "@xenova/transformers";
import { client } from "./qdrantClient.js";

const COLLECTION_NAME = "algorithms";

async function search(query) {

    // load embedding model
    const extractor = await pipeline(
        "feature-extraction",
        "Xenova/bge-base-en-v1.5"
    );

    // Some recent models that you can find in MTEB require prepending the text with an instruction to work better for retrieval. For example, if you use BAAI/bge-large-en-v1.5, you should prefix your query with the following instruction: “Represent this sentence for searching relevant passages:”

    const formattedQuery = "Represent this sentence for searching relevant passages: " + query;

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

    // search Qdrant
    const results = await client.search(
        COLLECTION_NAME,
        {
            vector: queryEmbedding,
            limit: 5
        }
    );

    console.log("\nRESULTS:\n");

    for (const result of results) {

        console.log(
            "=================================="
        );

        console.log(
            "TITLE:",
            result.payload.title
        );

        console.log(
            "SCORE:",
            result.score
        );

        console.log(
            "KEYWORDS:",
            result.payload.keywords
        );

        console.log(
            "THEORY:",
            result.payload.theory
                ?.slice(0, 300)
        );
    }
}

search("explain segment tree");