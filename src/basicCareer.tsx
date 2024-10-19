import { backgroundStyle } from "./CSS/Background";
import { useState } from "react";
import { Container, Form } from "react-bootstrap";

export function BasicCareerComponent(): JSX.Element 
{
    const [progress, setProgress] = useState<number>(0);
    const [questions, setQuestions] = useState([
        { text: "Mock Question #1", choices: [{ id: 1, label: "choice-1" }, { id: 2, label: "choice-2" }, { id: 3, label: "choice-3" }], selected: [false, false, false] },
        { text: "Mock Question #2", choices: [{ id: 1, label: "choice-1" }, { id: 2, label: "choice-2" }, { id: 3, label: "choice-3" }], selected: [false, false, false] },
        { text: "Mock Question #3", choices: [{ id: 1, label: "choice-1" }, { id: 2, label: "choice-2" }, { id: 3, label: "choice-3" }], selected: [false, false, false] },
        { text: "Mock Question #4", choices: [{ id: 1, label: "choice-1" }, { id: 2, label: "choice-2" }, { id: 3, label: "choice-3" }], selected: [false, false, false] },
        { text: "Mock Question #5", choices: [{ id: 1, label: "choice-1" }, { id: 2, label: "choice-2" }, { id: 3, label: "choice-3" }], selected: [false, false, false] },
        { text: "Mock Question #6", choices: [{ id: 1, label: "choice-1" }, { id: 2, label: "choice-2" }, { id: 3, label: "choice-3" }], selected: [false, false, false] },
        { text: "Mock Question #7", choices: [{ id: 1, label: "choice-1" }, { id: 2, label: "choice-2" }, { id: 3, label: "choice-3" }], selected: [false, false, false] }
      ]);

      function updateAnswer(event: React.ChangeEvent<HTMLInputElement>, index: number) 
      {
        const updatedQuestions = [...questions];
      
        if (updatedQuestions[index].selected.every((isSelected) => isSelected === false)) 
        {
          updatedQuestions[index].selected = updatedQuestions[index].selected.map(() => true);
          setQuestions(updatedQuestions);
          updateProgress(index);
        } 
        else 
        {
          setQuestions(updatedQuestions); // Still need to update state for other UI updates
        }
      }
      
      function updateProgress(index: number): void 
      {
        setProgress((prevProgress) => Math.min(prevProgress + (100 / questions.length), 100));
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
          {questions[0].text}
          <Form>
                    {questions[0].choices.map((choice) =>
                    <Form.Check
                    key = {choice.id}
                    type = "radio"
                    label = {choice.label}
                    name = "basic-question"
                    value = {choice.label}
                    onChange={(event) => updateAnswer(event, 0)}
                    >
                    </Form.Check>)}
          </Form>
          {questions[1].text}
          <Form>
                    {questions[1].choices.map((choice) =>
                    <Form.Check
                    key = {choice.id}
                    type = "radio"
                    label = {choice.label}
                    name = "basic-question"
                    value = {choice.label}
                    onChange={(event) => updateAnswer(event, 1)}
                    >
                    </Form.Check>)}
          </Form>
          {questions[2].text}
          <Form>
          {questions[2].choices.map((choice) =>
                    <Form.Check
                    key = {choice.id}
                    type = "radio"
                    label = {choice.label}
                    name = "basic-question"
                    value = {choice.label}
                    onChange={(event) => updateAnswer(event, 2)}
                    >
                    </Form.Check>)}
          </Form>
          {questions[3].text}
          <Form>
          {questions[3].choices.map((choice) =>
                    <Form.Check
                    key = {choice.id}
                    type = "radio"
                    label = {choice.label}
                    name = "basic-question"
                    value = {choice.label}
                    onChange={(event) => updateAnswer(event, 3)}
                    >
                    </Form.Check>)}
          </Form>
          {questions[4].text}
          <Form>
          {questions[4].choices.map((choice) =>
                    <Form.Check
                    key = {choice.id}
                    type = "radio"
                    label = {choice.label}
                    name = "basic-question"
                    value = {choice.label}
                    onChange={(event) => updateAnswer(event, 4)}
                    >
                    </Form.Check>)}
          </Form>
          {questions[5].text}
          <Form>
          {questions[5].choices.map((choice) =>
                    <Form.Check
                    key = {choice.id}
                    type = "radio"
                    label = {choice.label}
                    name = "basic-question"
                    value = {choice.label}
                    onChange={(event) => updateAnswer(event, 5)}
                    >
                    </Form.Check>)}
          </Form>
          {questions[6].text}
          <Form>
          {questions[6].choices.map((choice) =>
                    <Form.Check
                    key = {choice.id}
                    type = "radio"
                    label = {choice.label}
                    name = "basic-question"
                    value = {choice.label}
                    onChange={(event) => updateAnswer(event, 6)}
                    >
                    </Form.Check>)}
          </Form>
        </div>
      </div>
    </div>
  );
}