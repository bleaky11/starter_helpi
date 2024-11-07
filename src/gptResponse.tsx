import { useState } from "react";
import { getChatGptResponse } from "./chatGpt"
import { Button } from "react-bootstrap";

interface api {
    apiKey: string;
}

interface taggedAnswer {
  answer: string;
  tag: string;
}


export function GptResponse({ apiKey, taggedAnswers }: { apiKey: string, taggedAnswers: taggedAnswer[] }): JSX.Element {
    const [message, setMessage] = useState<string>("Default");
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const generatePrompt = (taggedAnswers: taggedAnswer[]): string => {
      const tagsMap: { [key: string]: string } = {};
      taggedAnswers.forEach(({ answer, tag }) => {
        tagsMap[tag] = answer;
      });

      const basicPromptTemplate = `
      I am an individual searching for a career path. Some important things to consider are that I would prefer to work in a {environment} type of environment, interacting with others {interaction}. 
      I prefer {noise} noise in my work environment, and I believe that communication is {communication}. 
      I am educated with a {education} and ideally I would like to make {salary} annually. 
      Lastly, I am {techComfort} with technology, I am {manualLabor} comfortable with manual labor, and I am (NOT interested in any STEM fields ||| interested in {STEM}.) 
      What would be some ideal career paths for me and why? Include career name, salary, how to get started, and why it would appeal to me as an individual.
    `;

    return basicPromptTemplate.replace(/{(.*?)}/g, (match, tag) => {
      return tagsMap[tag] || match;
    });
  };
  
  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      const prompt = generatePrompt(taggedAnswers); // Generate prompt
      console.log('Generated prompt:', prompt); // Check prompt
      const data = await getChatGptResponse(prompt, apiKey); // Send prompt to ChatGPT
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