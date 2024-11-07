import { useState } from "react";
import { getChatGptResponse } from "./chatGpt"
import { Button } from "react-bootstrap";

interface api {
    apiKey: string;
}

export function GptResponse({apiKey}: api): JSX.Element {
    const [message, setMessage] = useState<string>("Default");
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const handleSendMessage = async () => {
        setIsLoading(true);
        try {
          const data = await getChatGptResponse("give a random fact about random animal using less than 30 tokens", apiKey);
          setMessage(data.choices[0].message.content); // Get the first response from ChatGPT
        } catch (error) {
          console.error('Error getting response from ChatGPT:', error);
        } finally {
          setIsLoading(false);
        }
      };
    return <div>
        <Button onClick={handleSendMessage} disabled={isLoading}>GPT Test: {isLoading? "loading": "send"}</Button>
        <div>
            <h2>Results:</h2>
            <p>{message}</p>
        </div>
    </div>
}