"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const youtube_transcript_1 = require("youtube-transcript");
const openai_1 = __importDefault(require("openai"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 8080;
const OPEN_API_KEY = process.env.OPEN_API_KEY;
const openai = new openai_1.default({
    apiKey: OPEN_API_KEY
});
function handleAINotes(text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield openai.chat.completions.create({
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
            });
            return response.choices[0].message.content;
        }
        catch (e) {
            console.log(`there was an error while processing the notes from ai: ${e}`);
            return '- Error while processing from the AI';
        }
    });
}
app.post('/notes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.body.url;
    console.log(req.body.url);
    if (!url) {
        return res.status(400).json({
            error: 'URL is required',
        });
    }
    const msg = yield youtube_transcript_1.YoutubeTranscript.fetchTranscript(url);
    let text = '';
    msg.forEach((item) => {
        text += item.text + ' ';
    });
    text = text.split('&amp;#39;').join("'");
    let notes = null;
    try {
        notes = yield handleAINotes(text);
    }
    catch (e) {
        console.log(`there was an error while processing the notes: ${e}`);
    }
    return res.status(200).json({
        notes: notes,
    });
}));
app.post('/captions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({
            error: 'URL is required',
        });
    }
    const msg = yield youtube_transcript_1.YoutubeTranscript.fetchTranscript(url);
    let text = '';
    msg.forEach((item) => {
        text += item.text + ' ';
    });
    text = text.split('&amp;#39;').join("'");
    return res.status(200).json({
        captions: text,
    });
}));
function handleAIDiagram(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const diagramPrompt = [
            {
                role: 'system',
                content: 'create a flowchart in mermaid markdown format, no deviation from the format, start with "graph TD" and end with the diagram',
            },
            {
                role: 'user',
                content: 'create a flowchart for linear algebra, vectors, linear combinations, matrix multiplication, cross product, change of basis',
            },
            {
                role: 'system',
                content: 'flowchart TD\n    A["Start"] --> B["Linear Algebra"]\n    B --> C["Vectors"]\n    C --> D["Linear Combinations"]\n    D --> E["Matrix Multiplication"]\n    E --> F["Cross Product"]\n    F --> G["Change of Basis"]\n    G --> H["End"]',
            },
            {
                role: 'user',
                content: 'create a flowchart for Machine Learning with Python, train model, decision trees, random forests and other important concepts',
            },
            {
                role: 'system',
                content: 'flowchart TD\n    A["Start"] --> B["Import Libraries"]\n    B --> C["Load Dataset"]\n    C --> D["Preprocess Data"]\n    D --> E["Split Dataset into Training and Test Sets"]\n    E --> F["Select Algorithm"]\n    \n    F --> G["Decision Trees"]\n    F --> H["Random Forests"]\n    F --> I["Other Algorithms"]\n    \n    G --> J["Train Decision Tree Model"]\n    J --> K["Evaluate Decision Tree Model"]\n    K --> Z["End"]\n    \n    H --> L["Train Random Forest Model"]\n    L --> M["Evaluate Random Forest Model"]\n    M --> Z["End"]\n    \n    I --> N["Choose Other Algorithm"]\n    N --> O["Train Other Model"]\n    O --> P["Evaluate Other Model"]\n    P --> Z["End"]',
            },
            {
                role: 'user',
                content: 'create a flowchart for the following' + text,
            },
        ];
        try {
            const response = yield openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: diagramPrompt,
                // max_tokens: 64,
                n: 1,
            });
            return response.choices[0].message.content;
        }
        catch (e) {
            console.log(`there was an error while processing the diagram from ai: ${e}`);
            return '- Error while processing from the AI';
        }
    });
}
app.post('/diagram', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({
            error: 'URL is required',
        });
    }
    const msg = yield youtube_transcript_1.YoutubeTranscript.fetchTranscript(url);
    let text = '';
    msg.forEach((item) => {
        text += item.text + ' ';
    });
    text = text.split('&amp;#39;').join("'");
    let diagram = null;
    try {
        diagram = yield handleAIDiagram(text);
    }
    catch (e) {
        console.log(`there was an error while processing the diagram: ${e}`);
    }
    return res.status(200).json({
        diagram: diagram,
    });
}));
app.listen(PORT, () => {
    console.log(`backend server started on port ${PORT}`);
});
