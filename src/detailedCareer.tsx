import { Button, Form } from "react-bootstrap";
import { headingStyle } from "./CSS/Heading";
import { useState } from "react";
// import './CSS/Background.css';

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

interface Answer{
  answer: string;
  answerStatus: boolean;

}

// function DetailedSave({savedDetailedCareer, setDetailedCareer}: saveButton): JSX.Element 
// {
//   return(<div>
//     <Button onClick = {handleSave} style = {{height: "50px", width: "75px", borderRadius: "15px"}}>Save</Button>
//   </div>)
// }

export function DetailedCareerComponent({ detailedComplete, toggleDetailed }: submitButton): JSX.Element {
  const [answer1,setAnswer1] = useState<string>("");
  const [answer2,setAnswer2] = useState<string>("");
  const [answer3,setAnswer3] = useState<string>("");
  const [answer4,setAnswer4] = useState<string>("");
  const [answer5,setAnswer5] = useState<string>("");
  const [answer6,setAnswer6] = useState<string>("");
  const [answer7,setAnswer7] = useState<string>("");
  const [answer8,setAnswer8] = useState<string>("");
  const [answer9,setAnswer9] = useState<string>("");
  const [progress,setProgress] = useState<number>(0);
  
  function updateAnswer1(event: React.ChangeEvent<HTMLInputElement>) {
    setAnswer1(event.target.value);
    answer1.length > 20 ? setProgress(progress+1) : setProgress(progress) ;
  }

    function updateAnswer2(event: React.ChangeEvent<HTMLInputElement>) {
    setAnswer2(event.target.value);

  }

  return (
    <div className="Background">
      <div className="Body-Heading">
        <h1>Here is the Detailed Career Page! {progress}</h1>
        <div></div>
        <h5>
          This assessment is designed to determine an appopriate career path going
          forward.
        </h5>
        <br />
        <h5>
          You will be asked a series of elaborate questions that may require some
          additional thought to answer.
        </h5>
        <br />
        <h5>
          Before you begin, make sure you're in a comfortable environment and
          answer each question to your best ability.
        </h5>
        <div style={{textAlign:"center"}}>
        <h3>Question 1.</h3>
        <Form.Group controlId="formQuest1">
        <Form.Control value={answer1} 
        onChange={updateAnswer1}
        />
        <Form.Text className="text-muted">
        </Form.Text>
    </Form.Group>

        <h3>Question 2.</h3>
        <Form.Group controlId="formQuest2">
        <Form.Control value={answer2} 
        onChange={updateAnswer2}
        />
        <Form.Text className="text-muted">
        </Form.Text>
    </Form.Group>
        <h3>Question 3.</h3>
        <h3>Question 4.</h3>
        <h3>Question 5.</h3>
        <h3>Question 6.</h3>
        <h3>Question 7.</h3>
        <h3>Question 8.</h3>
        <h3>Question 9.</h3>

        <h3>Question 10.</h3>

        </div>
      </div>
      <div style={{ marginLeft: "1350px"}}>
        <DetailedSubmit detailedComplete={detailedComplete} toggleDetailed={toggleDetailed}/>
      </div>
    </div>
  );
}
