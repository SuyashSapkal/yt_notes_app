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

async function handleAIDiagram(text: string) {
    const diagramPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content:
                'create a flowchart in mermaid markdown format, no deviation from the format, start with "graph TD" and end with the diagram',
        },
        {
            role: 'user',
            content:
                'create a flowchart for linear algebra, vectors, linear combinations, matrix multiplication, cross product, change of basis',
        },
        {
            role: 'system',
            content:
                'flowchart TD\n    A["Start"] --> B["Linear Algebra"]\n    B --> C["Vectors"]\n    C --> D["Linear Combinations"]\n    D --> E["Matrix Multiplication"]\n    E --> F["Cross Product"]\n    F --> G["Change of Basis"]\n    G --> H["End"]',
        },
        {
            role: 'user',
            content:
                'create a flowchart for Machine Learning with Python, train model, decision trees, random forests and other important concepts',
        },
        {
            role: 'system',
            content:
                'flowchart TD\n    A["Start"] --> B["Import Libraries"]\n    B --> C["Load Dataset"]\n    C --> D["Preprocess Data"]\n    D --> E["Split Dataset into Training and Test Sets"]\n    E --> F["Select Algorithm"]\n    \n    F --> G["Decision Trees"]\n    F --> H["Random Forests"]\n    F --> I["Other Algorithms"]\n    \n    G --> J["Train Decision Tree Model"]\n    J --> K["Evaluate Decision Tree Model"]\n    K --> Z["End"]\n    \n    H --> L["Train Random Forest Model"]\n    L --> M["Evaluate Random Forest Model"]\n    M --> Z["End"]\n    \n    I --> N["Choose Other Algorithm"]\n    N --> O["Train Other Model"]\n    O --> P["Evaluate Other Model"]\n    P --> Z["End"]',
        },
        {
            role: 'user',
            content: 'create a flowchart for the following' + text,
        },
    ]

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: diagramPrompt,
            // max_tokens: 64,
            n: 1,
        })
        return response.choices[0].message.content
    } catch (e) {
        console.log(`there was an error while processing the diagram from ai: ${e}`)
        return '- Error while processing from the AI'
    }
}

app.post('/diagram', async (req, res) => {
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

    let diagram = null

    try {
        diagram = await handleAIDiagram(text)
    } catch (e) {
        console.log(`there was an error while processing the diagram: ${e}`)
    }

    return res.status(200).json({
        diagram: diagram,
    })
})

app.listen(PORT, () => {
    console.log(`backend server started on port ${PORT}`);
});
