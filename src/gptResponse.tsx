import { useState } from "react";
import { getChatGptResponse } from "./chatGpt";
import { Button } from "react-bootstrap";

interface taggedAnswer {
  answer: string;
  tag: string;
}

export function GptResponse({ apiKey, taggedAnswers }: { apiKey: string, taggedAnswers: taggedAnswer[] }): JSX.Element {
  const [message, setMessage] = useState<string>("Default");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generatePrompt = (taggedAnswers: taggedAnswer[]): string => {
    const tagsMap: { [key: string]: string } = {};
    taggedAnswers.forEach(({ answer, tag }) => {
      tagsMap[tag] = answer;
    });

    const basicPromptTemplate = `
    I am an individual searching for a career path. Some important things to consider are that I would prefer to work in a {environment} type of environment, interacting with others {interaction}. 
    I prefer {noise} noise in my work environment, and I believe that communication is {communication}. 
    I am educated with a {education} and ideally I would like to make {salary} annually. 
    Lastly, I am {techComfort} with technology, I am {manualLabor} comfortable with manual labor, and I am interested in {STEM} when it comes to STEM.
    What would be some ideal career paths for me and why? Give me 5 careers including career name, salary, how to get started, and why it would appeal to me based on my responses.
    `;

    return basicPromptTemplate.replace(/{(.*?)}/g, (match, tag) => {
      return tagsMap[tag] || match;
    });
  };

  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      console.log(taggedAnswers);
      const prompt = generatePrompt(taggedAnswers); // Generate prompt
      const data = await getChatGptResponse(prompt, apiKey); // Send prompt to ChatGPT
      const formattedResponse = formatResponse(data.choices[0].message.content); // Format response
      setMessage(formattedResponse); // Get the formatted response from ChatGPT
    } catch (error) {
      console.error("Error getting response from ChatGPT:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (response: string): string => {
    // 1. Remove asterisks
    const boldText = response.replace(/\*(.*?)\*/g, (match, p1) => {
      return ``;
    });

    // 2. Add line break after numbered items like 1., 2., etc.
    const formattedResponse = boldText.replace(/(\d+\.)/g, (match) => {
      return `<br /><br />${match}`; // Insert a double line break before the number and dot
    });

    // 3. Add line breaks after each highlight
    const fullyFormatted = formattedResponse.replace(/( - S| - H| - W)/g, (match) => {
      return `<br />${match}`; // Insert a line break before each highlight
    });

    return fullyFormatted;
  };

  return (
    <div>
      <Button onClick={handleSendMessage} disabled={isLoading}>
        GPT Test: {isLoading ? "loading" : "send"}
      </Button>
      <div>
        <h2>Results:</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: message, // Use dangerouslySetInnerHTML to render HTML tags
          }}
        />
      </div>
    </div>
  );
}
