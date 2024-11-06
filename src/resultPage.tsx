
import { Container } from "react-bootstrap";

interface completed{
    basicComplete: boolean;
    detailedComplete: boolean;
    apiKey: string;
}

export function ResultPage({basicComplete, detailedComplete, apiKey}: completed): JSX.Element
{

    return (
    <div className="Background">
        <h1 className="App" style={{ paddingTop: "1%"}}>Here is the Results Page!</h1>
        <Container style={{ border: "2px solid red" }}> 
            Chatgpt generated response will be displayed here after you have completed either the basics questions or the detailed questions. 
            Results will be more accurate if you finished both.
        </Container>
        {!(basicComplete && detailedComplete) && <h2 style={{textAlign: "center", paddingTop:"5%"}}>Complete some questions for results</h2>}
        {/* <GptResponse apiKey={apiKey}></GptResponse> */}
    </div>
    )
}