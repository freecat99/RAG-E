import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { searchRouter } from './router/searchRouter.js';
config();


const app = express();
const port = process.env.PORT;

const corsoptions = {
    origin: [
        'http://localhost:5173',
        'chrome-extension://hbbgkbicbpebelmicbnijbmdbfgmlijg' 
    ]
}

app.use(cors(corsoptions));
app.use(bodyParser.json());
app.use('/api/search', searchRouter);


app.listen(port, ()=>{
    console.log(`listening at ${port}`)
})