// assistant.js
import OpenAIApi from "openai";
import dotenv from "dotenv";
dotenv.config();

// configurar la APIKEY de OpenAI a nuestro cliente
const configuration = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
});
// crear el cliente de OpenAI
const openai = new OpenAIApi(configuration);

let assistant = null; // Variable para almacenar el asistente

export const loadAssistant = async () => {
    if (!assistant) {
        assistant = await openai.beta.assistants.retrieve(process.env.ASSISTANT_ID);
    }
    return assistant;
};

export const createThread = async () => {
    return await openai.beta.threads.create();
};

export const createUserMessage = async (threadId, messageContent) => {
    return await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: messageContent,
    });
};

export const runAssistant = async (threadId, assistantId) => {
    return await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistantId,
    });
};

export const listThreadMessages = async (threadId) => {
    return await openai.beta.threads.messages.list(threadId);
};

export const runAssistantStream = async (threadId, assistantId, res) => {
    return new Promise((resolve, reject) => {
      const run = openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId
      })
        .on('textCreated', () => res.write('\n'))
        .on('textDelta', (textDelta) => res.write(textDelta.value))
        .on('end', resolve)
        .on('error', (error) => reject(error));
    });
  };