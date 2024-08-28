require('dotenv').config();
import { OpenAI } from "openai";
import fs from 'fs';
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeImage(imagePath: string): Promise<string> {
  try {
    const imageBase64 = fs.readFileSync(imagePath, 'base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Transcribe all text from the image. If there is not text in the image, output nothing."
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: "high"
              }
            }
          ]
        },
      ],
    });
    if (response && response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content;
      return content || "";
    } else {
      throw new Error('No text found in the response');
    }
  } catch (error) {
    console.error('Error constructing the text:', error);
    throw error;
  }
}

async function constructQuestion(text: string[]): Promise<string> {
  try {
    if (text.length === 0) {
      throw new Error('No text fragments found');
    }

    const fragments: ChatCompletionMessageParam[] = text.map((fragment, index) => {
      return { role: "user", content: `Fragment ${index + 1}:\n${fragment}` }
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "The following text fragments are extracted from a section of a document. Reconstruct the document in a coherent manner."
        },
        ...fragments
      ],
    });
    if (response && response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content;
      return content || "";
    } else {
      throw new Error('No text found in the response');
    }
  } catch (error) {
    console.error('Error constructing the text:', error);
    throw error;
  }
}

interface ExtractionResponse {
  questions: any[];
}

async function answer(question: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: "You must answer the question based on the following text."
        },
        {
          role: "user",
          content: question
        },
      ],
    });
    if (response && response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content;
      return content || ""; // Add a null check and provide a default value
    } else {
      throw new Error('No answer found in the response');
    }
  } catch (error) {
    console.error('Error getting the answer:', error);
    throw error;
  }
}

export {
  constructQuestion,
  transcribeImage,
  answer
};