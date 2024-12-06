
import { Container } from "react-bootstrap";
import { GptResponse } from "./gptResponse";
import resultsPage from './Images/resultsPage.png';

interface completed{ //Interface to pass results logic
    basicComplete: boolean;
    detailedComplete: boolean;
    apiKey: string;
    answerVals: {answer: string, tag: string}[];
}

interface detailedAnswer {
    response: string;
    tag: number;
  }
  
  export function ResultPage({ basicComplete, detailedComplete, apiKey, answerVals}: completed): JSX.Element {
    
    const answers: detailedAnswer[] = Object.entries(
      JSON.parse(sessionStorage.getItem("quizAnswers") || "{}")
    ).map(([tag, response]) => ({
      response: response as string, // Type assertion to ensure 'response' is a string
      tag: parseInt(tag, 10), // Parsing tag into a number for 'detailedAnswer'
    }));
  
    console.log("Transformed answers:", answers);
  
    return (
      <header>
        <div style={{color: "black", paddingLeft: "2.5%", position: 'absolute', zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "auto"}}>
          {!(basicComplete) && (
            <h2 style={{ textAlign: "center", paddingTop: "5%" }}>Go collect some evidence, Detective!</h2>
          )}
          {(basicComplete && !detailedComplete) && (
              <h2 style={{ textAlign: "center", paddingTop: "5%" }}>You still have witnesses to question!</h2>
          )}
          <br />
          <GptResponse apiKey={apiKey} taggedAnswers={answerVals} detailedAnswers={answers} />
        </div>
        <img className='home-background' src={resultsPage} alt='Quiz Interface' style={{position: 'relative', zIndex: 0}} />
      </header>
    );
  }