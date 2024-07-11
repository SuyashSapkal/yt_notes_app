"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
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
app.listen(PORT, () => {
    console.log(`backend server started on port ${PORT}`);
});
