import React from 'react';
import {Form} from 'react-bootstrap'
import './LoginForm.css';

interface LoginFormProps {
  closeForm: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ closeForm }) => {
  return (
    <div className="form-popup" id="myForm">
      <form action="/action_page.php" className="form-container">
        <h1>Login</h1>

        <label htmlFor="email"><b>Email</b></label>
        <input type="text" placeholder="Enter Email" name="email" required />

        <label htmlFor="psw"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" name="psw" required />

        <div>
             <button type="submit" className="btn">Login</button>
             <Form.Check
                type="checkbox" 
                id="save-user" 
                name="save-user" 
             >Remember me?</Form.Check>
        </div>
        <button type="button" className="btn cancel" onClick={closeForm}>Close</button>
      </form>
    </div>
  );
};