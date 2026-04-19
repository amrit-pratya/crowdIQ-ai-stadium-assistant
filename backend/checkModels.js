require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const result = await genAI.listModels();

        console.log("Available Models:\n");

        result.models.forEach((model) => {
            console.log("Name:", model.name);
            console.log("Supported Methods:", model.supportedGenerationMethods);
            console.log("--------------");
        });

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();