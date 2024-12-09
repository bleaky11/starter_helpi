// Taken from chatgpt and edited to allow for custom questions and apikey inputs
import axios from "axios";

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const getChatGptResponse = async (message: string, apiKey: string) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-4o', // or 'gpt-4o' depending on your access
        messages: [{ role: 'user', content: message }],
        max_tokens: 350
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
    if (axios.isAxiosError(error)) {
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};