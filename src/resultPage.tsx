
import { Container } from "react-bootstrap";
import { GptResponse } from "./gptResponse";

interface completed{ //Interface to pass results logic
    basicComplete: boolean;
    detailedComplete: boolean;
    apiKey: string;
    answerVals: {answer: string, tag: string}[];
    //responses: {response: string, tag: number}[];
}

export function ResultPage({basicComplete, detailedComplete, apiKey, answerVals}: completed): JSX.Element
{
    const answers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
    return (
    <div className="Background">
        <h1 className="App" style={{ paddingTop: "1%"}}>Here is the Results Page!</h1>
        <Container style={{ border: "2px solid red" }}> 
            Chatgpt generated response will be displayed here after you have completed either the basics questions or the detailed questions. 
            Results will be more accurate if you finished both.
        </Container>
        {!(basicComplete && detailedComplete) && <h2 style={{textAlign: "center", paddingTop:"5%"}}>Complete some questions for results</h2>}
        <GptResponse apiKey={apiKey} taggedAnswers={answerVals} detailedAnswers = {answers}></GptResponse>
    </div>
    )
}