import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import questionMarks from "./Images/Questions.png";
import detective2 from "./Images/Detective2.png";
import quizInterface from './Images/quizInterface.png';
import { Link } from "react-router-dom";

export interface DetailedQuestion // Interface to handle question attributes
{
  text: string;
  type: string;
  answered: boolean;
  page: number;
  answer: string;
  tip?: string;
}

interface submitButton{ // Interface for keeping track of Detailed Question Completion
  detailedComplete: boolean;
  toggleDetailed: (notDetailed: boolean) => void;
  setPage: (page: string) => void;
}

// interface UserProps
// {
//   db: IDBDatabase | null;
//   loggedUser: Account | null;
// }

export function DetailedCareerComponent({ detailedComplete, toggleDetailed, setPage}: submitButton): JSX.Element {
  const [questionPage, setQuestionPage] = useState<number>(0);
  const [tempAnswers, setTempAnswers] = useState<string[]>(new Array(7).fill(""));
  const [questions, setQuestions] = useState<DetailedQuestion[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [prompts, setPrompts] = useState<string[]>([]);

  const currentQuestion = questions.find(q => q.page === questionPage); //Variable to track which question is displayed
  if(sessionStorage.getItem("quizAnswers") === null){
    sessionStorage.setItem("quizAnswers", JSON.stringify({}))
  }

  const updateProgress = useCallback(() => 
  {
    const totalQuestions = questions.length;
    const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
    sessionStorage.setItem("quizAnswers", JSON.stringify(savedAnswers));
    const answeredQuestions = Object.keys(savedAnswers).filter(key => savedAnswers[key]).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    setProgress(progressPercentage);
    const updatedTags = assignTags(prompts);  // Map answers to tags
    setPrompts(updatedTags.map(tag => tag.response));

  }, [prompts, questions.length]);  

  useEffect(() => {
    let storedQuestions = [];
    storedQuestions = JSON.parse(sessionStorage.getItem("quizQuestions") || "[]");
    if (storedQuestions.length > 0) {
      setQuestions(storedQuestions);
      const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
      const updatedPrompts = Object.keys(savedAnswers).map((key) => savedAnswers[key]); 
      setPrompts(updatedPrompts); // Set the prompts after updating with saved answers
    } 
    else 
    {
      const defaultQuestions = [
        { text: "What did our suspect always want to be when they grew up?", type: "text", answered: false, page: 0, answer: "", tip: "A lot of kids want to be a police officer, firefighter, nurse, doctor, etc. when they grow up." },
        { text: "Whether inside or outside of school, what is our suspects favorite class that they have ever taken?", type: "text", answered: false, page: 1, answer: "", tip: "The class “Nebula Formation of Dying Stars” was Sarah's favorite, now she is an Aerospace Engineer."  },
        { text: "What societal stressor does our suspect feel most passionate about addressing?", type: "text", answered: false, page: 2, answer: "", tip: "Epidemics/Pandemics, Homelessness, Crime, Education, Agriculture, Technology, National Defense, Environmental Conservation, etc."  },
        { text: "What does our suspect dislike most about jobs or tasks they've had to do in the past?", type: "text", answered: false, page: 3, answer: "", tip: "A lot of people dislike working in groups as they have less control over the task at hand."  },
        { text: "What is a topic or subject that our suspect could teach someone about?", type: "text", answered: false, page: 4, answer: "", tip: "Bailey loves History, as a result she loves to share new historical facts that fascinate her. She is happy to discuss History with anybody that is willing to listen."  },
        { text: "What are our suspects favorite hobbies?", type: "text", answered: false, page: 5, answer: "", tip: "Do you enjoy any outdoor activities, sports, instruments, or games?"  },
        { text: "What 3 words would you use to describe our suspect?", type: "text", answered: false, page: 6, answer: "", tip: "How might a friend describe you? How might your sister describe you? How might a therapist describe you? How would you describe yourself? Are there any similarities?"  }
      ];
      setQuestions(defaultQuestions);
      sessionStorage.setItem("quizQuestions", JSON.stringify(defaultQuestions));
        const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
        const updatedTempAnswers = new Array(7).fill("");
        Object.keys(savedAnswers).forEach((key) => {
          updatedTempAnswers[parseInt(key)] = savedAnswers[key];
        });
        setTempAnswers(updatedTempAnswers);
      
        const totalQuestions = storedQuestions.length;
        const answeredQuestions = Object.keys(savedAnswers).filter(key => savedAnswers[key]);
        const progressPercentage = totalQuestions > 0 ? (answeredQuestions.length / totalQuestions) * 100 : 0;
        setProgress(progressPercentage);
    }
  }, []); // Make sure prompts are set first  

  function updateAnswered() { //Function to record the user's answer when they click the "Record Answer" button
    if (currentQuestion) {
      const updatedQuestions = [...questions];
      updatedQuestions[questionPage].answered = true;
      updatedQuestions[questionPage].answer = tempAnswers[questionPage]; 
      setQuestions(updatedQuestions); 
      const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}"); 
      savedAnswers[questionPage] = tempAnswers[questionPage]; 
      sessionStorage.setItem("quizAnswers", JSON.stringify(savedAnswers)); 
      updateProgress();
    }if(tempAnswers[questionPage]){
      setQuestionPage(prev => Math.min(questions.length - 1, prev + 1))
    }
  }

  function assignTags(prompts: string[]): { response: string, tag: number }[] {
    return prompts.map((response, index) => ({
      tag: index,
      response
    }));
  }  
  
  function handleAnswerChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTempAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionPage] = event.target.value;
      return updatedAnswers;
    });
  }  

  function toggleExplanation() { //Turns explanation blurb on and off
    setShowExplanation(prev => !prev);
  }

  function IsRecorded({ savedAnswer, currentText }: { savedAnswer: string; currentText: string }) { //Displays the user's recorded answer
    return (
      <div>
        Your Answer: {savedAnswer}
        <div>
        {savedAnswer === currentText ? "Response Recorded!" : "Please Record Your Response!"}
        </div>
      </div>
      
    );
  }

  function handleSubmit({detailedComplete, toggleDetailed}: submitButton)
  {
  toggleDetailed(true); // guest logic
   alert("Thanks for completing the Detailed Career quiz!");
  }

