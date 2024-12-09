import { useCallback, useEffect, useMemo, useState } from "react";
import { Database } from "./db";
import { Account } from "./homepagelogo";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FormCheckType } from 'react-bootstrap/esm/FormCheck';
import { Link} from "react-router-dom";
import detectiveWalk from './Images/detective-walking-unscreen.gif';
import quizInterface from './Images/quizInterface.png';

export interface SubmitButton {
  basicComplete: boolean;
  toggleBasic: (notBasic: boolean) => void;
}

export interface saveButton
{
  savedBasicCareer: string
  setBasicCareer: (newState: string) => void;
}

export interface Question 
{
  text: string;
  type: string;
  choices: { id: number; label: string }[];
  selected: boolean[];
}

export interface Pages 
{
  setPage: (page: string) => void;
}

interface Answers
{
  answers: {answer: string, tag: string}[];
  setAnswerVals: (newState: {answer: string, tag: string}[]) => void;
}

interface Users
{
  loggedUser: Account | null;
  setLoggedUser: React.Dispatch<React.SetStateAction<Account | null>>;
}

export function BasicCareerComponent({ db, setDb, basicComplete, toggleBasic , savedBasicCareer, setBasicCareer, answers, setAnswerVals, setPage, loggedUser, setLoggedUser}: SubmitButton & saveButton & Answers & Pages & Users & Database): JSX.Element 
{
  const defaultQuestions = useCallback(() => [{ text: "How much noise does our suspect mind in the work environment?", type: "radio", choices: [{ id: 1, label: "No noise" }, { id: 2, label: "A little noise" }, { id: 3, label: "A lot of noise" }, { id: 4, label: "As much as possible" }], selected: [false, false, false, false] },
  { text: "What type of environment would our suspect prefer to work in?", type: "checkbox", choices: [{ id: 1, label: "Office" }, { id: 2, label: "Outdoors" }, { id: 3, label: "Remote" }, { id: 4, label: "Hybrid" }], selected: [false, false, false, false] },
  { text: "Is our suspect interested in any STEM fields?", type: "checkbox", choices: [{ id: 1, label: "Science" }, { id: 2, label: "Technology" }, { id: 3, label: "Engineering" }, { id: 4, label: "Math" }, { id: 5, label: "None" }], selected: [false, false, false, false, false] },
  { text: "Would our suspect be fine doing manual labor?", type: "radio", choices: [{ id: 1, label: "Not at all" }, { id: 2, label: "Somewhat" }, { id: 3, label: "More often than not" }, { id: 4, label: "Extremely" }], selected: [false, false, false, false] },
  { text: "How much would our suspect like to interact with others?", type: "radio", choices: [{ id: 1, label: "Strictly never" }, { id: 2, label: "As little as possible" }, { id: 3, label: "Occasionally" }, { id: 4, label: "Fairly often" }, { id: 5, label: "All the time" }], selected: [false, false, false, false, false] },
  { text: "How comfortable is our suspect with technology?", type: "radio", choices: [{ id: 1, label: "Very uncomfortable" }, { id: 2, label: "Slightly uncomfortable" }, { id: 3, label: "Decently experienced" }, { id: 4, label: "Extremely comfortable" }], selected: [false, false, false, false] },
  { text: "What is our suspect's ideal salary?", type: "radio", choices: [{ id: 1, label: "$30k - $50k" }, { id: 2, label: "$50k - $70k" }, { id: 3, label: "$70k - $90k" }, { id: 4, label: "$90k - $110k" }], selected: [false, false, false, false] },
  { text: "How much does our suspect value communication skills?", type: "radio", choices: [{ id: 1, label: "Not important at all" }, { id: 2, label: "Slightly Important" }, { id: 3, label: "Very Important" }, { id: 4, label: "Extremely important" }], selected: [false, false, false, false] },
  { text: "What's the highest level of education our suspect plans on taking?", type: "radio", choices: [{ id: 1, label: "High School diploma" }, { id: 2, label: "Bachelor's Degree" }, { id: 3, label: "Master's Degree" }, { id: 4, label: "Doctoral Degree" }], selected: [false, false, false, false]}], []);

  const [promptValues, setValues] = useState<string[]>([])
  const [progress, setProgress] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [isSubmitted, setSubmission] = useState<boolean>(false);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      if (!db) return;
  
      const initializeGuestSession = () => {
        const savedBasicProgress = sessionStorage.getItem("basicQuizProgress");
        const savedBasicAnswers = sessionStorage.getItem("basicQuizAnswers");
  
        if (!savedBasicProgress && !savedBasicAnswers) {
          setProgress(0);
          setQuestions(defaultQuestions);
        } else {
          setProgress(JSON.parse(savedBasicProgress || "0"));
          setQuestions(JSON.parse(savedBasicAnswers || "[]"));
        }
      };
  
      try {
        const transaction = db.transaction("users", "readonly");
        const store = transaction.objectStore("users");
        const getLoggedInUserRequest = store.index("loggedIn").get("true");

        getLoggedInUserRequest.onsuccess = () => {
          const user = getLoggedInUserRequest.result;
          if (user) 
          {
            setQuestions(user.quiz.length ? user.quiz : defaultQuestions);
            setProgress(user.progress || 0);
          } else {
            initializeGuestSession();
          }
        };
  
        getLoggedInUserRequest.onerror = () => {
          initializeGuestSession();
        };
      } catch (error) {
        initializeGuestSession();
      }
    };
    fetchLoggedInUser();
    console.log("Running");
  }, [db, defaultQuestions, loggedUser]); 

  const handleBasicSave = useCallback(() =>
    {
      if (loggedUser && db) {
        const transaction = db.transaction("users", "readwrite");
        const store = transaction.objectStore("users");
    
        const updatedUser: Account = {
          ...loggedUser,
          quiz: [...questions],
          progress: progress,
          basicComplete: progress === 100 && isSubmitted, // Determine completion based on progress
        };
    
        const request = store.put(updatedUser);

        request.onsuccess = () => {
          setLoggedUser(updatedUser); 
          setSubmission(false); // Reset submission state after save
        };
      } else {
        // Save to sessionStorage for guests
        sessionStorage.setItem("basicQuizProgress", JSON.stringify(progress));
        sessionStorage.setItem("basicQuizAnswers", JSON.stringify(questions));
        setSubmission(false); // Reset submission state after save
      }
    }, [db, isSubmitted, loggedUser, progress, questions, setLoggedUser]) 

  useEffect(() => {
    if (isSubmitted) {
      handleBasicSave(); 
    }
  }, [handleBasicSave, isSubmitted]);
  
  function handleSubmit({ toggleBasic }: SubmitButton) {
    if (!loggedUser) {
      setBasicCareer("basicQuizAnswers"); // Save guest answers
      toggleBasic(true); // Mark basic quiz as completed
    }
    setSubmission(true); 
    handleUpdateValues(); 
  }

  function handleClear(){ //Clears user's saved progress and resets quiz
    const clearedQuestions = questions.map(question => ({
      ...question,
      selected: question.selected.map(() => false) // Reset all selected states to false
    }));
    setQuestions(clearedQuestions);
    setProgress(0);
    if(!loggedUser)
    {
        sessionStorage.removeItem("basicQuizProgress");
        sessionStorage.removeItem("basicQuizAnswers");
        sessionStorage.removeItem("basicCount"); // reset notification after clear
        toggleBasic(false);
    }
    else
    {
      sessionStorage.removeItem("userBasicCount");  // reset notification after clear
      setSubmission(true); // force an invoke of the submit useEffect to update basicComplete to false
    }
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

  const answerTags: AnswerTagMap = useMemo(() => ({
    0: 'noise',
    1: 'environment',
    2: 'STEM',
    3: 'manualLabor',
    4: 'interaction',
    5: 'techComfort',
    6: 'salary',
    7: 'communication',
    8: 'education'
  }), []);

  const assignTagsToAnswers = useCallback((answers: string[]): { answer: string, tag: string }[] => {
    return answers.map((answer, index) => ({
      answer,
      tag: answerTags[index] || "unknown",
    }));
  }, [answerTags]); // Dependency on answerTags, assuming answerTags might change
  
useEffect(() => { //Populates and tags array of answers each time an answer is selected
  if (promptValues.length > 0) {
    const taggedAnswers = assignTagsToAnswers(promptValues);
    setAnswerVals(taggedAnswers);
  }
}, [assignTagsToAnswers, promptValues, setAnswerVals]);

  function BasicSubmit({basicComplete, toggleBasic}: SubmitButton): JSX.Element { //Submit button - Disabled if progress is less than 100%
    return(<div>
      <Button style = {{height: "50px", width: "75px", borderRadius: "15px", background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} disabled={progress < 100} onClick={() => [handleSubmit({basicComplete, toggleBasic}), alert("Thank you for completeting the basic quiz!")]}>Submit</Button>
    </div>)
  }

  function BasicSave({savedBasicCareer, setBasicCareer}: saveButton): JSX.Element  //Save button
  {
    return(<div>
      <Button onClick={() => {handleBasicSave(); alert("Quiz saved!")}}
 style = {{height: "50px", width: "75px", borderRadius: "15px", background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}}>Save</Button>
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
    <header>
      <div className="Background" style={{position: 'absolute', zIndex: 10}}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px", marginRight: "30px" }}>
          <div style = {{display: "flex", justifyContent: "flex-end"}}>
          <label htmlFor="question" style={{ marginRight: "10px", fontSize: "25px" }}>
            Percent Complete: {progress.toFixed(0)}%
          </label>
          <progress
            id="question"
            value={progress}
            style = {{height: "45px", width: "300px"}}
            max="100"
          ></progress>
          </div>
          <div style={{ position: "relative", height: "25px"}}>
            <img
              src={detectiveWalk}
              alt="detective-walking"
              style={{
                position: "relative",
                left: `${(progress / 100) * 300 - 325}px`,
                transition: "left 1s ease-in",
                width: "45px",
                height: "auto", // Maintain aspect ratio
                marginTop: "35px"
              }}
            />
          </div>
        </div>
    
        {/* Basic Career Page content */}
        <h3 style={{ textAlign: "center" }}>Look Closely, Detective. What can you find out about our suspect's occupation?</h3>
        <br />    
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
    
        <div style={{ justifyContent: "center", marginTop: "80px" }}>
  {!loggedUser ? ( // User is not logged in
    basicComplete ? ( // Guest condition: basic quiz complete
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Link to="/results-page" onClick={() => setPage("Results-Page")}>
          <Button className="flashy-button">Approach Police Chief</Button>
        </Link>
      </div>
    ) : (
      null
    )
  ) : ( // User is logged in
    loggedUser.basicComplete ? ( // Logged-in condition: basic quiz complete
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Link to="/results-page" onClick={() => setPage("Results-Page")}>
          <Button className="flashy-button">Approach Police Chief</Button>
        </Link>
      </div>
    ) : null
  )}
</div>
    
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2px" }}>
          <BasicSave savedBasicCareer={savedBasicCareer} setBasicCareer={setBasicCareer} />
          <BasicSubmit basicComplete={basicComplete} toggleBasic={toggleBasic} />
          <BasicClear />
        </div>
      </div>
      <img className='home-background' src={quizInterface} alt='Quiz Interface' style={{position: 'relative', zIndex: 0}} />
    </header>
  );
}