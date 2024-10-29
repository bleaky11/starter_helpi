import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";

interface submitButton{ // Interface for keeping track of Basic Question Completion
  detailedComplete: boolean;
  toggleDetailed: (notDetailed: boolean) => void;
}

// interface saveButton{
//   detailedSaved: string
//   setDetailedCareer: (newState: string) => void;
// }


// function handleSave()
// {
//   localStorage.setItem("quizProgress", JSON.stringify(progress)); //keep track of question and progress states
//   localStorage.setItem("quizAnswers", JSON.stringify(questions));
//   if(progress < 100)
//   {
//     alert("Quiz saved!");
//   }
// }

function handleSubmit({detailedComplete, toggleDetailed}: submitButton)
{
  toggleDetailed(true); //PLACEHOLDER -- Sets detailedComplete to true upon clicking submit button
  alert("Thanks for completing the Detailed Career quiz!");
}

function DetailedSubmit({detailedComplete, toggleDetailed}: submitButton): JSX.Element {
  return(<div>
    <Button style = {{height: "50px", width: "75px", borderRadius: "15px"}} onClick={() => handleSubmit({detailedComplete, toggleDetailed})}>Submit</Button>
  </div>)
}

// function DetailedSave({savedDetailedCareer, setDetailedCareer}: saveButton): JSX.Element 
// {
//   return(<div>
//     <Button onClick = {handleSave} style = {{height: "50px", width: "75px", borderRadius: "15px"}}>Save</Button>
//   </div>)
// }

interface Question 
{
  text: string;
  type: string;
  answered: boolean;
  page: number;
  answer: string;
}

export function DetailedCareerComponent({ detailedComplete, toggleDetailed }: submitButton): JSX.Element {
  const [questionPage, setQuestionPage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [tempAnswers, setTempAnswers] = useState<string[]>(new Array(7).fill(""));
  const [questions, setQuestions] = useState<Question[]>([
    { text: "What did you always want to be when you grew up?", type: "text", answered: false, page: 0, answer: "" },
    { text: "Whether inside or outside of school, what is your favorite class that you have ever taken?", type: "text", answered: false, page: 1, answer: ""  },
    { text: "What societal stressor do you feel most passionate about addressing?", type: "text", answered: false, page: 2, answer: ""  },
    { text: "What did you dislike most about jobs or tasks you've had to do in the past?", type: "text", answered: false, page: 3, answer: ""  },
    { text: "What is a topic or subject that you could teach someone about?", type: "text", answered: false, page: 4, answer: ""  },
    { text: "What are your favorite hobbies?", type: "text", answered: false, page: 5, answer: ""  },
    { text: "What 3 words would others use to describe you?", type: "text", answered: false, page: 6, answer: ""  }
  ]);

  const currentQuestion = questions.find(q => q.page === questionPage);

  useEffect(() => {
    // Load saved answers from session storage when the component mounts
    const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
    const updatedTempAnswers = new Array(7).fill("");

    // Populate tempAnswers with saved answers
    Object.keys(savedAnswers).forEach((key) => {
      updatedTempAnswers[parseInt(key)] = savedAnswers[key];
    });
    setTempAnswers(updatedTempAnswers);
  }, []);

  function updateAnswered() {
    if(currentQuestion){
      const updatedQuestions = [...questions];
      updatedQuestions[questionPage].answered = true;
      updatedQuestions[questionPage].answer = tempAnswers[questionPage];
      setQuestions(updatedQuestions);
      updateProgress(updatedQuestions);
      const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
      savedAnswers[questionPage] = tempAnswers[questionPage];
      sessionStorage.setItem("quizAnswers", JSON.stringify(savedAnswers));
    }
  }

  function handleAnswerChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const updatedTempAnswers = [...tempAnswers];
    updatedTempAnswers[questionPage] = event.target.value;
    setTempAnswers(updatedTempAnswers);
  }

  function IsRecorded({ savedAnswer, currentText }: { savedAnswer: string; currentText: string }) {
    return (
      <div>
        Saved Answer: {savedAnswer}
        <div>
        {savedAnswer === currentText ? "Response Recorded!" : "Please Record Your Response!"}
        </div>
      </div>
      
    );
  }

  function updateProgress(updatedQuestions: typeof questions): void {
    const totalQuestions = updatedQuestions.length;
    const savedAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
    const answeredQuestions = Object.keys(savedAnswers).filter(key => savedAnswers[key]).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    setProgress(progressPercentage);
  }

  function getSavedAnswer(page: number) {
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
          <h2>{currentQuestion.text}</h2> 
          <textarea value={tempAnswers[questionPage]} onChange={handleAnswerChange} style={{ width: '80%', height: '15em', marginTop: '10px', resize: 'none'  }}/>
        </div>
      )}
      <div style={{textAlign: "center"}}>
        {currentQuestion && (
          <IsRecorded savedAnswer={getSavedAnswer(questionPage)} currentText={tempAnswers[questionPage]} />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px' }}>
        <Button onClick={() => setQuestionPage(prev => Math.max(0, prev - 1))} disabled={questionPage === 0}>Previous</Button>
        <Button onClick={() => updateAnswered()} style={{width: "300px"}}>Record Answer</Button>
        <Button onClick={() => setQuestionPage(prev => Math.min(questions.length - 1, prev + 1))} disabled={questionPage === 6}>Next</Button>
      </div>
    </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}>
        <DetailedSubmit detailedComplete={detailedComplete} toggleDetailed={toggleDetailed}/>
      </div>
    </div>
  );
}
