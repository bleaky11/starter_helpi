import { useCallback, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import questionMarks from "./Images/Questions.png";
import detective2 from "./Images/Detective2.png";

interface submitButton{ // Interface for keeping track of Detailed Question Completion
  detailedComplete: boolean;
  toggleDetailed: (notDetailed: boolean) => void;
}

interface Question // Interface to handle question attributes
{
  text: string;
  type: string;
  answered: boolean;
  page: number;
  answer: string;
  tip?: string;
}

export function DetailedCareerComponent({ detailedComplete, toggleDetailed }: submitButton): JSX.Element {
  const [questionPage, setQuestionPage] = useState<number>(0);
  const [tempAnswers, setTempAnswers] = useState<string[]>(new Array(7).fill(""));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);


  const currentQuestion = questions.find(q => q.page === questionPage); //Variable to track which question is displayed
  if(sessionStorage.getItem("quizAnswers") === null){
    sessionStorage.setItem("quizAnswers", JSON.stringify({}))
  }

  const updateProgress = useCallback(() => { //When an answer to a question is saved, update progress
    const totalQuestions = questions.length;
    const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
    sessionStorage.setItem("quizAnswers", JSON.stringify(savedAnswers));
    const answeredQuestions = Object.keys(savedAnswers).filter(key => savedAnswers[key]).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    setProgress(progressPercentage);
  }, [questions]);

  useEffect(() => { //Allows for each question to have a different answerbox while still being editable
    const storedQuestions = JSON.parse(sessionStorage.getItem("quizQuestions") || "[]");
    if (storedQuestions.length > 0){
      setQuestions(storedQuestions)
    } else {
      const defaultQuestions = [
        { text: "What have you always wanted to be when you grew up?", type: "text", answered: false, page: 0, answer: "", tip: "A lot of kids want to be a police officer, firefighter, nurse, doctor, etc. when they grow up." },
        { text: "Whether inside or outside of school, what is your favorite class that you have ever taken?", type: "text", answered: false, page: 1, answer: "", tip: "The class “Nebula Formation of Dying Stars” was Sarah's favorite, now she is an Aerospace Engineer."  },
        { text: "What societal stressor do you feel most passionate about addressing?", type: "text", answered: false, page: 2, answer: "", tip: "Epidemics/Pandemics, Homelessness, Crime, Education, Agriculture, Technology, National Defense, Environmental Conservation, etc."  },
        { text: "What did you dislike most about jobs or tasks you've had to do in the past?", type: "text", answered: false, page: 3, answer: "", tip: "A lot of people dislike working in groups as they have less control over the task at hand."  },
        { text: "What is a topic or subject that you could teach someone about?", type: "text", answered: false, page: 4, answer: "", tip: "Bailey loves History, as a result she loves to share new historical facts that fascinate her. She is happy to discuss History with anybody that is willing to listen."  },
        { text: "What are your favorite hobbies?", type: "text", answered: false, page: 5, answer: "", tip: "Do you enjoy any outdoor activities, sports, instruments, or games?"  },
        { text: "What 3 words would others use to describe you?", type: "text", answered: false, page: 6, answer: "", tip: "How might a friend describe you? How might your sister describe you? How might a therapist describe you? How would you describe yourself? Are there any similarities?"  }
      ]
      setQuestions(defaultQuestions)
      sessionStorage.setItem("quizQuestions", JSON.stringify(defaultQuestions));
    }

    // Load saved answers from session storage when the component mounts
    const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
    const updatedTempAnswers = new Array(7).fill("");

    // Populate tempAnswers with saved answers
    Object.keys(savedAnswers).forEach((key) => {
      updatedTempAnswers[parseInt(key)] = savedAnswers[key];
    });
    setTempAnswers(updatedTempAnswers);
  
    // Calculate progress after setting questions
    const totalQuestions = storedQuestions.length;
    const answeredQuestions = Object.keys(savedAnswers).filter(key => savedAnswers[key]).length;
    const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    setProgress(progressPercentage);
  
  }, []);

  function updateAnswered() { //Function to record the user's answer when they click the "Record Answer" button
    if (currentQuestion) {
      const updatedQuestions = [...questions];
      updatedQuestions[questionPage].answered = true; //Updates the answered status of the question to true
      updatedQuestions[questionPage].answer = tempAnswers[questionPage]; //Sets the answer value of the question to the user's answer
      setQuestions(updatedQuestions); //Update the questions state to include user's answer
      const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}"); //Creates an array from "quizAnswers" in storage, or returns an empty array if it doesn't exist
      savedAnswers[questionPage] = tempAnswers[questionPage]; //Populate array with user's answer
      sessionStorage.setItem("quizAnswers", JSON.stringify(savedAnswers)); //Update "quizAnswers" in storage with the new array
      updateProgress();
    }if(tempAnswers[questionPage]){
      setQuestionPage(prev => Math.min(questions.length - 1, prev + 1))
    }
  }

  function handleAnswerChange(event: React.ChangeEvent<HTMLTextAreaElement>) { //Function to place a user's new answer in a temp variable to hold before recording
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
  toggleDetailed(true);
  alert("Thanks for completing the Detailed Career quiz!");
}

