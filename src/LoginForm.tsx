import React from 'react';
import { Form } from 'react-bootstrap';
import './LoginForm.css';

export interface LoginFormProps {
  closeForm: () => void;
  userInfo: { username: string; password: string };
  setInfo: (value: React.SetStateAction<{ username: string; password: string }>) => void;
  remember: boolean;
  setRemember: React.Dispatch<React.SetStateAction<boolean>>;
  updateStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void; 
  handleRemember: () => void;
  formTitle: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  userInfo,
  setInfo,
  remember,
  setRemember,
  updateStatus,
  handleRemember,
  handleSubmit,
  closeForm,
  formTitle
}) => {
  return (
    <div className="form-popup" id="myForm">
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>{formTitle}</h1>
        <label htmlFor="username"><b>Username</b></label>
        <input
          type="text"
          value={userInfo.username}
          placeholder="Enter Username"
          name="username"
          onChange={updateStatus}
          required
        />
        <label htmlFor="psw"><b>Password</b></label>
        <input
          type="password"
          value={userInfo.password}
          placeholder="Enter Password"
          name="password"
          onChange={updateStatus}
          required
        />
        <button type="submit" className="btn">Login</button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}>Remember me?</span>
          <Form.Check
            type="checkbox"
            id="save-user"
            name="save-user"
            checked={remember}
            onChange={handleRemember}
          />
        </div>
        <button style={{ marginTop: "10px" }} type="button" className="btn cancel" onClick={closeForm}>Close</button>
      </form>
    </div>
  );
};
