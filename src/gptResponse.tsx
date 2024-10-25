import { useState } from "react";
import { getChatGptResponse } from "./chatGpt"
import { Button } from "react-bootstrap";

interface api {
    apiKey: string;
}

export function GptResponse({apiKey}: api): JSX.Element {
    const [message, setMessage] = useState<string>("Default");
    function getResponse(): void {
        setMessage(getChatGptResponse("Give a random fact about elephants", apiKey).toString())
    }
    return <div>
        <Button onClick={getResponse}>GPT Test</Button>
        <br></br>
        <h2>Response:</h2>
        <p>{message}</p>
    </div>
}