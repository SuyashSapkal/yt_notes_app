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

async function handleAINotes(text: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: 'system',
                    content: 'you write bullet point notes:',
                },
                {
                    role: 'user',
                    content: text,
                },
            ],
            // max_tokens: 64,
            n: 1,
        })

        return response.choices[0].message.content
    } catch (e) {
        console.log(`there was an error while processing the notes from ai: ${e}`)

        return '- Error while processing from the AI'
    }
}

app.post('/notes', async (req, res) => {
    const url = req.body.url
    console.log(req.body.url)

    if (!url) {
        return res.status(400).json({
            error: 'URL is required',
        })
    }

    const msg = await YoutubeTranscript.fetchTranscript(url)
    let text = ''
    msg.forEach((item) => {
        text += item.text + ' '
    })
    text = text.split('&amp;#39;').join("'")

    let notes = null

    try {
        notes = await handleAINotes(text)
    } catch (e) {
        console.log(`there was an error while processing the notes: ${e}`)
    }

    return res.status(200).json({
        notes: notes,
    })
})

app.post('/captions', async (req, res) => {
    const url = req.body.url

    if (!url) {
        return res.status(400).json({
            error: 'URL is required',
        })
    }

    const msg = await YoutubeTranscript.fetchTranscript(url)
    let text = ''
    msg.forEach((item) => {
        text += item.text + ' '
    })
    text = text.split('&amp;#39;').join("'")

    return res.status(200).json({
        captions: text,
    })
})

app.listen(PORT, () => {
    console.log(`backend server started on port ${PORT}`);
});