function DetailedSubmit({detailedComplete, toggleDetailed}: submitButton): JSX.Element { //Submit button - disabled if progress is less than 100
  return(<div>
    <Button style = {{height: "50px", width: "75px", borderRadius: "15px", background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} disabled={progress < 100} onClick={() => handleSubmit({detailedComplete, toggleDetailed, setPage})}>Submit</Button>
  </div>)
}

  function handleClear({detailedComplete, toggleDetailed, setPage}:submitButton){ //Function to handle clearing quiz and resetting progress
    sessionStorage.removeItem("quizAnswers"); //removes saved answers from storage
    sessionStorage.removeItem("quizQuestions"); //removes saved questions from storage
    const defaultQuestions = [
      { text: "What did our suspect always want to be when they grew up?", type: "text", answered: false, page: 0, answer: "", tip: "A lot of kids want to be a police officer, firefighter, nurse, doctor, etc. when they grow up." },
      { text: "Whether inside or outside of school, what is our suspects favorite class that they have ever taken?", type: "text", answered: false, page: 1, answer: "", tip: "The class “Nebula Formation of Dying Stars” was Sarah's favorite, now she is an Aerospace Engineer."  },
      { text: "What societal stressor does our suspect feel most passionate about addressing?", type: "text", answered: false, page: 2, answer: "", tip: "Epidemics/Pandemics, Homelessness, Crime, Education, Agriculture, Technology, National Defense, Environmental Conservation, etc."  },
      { text: "What does our suspect dislike most about jobs or tasks they've had to do in the past?", type: "text", answered: false, page: 3, answer: "", tip: "A lot of people dislike working in groups as they have less control over the task at hand."  },
      { text: "What is a topic or subject that our suspect could teach someone about?", type: "text", answered: false, page: 4, answer: "", tip: "Bailey loves History, as a result she loves to share new historical facts that fascinate her. She is happy to discuss History with anybody that is willing to listen."  },
      { text: "What are our suspects favorite hobbies?", type: "text", answered: false, page: 5, answer: "", tip: "Do you enjoy any outdoor activities, sports, instruments, or games?"  },
      { text: "What 3 words would you use to describe our suspect?", type: "text", answered: false, page: 6, answer: "", tip: "How might a friend describe you? How might your sister describe you? How might a therapist describe you? How would you describe yourself? Are there any similarities?"  }
    ]; //Initializes a questions array with blank answers, false answer value
    setQuestions(defaultQuestions); //Update state with empty questions array
    setTempAnswers(new Array(defaultQuestions.length).fill("")); //Initializes a new array the length of the defaultQuestions array and fills it with empty strings
    setProgress(0); //Reset progress
    setTimeout(() => {
      alert("Quiz Cleared!");
  }, 0); //Wait until all of the clear logic runs before displaying message
    setQuestionPage(prev => Math.min(questions.length - 1, 0))
    toggleDetailed(false)
  }

  function DetailedClear({detailedComplete, toggleDetailed, setPage}:submitButton){ //Clear button
    return(<div>
      <Button onClick={() => handleClear({detailedComplete, toggleDetailed, setPage})} style = {{height: "50px", width: "75px", borderRadius: "15px", background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}}>Clear</Button>
    </div>)
  }

  function getSavedAnswer(page: number) {
    const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");  
    return savedAnswers[page] || ""; // Return the saved answer or an empty string if not present
  }  
  
  return (
    <header>
    <div className="Background" style={{position: 'absolute', zIndex: 10}}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px", marginRight: "30px" }}>
          <label htmlFor="question" style={{ marginRight: "10px", fontSize: "25px" }}>
            Percent Complete: {progress.toFixed(0)}%
          </label>
          <progress id="question" value={progress} max="100" style={{ height: "45px", width: "300px" }} />
        </div>
      <div style={{textAlign: "center"}}>
        <h2>Our witnesses know our suspect in various ways. Find out what they know.</h2>
      </div>
      <br/>
      <br/>
      <div>
      {currentQuestion && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h3>{currentQuestion.text}
          <Button 
            onClick={toggleExplanation} 
            style={{fontSize: '24px', marginLeft: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'blue' }}>
            ?
          </Button>
          </h3>
          {showExplanation && (
            <div style={{color: "black", marginTop: '10px', padding: '10px', border: '1px solid lightgray', borderRadius: '5px', background: '#f9f9f9' }}>
              <p>{currentQuestion.tip}</p>
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
            <img src={detective2} alt="Detective" style={{ width: '10%', height: '10%', marginRight: '10px' }} />
              <textarea 
                value={tempAnswers[questionPage]} 
                onChange={handleAnswerChange} 
                style={{ width: '25%', resize: 'none', minHeight:"5em" }} 
              />
            <img src={questionMarks} alt="Question Marks" style={{ width: '10%', height: '10%', marginLeft: '10px' }} />
          </div>
        </div>
      )}
      <div style={{textAlign: "center"}}>
        {currentQuestion && (<div style={{marginTop: "20px"}}>
          <IsRecorded savedAnswer={getSavedAnswer(questionPage)} currentText={tempAnswers[questionPage]} /></div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px', padding: "0 37%" }}>
        <Button style={{background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} onClick={() => setQuestionPage(prev => Math.max(0, prev - 1))} disabled={questionPage === 0}>Previous</Button>
        <Button style={{background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid", width: "200px"}} onClick={() => updateAnswered()}>Record Answer</Button>
        <Button style={{background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} onClick={() => setQuestionPage(prev => Math.min(questions.length - 1, prev + 1))} disabled={questionPage === 6}>Next</Button>
      </div>
    </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}>
        
        <DetailedSubmit setPage={setPage} detailedComplete={detailedComplete} toggleDetailed={toggleDetailed}/>
        <DetailedClear setPage={setPage} detailedComplete={detailedComplete} toggleDetailed={toggleDetailed}/>
      </div>
      {detailedComplete && <div style={{ display: "flex", justifyContent: "center" }}>
        <Link to="/results-page" onClick={() => setPage("Results-Page")}>
          <Button className="flashy-button">Approach Police Chief</Button>
        </Link>
      </div>}
    </div>
    <img className='home-background' src={quizInterface} alt='Quiz Interface' style={{position: 'relative', zIndex: -1}} />
  </header>
  );
}
