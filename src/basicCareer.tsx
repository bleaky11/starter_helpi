import { backgroundStyle } from "./CSS/Background";
import { useState } from "react";
import { Container, Form } from "react-bootstrap";

export function BasicCareerComponent(): JSX.Element {
  const [progress, setProgress] = useState<number>(0);
  const [questions, setQuestions] = useState([
    { text: "How much noise do you mind in your work environment?", choices: [{ id: 1, label: "No noise" }, { id: 2, label: "A little noise" }, { id: 3, label: "A lot of noise" }, {id: 4, label: "I don't mind any"}], selected: [false, false, false] },
    { text: "What type of environment would you prefer to work in?", choices: [{ id: 1, label: "Office" }, { id: 2, label: "Outdoors" }, { id: 3, label: "Remote" }, {id: 4, label: "Hybrid" }], selected: [false, false, false] },
    { text: "Are you interested in any STEM fields?", choices: [{ id: 1, label: "Science" }, { id: 2, label: "Technology" }, { id: 3, label: "Engineering" }, { id: 4, label: "Math" }, { id: 5, label: "None" } ], selected: [false, false, false] },
    { text: "Would you be fine doing manual labor?", choices: [{ id: 1, label: "Not at all" }, { id: 2, label: "Some is fine" }, { id: 3, label: "More often than not" }, { id: 4, label: "Very comfortable" }], selected: [false, false, false] },
    { text: "How much would you like to interact with others?", choices: [{ id: 1, label: "Strictly never" }, { id: 2, label: "As little as possible" }, { id: 3, label: "Occasional interaction" },{ id: 4, label: "Fairly often" }, { id: 5, label: "All the time" } ], selected: [false, false, false] },
    { text: "How comfortable are you with technology?", choices: [{ id: 1, label: "Very uncomfortable" }, { id: 2, label: "Slightly uncomfortable" }, { id: 3, label: "Decently experienced" }, {id: 4, label: "Extrmemely comfortable"}], selected: [false, false, false] },
    { text: "What is your ideal annual salary?", choices: [{ id: 1, label: "$30k - $50k" }, { id: 2, label: "$50k - $70k" }, { id: 3, label: "$70k - $90k" }, {id: 4, label: "$90k - $110k"}], selected: [false, false, false] },
    { text: "How much do you value communication skills?", choices: [{ id: 1, label: "Not important at all" }, { id: 2, label: "A fair amount" }, { id: 3, label: "A lot" }, {id: 4, label: "Extremely important"}], selected: [false, false, false] },
    { text: "What's the highest level of education you plan on taking?", choices: [{ id: 1, label: "High School diploma" }, { id: 2, label: "Bachelor's Degree" }, { id: 3, label: "Master's Degree" }, {id: 4, label: "Doctoral Degree"}], selected: [false, false, false] }
  ]);

  function updateAnswer(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    const updatedQuestions = [...questions];

    if (updatedQuestions[index].selected.every((isSelected) => isSelected === false)) {
      updatedQuestions[index].selected = updatedQuestions[index].selected.map(() => true);
      setQuestions(updatedQuestions);
      updateProgress(index);
    } else {
      setQuestions(updatedQuestions); // Still need to update state for other UI updates
    }
  }

  function updateProgress(index: number): void {
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
        <h1 style={{ textAlign: "center" }}>Here is the Basic Career Page!</h1>
        <br />
        <div>
          <Container style={{ border: "2px solid red" }}>
            <p>
              This assessment is designed to determine an appropriate career path going forward.
              You will be asked a series of multiple choice questions. If you're looking for more
              in-depth questions, go to the Detailed Career Page. Before you begin, make sure you're
              in a comfortable environment and answer each question to the best ability of your ability.
            </p>
          </Container>
        </div>
        <div style={{ marginLeft: "100px"}}>
          <br />
          {questions.map((question, index) => (
            <div key={index}>
              <b>{question.text}</b>
              <Form>
                {question.choices.map((choice) => (
                  <Form.Check
                    key={choice.id}
                    type="radio"
                    label={choice.label}
                    name={`basic-question-${index}`} // Unique name for each question
                    value={choice.label}
                    onChange={(event) => updateAnswer(event, index)}
                  />
                ))}
              </Form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
