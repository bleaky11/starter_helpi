import { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { FormCheckType } from 'react-bootstrap/esm/FormCheck';

export interface SubmitButton {
  basicComplete: boolean;
  toggleBasic: (notBasic: boolean) => void;
}

export interface saveButton
{
  savedBasicCareer: string
  setBasicCareer: (newState: string) => void;
}

interface Question 
{
  text: string;
  type: string;
  choices: { id: number; label: string }[];
  selected: boolean[];
}

interface Answers
{
  answers: {answer: string, tag: string}[];
  setAnswerVals: (newState: {answer: string, tag: string}[]) => void;
}

export function BasicCareerComponent({ basicComplete, toggleBasic , savedBasicCareer, setBasicCareer, answers, setAnswerVals }: SubmitButton & saveButton & Answers): JSX.Element 
{
  const [promptValues, setValues] = useState<string[]>([])
  const [progress, setProgress] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([{ text: "How much noise do you mind in your work environment?", type: "radio", choices: [{ id: 1, label: "No noise" }, { id: 2, label: "A little noise" }, { id: 3, label: "A lot of noise" }, { id: 4, label: "As much as possible" }], selected: [false, false, false, false] },
    { text: "What type of environment would you prefer to work in?", type: "checkbox", choices: [{ id: 1, label: "Office" }, { id: 2, label: "Outdoors" }, { id: 3, label: "Remote" }, { id: 4, label: "Hybrid" }], selected: [false, false, false, false] },
    { text: "Are you interested in any STEM fields?", type: "checkbox", choices: [{ id: 1, label: "Science" }, { id: 2, label: "Technology" }, { id: 3, label: "Engineering" }, { id: 4, label: "Math" }, { id: 5, label: "None" }], selected: [false, false, false, false, false] },
    { text: "Would you be fine doing manual labor?", type: "radio", choices: [{ id: 1, label: "Not at all" }, { id: 2, label: "Somewhat" }, { id: 3, label: "More often than not" }, { id: 4, label: "Extremely" }], selected: [false, false, false, false] },
    { text: "How much would you like to interact with others?", type: "radio", choices: [{ id: 1, label: "Strictly never" }, { id: 2, label: "As little as possible" }, { id: 3, label: "Occasionally" }, { id: 4, label: "Fairly often" }, { id: 5, label: "All the time" }], selected: [false, false, false, false, false] },
    { text: "How comfortable are you with technology?", type: "radio", choices: [{ id: 1, label: "Very uncomfortable" }, { id: 2, label: "Slightly uncomfortable" }, { id: 3, label: "Decently experienced" }, { id: 4, label: "Extremely comfortable" }], selected: [false, false, false, false] },
    { text: "What is your ideal annual salary?", type: "radio", choices: [{ id: 1, label: "$30k - $50k" }, { id: 2, label: "$50k - $70k" }, { id: 3, label: "$70k - $90k" }, { id: 4, label: "$90k - $110k" }], selected: [false, false, false, false] },
    { text: "How much do you value communication skills?", type: "radio", choices: [{ id: 1, label: "Not important at all" }, { id: 2, label: "Slightly Important" }, { id: 3, label: "Very Important" }, { id: 4, label: "Extremely important" }], selected: [false, false, false, false] },
    { text: "What's the highest level of education you plan on taking?", type: "radio", choices: [{ id: 1, label: "High School diploma" }, { id: 2, label: "Bachelor's Degree" }, { id: 3, label: "Master's Degree" }, { id: 4, label: "Doctoral Degree" }], selected: [false, false, false, false]}]);

  function handleBasicSave() //Saves user's progress to local storage
  {
    localStorage.setItem("basicQuizProgress", JSON.stringify(progress)); //keep track of question and progress states
    localStorage.setItem("basicQuizAnswers", JSON.stringify(questions));
    if(progress < 100)
    {
      alert("Quiz saved!");
    }
  }

  function handleClear(){ //Clears user's saved progress and resets quiz
    localStorage.removeItem("basicQuizProgress");
    localStorage.removeItem("basicQuizAnswers");
    const clearedQuestions = questions.map(question => ({
      ...question,
      selected: question.selected.map(() => false) // Reset all selected states to false
    }));
    setQuestions(clearedQuestions);
    setProgress(0);
    setTimeout(() => {
      alert("Quiz Cleared!");
  }, 0);
  }

  const getSelectedAnswer = (questions: Question[]) => { // Helper function to grab the user's selected answer string from each question
    return questions.map((question) => {
      const selectedChoiceIndex = question.selected.findIndex((selected) => selected === true);
      
      if (selectedChoiceIndex !== -1) {
        return {
          selectedAnswer: question.choices[selectedChoiceIndex].label,
        };
      } else {
        return {
          selectedAnswer: ""
        };
      }
    });
  };
  

  const handleUpdateValues = () => { // Helper function to populate array with user's answers
    const selectedAnswers = getSelectedAnswer(questions);
    const selectedAnswerLabels = selectedAnswers.map((answer) => answer.selectedAnswer);
    setValues(selectedAnswerLabels);
  };

  type AnswerTagMap = { // Initalize a key:value pair in order to assign an identifier for each question's answer
    [key: number]: string;
  };

  const answerTags: AnswerTagMap = { //Assigns a tag to identify each index of the answerVals array
    0: 'noise',
    1: 'environment',
    2: 'STEM',
    3: 'manualLabor',
    4: 'interaction',
    5: 'techComfort',
    6: 'salary',
    7: 'communication',
    8: 'education'
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function assignTagsToAnswers(answers: string[]): { answer: string, tag: string }[] { //Assigns initialized tags to each answer
    return answers.map((answer, index) => ({
      answer,
      tag: answerTags[index] || 'unknown',
    }));
  }



  function handleSubmit({basicComplete, toggleBasic}: SubmitButton) //Handles user submission of quiz
  {
    toggleBasic(true); //Sets state that tracks basic quiz completion to true
    handleBasicSave(); //Saves user's progress
    setBasicCareer("basicQuizAnswers"); //Sets state that tracks user's saved answers
    handleUpdateValues(); //Populates array to track user's answers to each question
    alert("Thanks for completing the Basic Career quiz!");
  }

  const clearStorage = () => 
    {
      localStorage.removeItem("basicQuizProgress");
      localStorage.removeItem("basicQuizAnswers");
      sessionStorage.removeItem("quizAttempt");
}

useEffect(() => { //Loads saved quiz data
  const savedBasicProgress = localStorage.getItem("basicQuizProgress");
  const savedBasicAnswers = localStorage.getItem("basicQuizAnswers");

  if (!savedBasicProgress && !savedBasicAnswers) {
      clearStorage(); 
      sessionStorage.setItem("quizAttempt", "true"); // track if the user has a saved quiz for next visit
  } 
  else if (savedBasicProgress && savedBasicAnswers )
  {
      setProgress(JSON.parse(savedBasicProgress || "0")); // Load saved progress
      setQuestions(JSON.parse(savedBasicAnswers || "[]")); // Load saved answers
  }
}, []);

useEffect(() => { //Populates and tags array of answers each time an answer is selected
  if (promptValues.length > 0) {
    const taggedAnswers = assignTagsToAnswers(promptValues);
    setAnswerVals(taggedAnswers);
  }
}, [assignTagsToAnswers, promptValues, setAnswerVals]);

  function BasicSubmit({basicComplete, toggleBasic}: SubmitButton): JSX.Element { //Submit button - Disabled if progress is less than 100%
    return(<div>
      <Button style = {{height: "50px", width: "75px", borderRadius: "15px", background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} disabled={progress < 100} onClick={() => [handleSubmit({basicComplete, toggleBasic}), ]}>Submit</Button>
    </div>)
  }

  function BasicSave({savedBasicCareer, setBasicCareer}: saveButton): JSX.Element  //Save button
  {
    return(<div>
      <Button onClick = {handleBasicSave} style = {{height: "50px", width: "75px", borderRadius: "15px", background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}}>Save</Button>
    </div>)
  }

  function BasicClear(){ //Clear button
    return(<div>
      <Button onClick={handleClear} style = {{height: "50px", width: "75px", borderRadius: "15px", background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}}>Clear</Button>
    </div>)
  }


  function updateAnswer(event: React.ChangeEvent<HTMLInputElement>, index: number, selectIndex: number) { //Function to accurately update progress - sets "answered" to true if question is answered, updates progress
    const updatedQuestions = [...questions];

    if (updatedQuestions[index].type === "radio") {
      updatedQuestions[index].selected = updatedQuestions[index].selected.map((_, i) => i === selectIndex); // line written by ChatGPT
    } else {
      // Checkbox logic
      updatedQuestions[index].selected[selectIndex] = event.target.checked;
    }
    setQuestions(updatedQuestions);
    updateProgress(updatedQuestions);
  }

  function updateProgress(updatedQuestions: typeof questions): void { //Function to handle progress bar updates
    const totalQuestions = updatedQuestions.length;
    const answeredQuestions = updatedQuestions.filter((question) =>
      question.selected.some((isSelected) => isSelected)
    ).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    setProgress(progressPercentage);
  }

  return (
    <div className="Background">
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px", marginRight: "30px" }}>
          <label htmlFor="question" style={{ marginRight: "10px", fontSize: "25px" }}>
            Percent Complete: {progress.toFixed(0)}%
          </label>
          <progress id="question" value={progress} max="100" style={{ height: "45px", width: "300px" }} />
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
        <div style={{ marginLeft: "100px", marginRight: "100px" }}>
          <br />
          <Row>
            {questions.map((question, index) => (
              <Col key={index} xs={12} md={4}> {/* 4 columns in medium size and above, full width on smaller screens */}
                <div>
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
              </Col>
            ))}
          </Row>
        </div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: "80px"}}>
    <BasicSave savedBasicCareer= {savedBasicCareer} setBasicCareer={setBasicCareer}/>
    <BasicSubmit basicComplete={basicComplete} toggleBasic={toggleBasic}/>
    <BasicClear/>
    </div>
      </div>
    </div>
  );
}
