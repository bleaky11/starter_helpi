import { useState } from "react";
import { getChatGptResponse } from "./chatGpt";
import { Button } from "react-bootstrap";

interface taggedAnswer { //Interface to provide an array of key:value pairs for user's answers
  answer: string;
  tag: string;
}


// Function that takes in an API key (entered on homepage) and an array of key:value paired answers (provided by basic quiz), then
// places the answers into a prompt. Prompt is sent to chatGPT and first response is returned.
export function GptResponse({ apiKey, taggedAnswers }: { apiKey: string, taggedAnswers: taggedAnswer[] }): JSX.Element {
  const [message, setMessage] = useState<string>("Default");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generatePrompt = (taggedAnswers: taggedAnswer[]): string => { //Helper function that takes in the array of key:value paired answers and replaces each key in prompt template with the correlated value.
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

    return basicPromptTemplate.replace(/{(.*?)}/g, (match, tag) => { //Returns above template with user's answers in place of placeholders.
      return tagsMap[tag] || match;
    });
  };

  const handleSendMessage = async () => { //Handles sending and receiving response from chatGPT
    setIsLoading(true);
    try {
      const prompt = generatePrompt(taggedAnswers); // Generate prompt
      const data = await getChatGptResponse(prompt, apiKey); // Send prompt to ChatGPT
      const formattedResponse = formatResponse(data.choices[0].message.content); // Format response
      setMessage(formattedResponse); // Set the formatted response from ChatGPT
    } catch (error) {
      console.error("Error getting response from ChatGPT:", error); //Error handling
    } finally {
      setIsLoading(false); //Set loading state to false
    }
  };

  const formatResponse = (response: string): string => { //Helper function to format ChatGPT response. Removes asterisks and adds line breaks for readability.
    //Remove asterisks
    const boldText = response.replace(/\*(.*?)\*/g, (match, p1) => {
      return ``;
    });

    //Add double line break after each item
    const formattedResponse = boldText.replace(/(\d+\.)/g, (match) => {
      return `<br /><br />${match}`;
    });

    //Add line breaks after each highlight (salary, how to start, why)
    const fullyFormatted = formattedResponse.replace(/( - S| - H| - W)/g, (match) => {
      return `<br />${match}`;
    });

    return fullyFormatted;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Button onClick={handleSendMessage} disabled={isLoading} style={{ marginBottom: '20px' }}>
        GPT Test: {isLoading ? "loading" : "send"}
      </Button>
      
      <div>
        <h2>Results:</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: message,
          }}
        />
      </div>
    </div>
  );
}
