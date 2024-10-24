import { Button } from "react-bootstrap";
import { headingStyle } from "./CSS/Heading";

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
    <div className="Background">
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
      </div>
      <DetailedSubmit detailedComplete={detailedComplete} toggleDetailed={toggleDetailed}></DetailedSubmit>
    </div>
  );
}
