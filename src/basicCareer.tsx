import { headingStyle } from "./CSS/Heading";
import './CSS/Background.css';


export function BasicCareerComponent(): JSX.Element {
  

  return (
    <div className="Basic">
      <div>
        <h1 style={headingStyle}>Here is the Basic Career Page!</h1>
        <div></div>
        <h5 style={headingStyle}>
          This assessment is designed to determine an appopriate career path going
          forward.
        </h5>
        <br />
        <h5 style={headingStyle}>
          You will be asked a series of multiple choice questions. If you're
          looking for more in-depth questions, go to the Detailed Career Page.
        </h5>
        <br />
        <h5 style={headingStyle}>
          Before you begin, make sure you're in a comfortable environment and
          answer each question to your best ability.
        </h5>
      </div>
    </div>
  );
}