import { Button, Form } from "react-bootstrap";
import { headingStyle } from "./CSS/Heading";
import './CSS/Background.css';

export interface submitButton{ // Interface for keeping track of Basic Question Completion
  detailedComplete: boolean;
  toggleDetailed: (notDetailed: boolean) => void;
}
function DetailedSubmit({detailedComplete, toggleDetailed}: submitButton): JSX.Element {
  return(<div>
    <Button onClick={() => toggleDetailed(!detailedComplete)}>Submit</Button>
  </div>)
}

export function DetailedCareerComponent({detailedComplete, toggleDetailed}: submitButton): JSX.Element {
  return (
    <div className="Detailed">
      <div>
        <h1 style={headingStyle}>Here is the Detailed Career Page!</h1>
        <div></div>
        <h5 style={headingStyle}>
          This assessment is designed to determine an appopriate career path going
          forward.
        </h5>
        <br />
        <h5 style={headingStyle}>
          You will be asked a series of elaborate questions that may require some
          additional thought to answer.
        </h5>
        <br />
        <h5 style={headingStyle}>
          Before you begin, make sure you're in a comfortable environment and
          answer each question to your best ability.
        </h5>
        <div style={{textAlign:"center"}}>
        <h3>Question 1.</h3>
        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="answer" placeholder="Enter answer" />
        <Form.Text className="text-muted">
        </Form.Text>
    </Form.Group>
        <h3>Question 2.</h3>
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
      <DetailedSubmit detailedComplete={detailedComplete} toggleDetailed={toggleDetailed}></DetailedSubmit>
    </div>
  );
}
