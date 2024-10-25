import axios from "axios";

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const getChatGptResponse = async (message: string, apiKey: string) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo', // or 'gpt-4' depending on your access
        messages: [{ role: 'user', content: message }],
        max_tokens: 20
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching response from ChatGPT API:', error);
    throw error;
  }
};