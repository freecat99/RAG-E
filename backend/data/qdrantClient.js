import {QdrantClient} from "@qdrant/js-client-rest";
import { config } from "dotenv";
config();


export const client = new QdrantClient({
    url: process.env.QdrantURL,
    apiKey: process.env.QdrantAPI
});