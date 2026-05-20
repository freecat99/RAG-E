import express from 'express';
import { config } from 'dotenv';
import { searchRouter } from './router/searchRouter.js';
config();


const app = express();
const port = process.env.PORT;

app.use('/api/search', searchRouter)

app.listen(port, ()=>{
    console.log(`listening at ${port}`)
})