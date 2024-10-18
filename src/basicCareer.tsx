import { backgroundStyle } from "./CSS/Background";
import { useState } from "react";
import { Container, Form } from "react-bootstrap";

export function BasicCareerComponent(): JSX.Element 
{

  const questions = [
    {question: "Mock Answer #1", isAnswered: false},
    {question: "Mock Answer #2", isAnswered: false},
    {question: "Mock Answer #3", isAnswered: false}
  ]

  const [progress, setProgress] = useState<number>(0);

  function updateAnswer(event: React.ChangeEvent<HTMLInputElement>, index: number) 
  {
    questions[index].isAnswered = !questions[index].isAnswered;
  }

  return (
    <div style={backgroundStyle}>
      <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px", marginRight: "30px" }}>
      
      <label htmlFor="question" style={{ marginRight: "10px" }}>
          Percent Complete: {progress.toFixed(0)}%
     </label>
      <progress id="question" value={progress} max="100" />
</div>
        <h1 style= {{textAlign: "center"}}>Here is the Basic Career Page!</h1>
        <br></br>
        <div>
        <Container style = {{border:"2px solid red"}}>
        <p> 
          This assessment is designed to determine an appopriate career path going forward. 
          You will be asked a series of multiple choice questions. If you're looking for more 
          in-depth questions, go to the Detailed Career Page. Before you begin, make sure you're 
          in a comfortable environment and answer each question to the best ability of your ability.
        </p>
        </Container>
        </div>
        <div
          style = {{marginLeft: "30px"}}>
          <br></br>
          {questions[0].question}
          <Form>
                    <Form.Check
                        type="radio"
                        label="answer"
                        name="quizAnswer"
                        value="answer" // Or some unique value
                        onChange = {(event) => updateAnswer(event, 0)} // Call updateAnswer on change
                    />
          </Form>
          {questions[1].question}
          <Form>
                    <Form.Check
                        type="radio"
                        label="answer"
                        name="quizAnswer"
                        value="answer" // Or some unique value
                        onChange ={(event) => updateAnswer(event, 1)}  // Call updateAnswer on change
                    />
          </Form>
          {questions[2].question}
          <Form>
                    <Form.Check
                        type="radio"
                        label="answer"
                        name="quizAnswer"
                        value="answer" // Or some unique value
                        onChange={(event) => updateAnswer(event, 2)}  // Call updateAnswer on change
                    />
          </Form>
        </div>
      </div>
    </div>
  );
}