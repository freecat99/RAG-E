import {config} from 'dotenv'
config();

import fs from 'fs'
import { pipeline } from '@xenova/transformers'
import { QdrantClient } from '@qdrant/js-client-rest'

const client = new QdrantClient({
    url: process.env.QdrantURL,
    apiKey: process.env.QdrantAPI
})
//console.log(client)

const collectionName = "algorithms"

let extractor;

async function main(){

    //load embedding model
    try {

        extractor = await pipeline(
            'feature-extraction',
            'Xenova/bge-base-en-v1.5'
        );
        console.log("Embedding model loaded")
        console.log("//////////////////////")
        
    } catch (error) {
        console.log("Embedding model load error; ", error)
    }
    
    //create vector db collection
    try {
        await client.createCollection(
            collectionName,{
                vectors:{
                    size:768,
                    distance: 'Cosine'
                }
            });
            console.log('Collection created')
                    
    } catch (error) {
                        
        console.log('Collection creation error; ', error);
                
    } 
                   
    const lines = fs.readFileSync('./data/algoData.jsonl', 'utf-8').split('\n').filter(Boolean);
                   
    let points = [];
                   
    //reading jsonl data lines
    for(let i=0; i<lines.length; i++){
        const doc = JSON.parse(lines[i]);

        const title = doc.title || "";
        const theory = doc.theory || "";
        
        const keywords = (doc.keywords || []).join(" ");
        
        // combine text
        const text = `
        Title: ${title}
        
        Theory:
        ${theory}
        
        Keywords:
        ${keywords}
        `;
        
        // generate embedding
        const output = await extractor(text, {
            pooling: "mean",
            normalize: true
        });
        
        const embedding = Array.from(output.data);
        
        points.push({
            id: i,
            
            vector: embedding,
            
            payload: {
                title,
                theory,
                keywords: doc.keywords || []
            }
            
        });
        console.log(`Processed: ${title}`);   
    }
    console.log("//////////////////////")

    await client.upsert(
        collectionName,{
            wait: true,
            points
        }
    );

    console.log('here',points)
    
    console.log("Uploaded to Qdrant")
    console.log("//////////////////////")
    
}
main();

//console.log(client) 