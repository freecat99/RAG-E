import express from 'express'
import { search, searchVectorDB } from '../controller/searchController';

export const searchRouter = express.Router();

searchRouter.get('/', searchVectorDB)