function DetailedSubmit({detailedComplete, toggleDetailed}: submitButton): JSX.Element { //Submit button - disabled if progress is less than 100
  return(<div>
    <Button style = {{height: "50px", width: "75px", borderRadius: "15px", background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} disabled={progress < 100} onClick={() => handleSubmit({detailedComplete, toggleDetailed})}>Submit</Button>
  </div>)
}

  function handleClear(){ //Function to handle clearing quiz and resetting progress
    sessionStorage.removeItem("quizAnswers"); //removes saved answers from storage
    sessionStorage.removeItem("quizQuestions"); //removes saved questions from storage
    const defaultQuestions = [
      { text: "What have you always wanted to be when you grew up?", type: "text", answered: false, page: 0, answer: "", tip: "A lot of kids want to be a police officer, firefighter, nurse, doctor, etc. when they grow up." },
      { text: "Whether inside or outside of school, what is your favorite class that you have ever taken?", type: "text", answered: false, page: 1, answer: "", tip: "The class “Nebula Formation of Dying Stars” was Sarah's favorite, now she is an Aerospace Engineer."  },
      { text: "What societal stressor do you feel most passionate about addressing?", type: "text", answered: false, page: 2, answer: "", tip: "Epidemics/Pandemics, Homelessness, Crime, Education, Agriculture, Technology, National Defense, Environmental Conservation, etc."  },
      { text: "What did you dislike most about jobs or tasks you've had to do in the past?", type: "text", answered: false, page: 3, answer: "", tip: "A lot of people dislike working in groups as they have less control over the task at hand."  },
      { text: "What is a topic or subject that you could teach someone about?", type: "text", answered: false, page: 4, answer: "", tip: "Bailey loves History, as a result she loves to share new historical facts that fascinate her. She is happy to discuss History with anybody that is willing to listen."  },
      { text: "What are your favorite hobbies?", type: "text", answered: false, page: 5, answer: "", tip: "Do you enjoy any outdoor activities, sports, instruments, or games?"  },
      { text: "What 3 words would others use to describe you?", type: "text", answered: false, page: 6, answer: "", tip: "How might a friend describe you? How might your sister describe you? How might a therapist describe you? How would you describe yourself? Are there any similarities?"  }
    ]; //Initializes a questions array with blank answers, false answer value
    setQuestions(defaultQuestions); //Update state with empty questions array
    setTempAnswers(new Array(defaultQuestions.length).fill("")); //Initializes a new array the length of the defaultQuestions array and fills it with empty strings
    setProgress(0); //Reset progress
    setTimeout(() => {
      alert("Quiz Cleared!");
  }, 0); //Wait until all of the clear logic runs before displaying message
    setQuestionPage(prev => Math.min(questions.length - 1, 0))
  }

  function DetailedClear(){ //Clear button
    return(<div>
      <Button onClick={handleClear} style = {{height: "50px", width: "75px", borderRadius: "15px", background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}}>Clear</Button>
    </div>)
  }

  function getSavedAnswer(page: number) { //Helper function to get and display the user's saved answer from storage
    const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
    return savedAnswers[page] || ""; // Return the saved answer or an empty string if not present
  }
  
  return (
    <div className="Background">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px", marginRight: "30px" }}>
          <label htmlFor="question" style={{ marginRight: "10px", fontSize: "25px" }}>
            Percent Complete: {progress.toFixed(0)}%
          </label>
          <progress id="question" value={progress} max="100" style={{ height: "45px", width: "300px" }} />
        </div>
      <div style={{textAlign: "center"}}>
        <h1>Here is the Detailed Career Page!</h1>
        <div></div>
        <Container style={{ border: "2px solid red" }}>
            <p>
            This assessment is designed to determine an appopriate career path going
            forward. You will be asked a series of elaborate questions that may require some
            additional thought to answer. Before you begin, make sure you're in a comfortable environment and
            answer each question to your best ability.
            </p>
        </Container>
      </div>
      <div>
      {currentQuestion && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2>{currentQuestion.text}
          <Button 
            onClick={toggleExplanation} 
            style={{fontSize: '24px', marginLeft: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'blue' }}>
            ?
          </Button>
          </h2>
          {showExplanation && (
            <div style={{ marginTop: '10px', padding: '10px', border: '1px solid lightgray', borderRadius: '5px', background: '#f9f9f9' }}>
              <p>{currentQuestion.tip}</p>
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
            <img src={detective2} alt="Detective" style={{ width: '10%', height: '10%', marginRight: '10px' }} />
              <textarea 
                value={tempAnswers[questionPage]} 
                onChange={handleAnswerChange} 
                style={{ width: '25%', height: '5em', resize: 'none' }} 
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
        <DetailedSubmit detailedComplete={detailedComplete} toggleDetailed={toggleDetailed}/>
        <DetailedClear />
      </div>
    </div>
  );
}
