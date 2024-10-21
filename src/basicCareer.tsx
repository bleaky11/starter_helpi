import { backgroundStyle } from "./CSS/Background";
import { useState } from "react";
import { FormCheckType } from "react-bootstrap/esm/FormCheck";
import { Button, Container, Form } from "react-bootstrap";

export interface submitButton{ // Interface for keeping track of Basic Question Completion
  basicComplete: boolean;
  toggleBasic: (notBasic: boolean) => void;
}
export function Submit({basicComplete, toggleBasic}: submitButton){
    toggleBasic(!basicComplete);
    alert("Thanks for completing the Basic Career quiz!");
}

export function BasicCareerComponent({basicComplete, toggleBasic}: submitButton): JSX.Element 
{
  const [progress, setProgress] = useState<number>(0);
  const [questions, setQuestions] = useState([
    { text: "How much noise do you mind in your work environment?", type: "radio", choices: [{ id: 1, label: "No noise" }, { id: 2, label: "A little noise" }, { id: 3, label: "A lot of noise" }, {id: 4, label: "I don't mind any"}], selected: [false, false, false, false] },
    { text: "What type of environment would you prefer to work in?", type: "checkbox", choices: [{ id: 1, label: "Office" }, { id: 2, label: "Outdoors" }, { id: 3, label: "Remote" }, {id: 4, label: "Hybrid" }], selected: [false, false, false, false] },
    { text: "Are you interested in any STEM fields?", type: "checkbox", choices: [{ id: 1, label: "Science" }, { id: 2, label: "Technology" }, { id: 3, label: "Engineering" }, { id: 4, label: "Math" }, { id: 5, label: "None" } ], selected: [false, false, false, false, false]},
    { text: "Would you be fine doing manual labor?", type: "radio", choices: [{ id: 1, label: "Not at all" }, { id: 2, label: "Some is fine" }, { id: 3, label: "More often than not" }, { id: 4, label: "Very comfortable" }], selected: [false, false, false, false] },
    { text: "How much would you like to interact with others?", type: "radio", choices: [{ id: 1, label: "Strictly never" }, { id: 2, label: "As little as possible" }, { id: 3, label: "Occasional interaction" },{ id: 4, label: "Fairly often" }, { id: 5, label: "All the time" } ], selected: [false, false, false, false, false] },
    { text: "How comfortable are you with technology?", type: "radio", choices: [{ id: 1, label: "Very uncomfortable" }, { id: 2, label: "Slightly uncomfortable" }, { id: 3, label: "Decently experienced" }, {id: 4, label: "Extremely comfortable"}], selected: [false, false, false, false] },
    { text: "What is your ideal annual salary?", type: "radio", choices: [{ id: 1, label: "$30k - $50k" }, { id: 2, label: "$50k - $70k" }, { id: 3, label: "$70k - $90k" }, {id: 4, label: "$90k - $110k"}], selected: [false, false, false, false] },
    { text: "How much do you value communication skills?", type: "radio", choices: [{ id: 1, label: "Not important at all" }, { id: 2, label: "A fair amount" }, { id: 3, label: "A lot" }, {id: 4, label: "Extremely important"}], selected: [false, false, false, false] },
    { text: "What's the highest level of education you plan on taking?", type: "radio", choices: [{ id: 1, label: "High School diploma" }, { id: 2, label: "Bachelor's Degree" }, { id: 3, label: "Master's Degree" }, {id: 4, label: "Doctoral Degree"}], selected: [false, false, false, false] }
  ]);
  
  function BasicSubmit({basicComplete, toggleBasic}: submitButton): JSX.Element {
    return(<div>
      <Button style = {{height: "50px", width: "75px", borderRadius: "15px"}} disabled={progress < 100} onClick={() => Submit({basicComplete, toggleBasic})}>Submit</Button>
    </div>)
  }
  
  function updateAnswer(event: React.ChangeEvent<HTMLInputElement>, index: number, selectIndex: number) {
    const updatedQuestions = [...questions];

    if (updatedQuestions[index].type === "radio") {
      // Set all to false and only mark the selected index as true
      updatedQuestions[index].selected = updatedQuestions[index].selected.map((_, i) => i === selectIndex);
    } else {
      // Checkbox logic
      updatedQuestions[index].selected[selectIndex] = event.target.checked;
    }
    setQuestions(updatedQuestions);
    updateProgress(updatedQuestions); 
  }

  function updateProgress(updatedQuestions: typeof questions): void {
    const totalQuestions = updatedQuestions.length;
    const answeredQuestions = updatedQuestions.filter((question) =>
      question.selected.some((isSelected) => isSelected)
    ).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    setProgress(progressPercentage);
  }

  const [save, setSave] = useState<JSX.Element>(
    <div style={backgroundStyle}>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px", marginRight: "30px" }}>
          <label htmlFor="question" style={{ marginRight: "10px" }}>
            Percent Complete: {progress.toFixed(0)}%
          </label>
          <progress id="question" value={progress} max="100" />
        </div>
        <h1 style={{ textAlign: "center" }}>Here is the Basic Career Page!</h1>
        <br />
        <div>
          <Container style={{ border: "2px solid red" }}>
            <p>
              This assessment is designed to determine an appropriate career path going forward.
              You will be asked a series of multiple choice questions. If you're looking for more
              in-depth questions, go to the Detailed Career Page. Before you begin, make sure you're
              in a comfortable environment and answer each question to the best of your ability.
            </p>
          </Container>
        </div>
        <div style={{ marginLeft: "100px"}}> {/* Add styles as needed */}
          <br />
          {questions.map((question, index) => (
            <div key={index}>
              <b>{question.text}</b>
              <Form>
                {question.choices.map((choice, selectIndex) => (
                  <Form.Check
                    key={choice.id}
                    type={question.type as FormCheckType}
                    label={choice.label}
                    name={`basic-question-${index}`} // Unique name for each question
                    value={choice.id}
                    checked={question.selected[selectIndex]} // Keep track of selected state
                    onChange={(event) => updateAnswer(event, index, selectIndex)}
                  />
                ))}
              </Form>
            </div>
          ))}
          <div style = {{display: "flex", float: "right"}}>
    <Button onClick = {() => setSave(save)} style={{ height: "50px", width: "75px", marginRight: "2px", borderRadius: "15px" }}>Save</Button>
    <BasicSubmit basicComplete={basicComplete} toggleBasic={toggleBasic}/>
    </div>
        </div>
</div>
</div>
  );
  return (
    <div style={backgroundStyle}>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px", marginRight: "30px" }}>
          <label htmlFor="question" style={{ marginRight: "10px" }}>
            Percent Complete: {progress.toFixed(0)}%
          </label>
          <progress id="question" value={progress} max="100" />
        </div>
        <h1 style={{ textAlign: "center" }}>Here is the Basic Career Page!</h1>
        <br />
        <div>
          <Container style={{ border: "2px solid red" }}>
            <p>
              This assessment is designed to determine an appropriate career path going forward.
              You will be asked a series of multiple choice questions. If you're looking for more
              in-depth questions, go to the Detailed Career Page. Before you begin, make sure you're
              in a comfortable environment and answer each question to the best of your ability.
            </p>
          </Container>
        </div>
        <div style={{ marginLeft: "100px"}}> {/* Add styles as needed */}
          <br />
          {questions.map((question, index) => (
            <div key={index}>
              <b>{question.text}</b>
              <Form>
                {question.choices.map((choice, selectIndex) => (
                  <Form.Check
                    key={choice.id}
                    type={question.type as FormCheckType}
                    label={choice.label}
                    name={`basic-question-${index}`} // Unique name for each question
                    value={choice.id}
                    checked={question.selected[selectIndex]} // Keep track of selected state
                    onChange={(event) => updateAnswer(event, index, selectIndex)}
                  />
                ))}
              </Form>
            </div>
          ))}
          <div style = {{display: "flex", float: "right"}}>
    <Button onClick = {() => setSave(save)} style={{ height: "50px", width: "75px", marginRight: "2px", borderRadius: "15px" }}>Save</Button>
    <BasicSubmit basicComplete={basicComplete} toggleBasic={toggleBasic}/>
    {save}
    </div>
        </div>
</div>
</div>
);
}