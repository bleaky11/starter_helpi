import React from 'react';
import {Form} from 'react-bootstrap'
import './LoginForm.css';

export interface LoginFormProps {
  closeForm: () => void;
  userInfo: { email: string; password: string };
  setInfo: (value: React.SetStateAction<{ email: string; password: string }>) => void;
  remember: boolean;
  setRemember: React.Dispatch<React.SetStateAction<boolean>>;
  updateStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemember: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ userInfo, setInfo, remember, setRemember, updateStatus, handleRemember, closeForm }) => 
{
  return (
    <div className="form-popup" id="myForm">
      <form action="/action_page.php" className="form-container">
        <h1>Login</h1>
        <label htmlFor="email"><b>Email</b></label>
        <input type="text" value = {userInfo.email} placeholder="Enter Email" name="email" onChange={updateStatus} required />
        <label htmlFor="psw"><b>Password</b></label>
        <input type="password" value = {userInfo.password} placeholder="Enter Password" name="password" onChange= {updateStatus} required />
        <button type="submit" className="btn">Login</button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>Remember me?</span>
            <Form.Check
              type="checkbox"
              id="save-user"
              name="save-user"
              checked = {remember}
              onChange={handleRemember}
            />
          </div>
        <button style = {{marginTop: "10px"}} type="button" className="btn cancel" onClick={closeForm}>Close</button>
      </form>
    </div>
  );
};