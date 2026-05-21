import express from 'express'
import { llmAnswer } from '../controller/searchController';

export const searchRouter = express.Router();

searchRouter.get('/', llmAnswer)

