import express from 'express'
import { llmAnswer } from '../controller/searchController.js';

export const searchRouter = express.Router();

searchRouter.get('/answer', llmAnswer)
searchRouter.post('/answer', llmAnswer)

