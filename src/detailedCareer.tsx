import { headingStyle } from "./CSS/Heading";

export function DetailedCareerComponent(): JSX.Element {
  return (
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
  );
}
