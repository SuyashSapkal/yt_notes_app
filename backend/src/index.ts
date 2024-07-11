import express from 'express';
import { YoutubeTranscript } from 'youtube-transcript';
import OpenAI from 'openai';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8080;
const OPEN_API_KEY = process.env.OPEN_API_KEY!

const openai = new OpenAI({
    apiKey: OPEN_API_KEY
});

app.listen(PORT, ()=>{
    console.log(`backend server started on port ${PORT}`);
});
