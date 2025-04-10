// assistant.js
import OpenAIApi from "openai";
import dotenv from "dotenv";
dotenv.config();


const configuration = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const myAssistant = await openai.beta.assistants.retrieve(
  "asst_q2uXzn880QvNNzdmFnE3Gg2f"
);

const myThread = await openai.beta.threads.create()


await openai.beta.threads.messages.create(
  myThread.id,
  {
    role: "user",
    content: "Que cursos ofreceis",
  }
);

let run = await openai.beta.threads.runs.createAndPoll(
  myThread.id,
  {
    assistant_id: myAssistant.id,
  }
);

if (run.status === 'completed') {
  const messages = await openai.beta.threads.messages.list(
    run.thread_id
  );
  for (const message of messages.data.reverse()) {
    console.log(`${message.role} > ${message.content[0].text.value}`);
  }
} else {
  console.log(run.status);
}