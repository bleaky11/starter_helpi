import { useState } from "react";
import { getChatGptResponse } from "./chatGpt";
import { Button } from "react-bootstrap";

interface taggedAnswer { //Interface to provide an array of key:value pairs for user's answers
  answer: string;
  tag: string;
}

interface detailedAnswer {
  response: string;
  tag: number
}

// Function that takes in an API key (entered on homepage) and an array of key:value paired answers (provided by basic quiz), then
// places the answers into a prompt. Prompt is sent to chatGPT and first response is returned.
// Function to handle responses from ChatGPT
export function GptResponse({ apiKey, taggedAnswers, detailedAnswers }: { apiKey: string, taggedAnswers: taggedAnswer[], detailedAnswers: detailedAnswer[] }): JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [keyState, setKeyState] = useState<string>("Valid");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseCount, setResponseCount] = useState<number>(0);

  const [conversationHistory, setConversationHistory] = useState<any[]>([]); // Store the conversation history

  const generatePrompt = (taggedAnswers: taggedAnswer[], detailedAnswers: detailedAnswer[]): string => {
    // Prepare the prompt based on quiz answers (same as before)
    const tagsMap: { [key: string]: string } = {};
    taggedAnswers.forEach(({ answer, tag }) => {
        tagsMap[tag] = answer;
    });

    detailedAnswers.forEach(({ response, tag }) => {
        tagsMap[tag.toString()] = response;
    });

    const basicPromptTemplate = `I would prefer to work in a {environment} type of environment, interacting with others {interaction}. 
    I prefer {noise} noise in my work environment, and I believe that communication is {communication}. 
    I am educated with a {education} and ideally I would like to make {salary} annually. 
    Lastly, I am {techComfort} with technology, I am {manualLabor} comfortable with manual labor, and I am interested in {STEM} when it comes to STEM.`;

    const detailedPromptTemplate = `When I was younger, I always wanted to be a {0} and my favorite class that I've taken was {1}. 
    Out of every societal issue, I think its important to address {2}. In the past, I’ve disliked {3} about my jobs. 
    My favorite hobbies are {4}, and a topic that I love so much I could teach someone about it is {5}. The best words to describe me are {6}.`;

    let fullPrompt: string = '';

    if(detailedAnswers.length > 0 && taggedAnswers.length > 0) {
      fullPrompt = `${basicPromptTemplate}\n${detailedPromptTemplate}`;
    }
    else if(detailedAnswers.length > 0) {
      fullPrompt = detailedPromptTemplate;
    }
    else {
      fullPrompt = basicPromptTemplate;
    }

    fullPrompt += `\nGive me my most ideal career path and why. Include salary, how to get started, and why it appeals. Keep responses short, do not include a numbered list,
    format like so: Career Path: (new line) - Salary: (new line) - How to get started: (new line) - Why it appeals:`;

    return fullPrompt.replace(/{(.*?)}/g, (match, tag) => {
        return tagsMap[tag] || match; 
    });
  };

  const handleSendMessage = async () => {
    setIsLoading(true);
    setResponseCount(responseCount + 1)
    try {
      const prompt = generatePrompt(taggedAnswers, detailedAnswers);
      const newMessage = {
        role: 'user',
        content: prompt,
      };
      
      // Add the initial message to the conversation history
      const newConversationHistory = [...conversationHistory, newMessage];
      setConversationHistory(newConversationHistory); // Update the conversation state

      const data = await getChatGptResponse(prompt, apiKey, newConversationHistory); // Send entire conversation history
      const formattedResponse = formatResponse(data.choices[0].message.content);
      setMessage(formattedResponse); 
    } catch (error) {
      console.error("Error getting response from ChatGPT:", error);
      setMessage("OpenAI API Key is invalid. Please Return to the homepage and enter a valid key.");
      setKeyState("Invalid");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFollowUp = async (followUpMessage: string) => {
    setIsLoading(true);
    try {
      const newFollowUp = {
        role: 'user',
        content: followUpMessage,
      };
      
      const newConversationHistory = [...conversationHistory, newFollowUp];
      setConversationHistory(newConversationHistory); // Update the conversation history

      // Send the entire conversation history including the follow-up message
      const data = await getChatGptResponse(followUpMessage, apiKey, newConversationHistory);
      const formattedResponse = formatResponse(data.choices[0].message.content);
      setMessage(formattedResponse); 
    } catch (error) {
      console.error("Error getting response from ChatGPT:", error);
      setMessage("OpenAI API Key is invalid. Please Return to the homepage and enter a valid key.");
      setKeyState("Invalid");
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (response: string): string => {
    console.log("I am called");

    let formattedResponse = response.replace(/- Salary:/g, "<br /><br />- Salary: ");

    let doublyFormatted = formattedResponse.replace(/- How/g, "<br /><br />- How ");

    let triplyFormatted = doublyFormatted.replace(/- Why/g, "<br /><br />- Why ");

    return triplyFormatted;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: "67vh" }}>
      <Button onClick={handleSendMessage} style = {{cursor: isLoading ? "not-allowed": "pointer", pointerEvents: "auto"}} disabled={isLoading} className="flashy-button">
        {isLoading ? "Chief is Reading" : "Present Your Case"}
      </Button>
      
      <div>
        <h4>Your suspect may have this occupation:</h4>
        {keyState === "Valid" ? (
          <div style={{fontSize: '15px', pointerEvents: "none"}} dangerouslySetInnerHTML={{ __html: message }} />
        ) : (
          <div style={{color:"red", fontSize:"large"}}>{message}</div>
        )}
      </div>
      <div style={{display: "flex", gap: "10px"}}>
        <Button onClick={() => handleSendFollowUp("Give me another one. Keep formatting rules consistent.")} disabled={isLoading || responseCount === 0} className="flashy-button">Try again</Button>
        <Button onClick={() => handleSendFollowUp("Can you expand upon how to get started and why this appeals for the same exact career path? Keep formatting rules and name consistent.")} disabled={isLoading || responseCount === 0} className="flashy-button">Tell me more</Button>
      </div>
    </div>
  );
}