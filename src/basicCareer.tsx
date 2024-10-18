import { headingStyle } from "./CSS/Heading";
import { backgroundStyle } from "./CSS/Background";



export function BasicCareerComponent(): JSX.Element {
  

  return (
    <div style={backgroundStyle}>
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
        <div style={{textAlign:"center"}}>
                <h3>Question 1.</h3>
        How much noise do you mind in your work environment?
        <p>- No noise
        - A little noise
        - A lot of noise
        - I don't mind any
        </p>
        <h3>Question 2.</h3>
        What type of environment would you prefer to work in?
        <p>
        - Office
        - Outdoors
        - At Home
        - Hybrid
        </p>
        <h3>Question 3.</h3>
        Are you interested in any STEM fields?
        <p>
            - Science
            - Technology 
            - Engineering
            - Math 
            - None
        </p>
        <h3>Question 4.</h3>
        Would you be fine doing manual labor?
        <p>
            - Not at all
            - Some is fine
            - More often than not
            - Very comfortable
        </p>
        <h3>Question 5.</h3>
        How much would you like to interact with others?
        <p>
            - Strictly never
            - As little as possible
            - Occasional interaction
            - Fairly often
            - All the time
        </p>
        <h3>Question 6.</h3>
        How comfortable are you with technology?
        <p>
            - Very Uncomfortable
            - Slightly Uncomforable
            - Decently Experienced
            - Extremely Comfortable
        </p>
        <h3>Question 7.</h3>
        What is your ideal annual salary?
        <p>
            - $30k - $50k
            - $50k - $70k
            - $70k - $90k
            - $90k - $110k
        </p>
        <h3>Question 8.</h3>
        How much do you value communication skills?
        <p>
            - Not important at all
            - A fair amount
            - A lot
            - Extremely important
        </p>
        <h3>Question 9.</h3>
        What's the highest level of education you plan on taking?
        <p>
            - High School Diploma
            - Bachelor's Degree
            - Master's Degree
            - Doctoral Degree
        </p>
        </div>
        
        
        <br/>
        <a href = "https://bleaky11.github.io/starter_helpi/"> Go to Home</a>
      </div>
    </div>
  );
}