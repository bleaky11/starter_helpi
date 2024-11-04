import React from 'react';
import { Form } from 'react-bootstrap';
import './LoginForm.css';

export interface LoginFormProps {
  closeForm: () => void;
  userInfo: { username: string; password: string };
  setUserInfo: (value: React.SetStateAction<{ username: string; password: string }>) => void;
  remember: boolean;
  setRemember: React.Dispatch<React.SetStateAction<boolean>>;
  updateStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemember: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void; 
  accounts: string[]; 
  savedUser: string; 
  setSavedUser: (value: React.SetStateAction<string>) => void; 
  formTitle: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  userInfo,
  setUserInfo,
  remember,
  setRemember,
  updateStatus,
  handleRemember,
  handleSubmit,
  closeForm,
  accounts,
  savedUser,
  setSavedUser,
  formTitle,
}) => {
  
  const handleUserSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSavedUser(event.target.value);
    setUserInfo(prev => ({ ...prev, username: event.target.value })); // Update username input with selected user
  };

  return (
    <div className="form-popup" id="myForm">

      <form className="form-container" onSubmit={handleSubmit}>
        <h1>{formTitle}</h1>
        <div style = {{marginBottom: "25px"}}>
        {accounts.length === 0 ?
          <Form.Group controlId="savedUsers">
          <Form.Label>No Saved Usernames</Form.Label>
          <Form.Select value={savedUser} onChange={handleUserSelect}>
            {accounts.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </Form.Select>
        </Form.Group>: 
         <Form.Group controlId="savedUsers">
         <Form.Label>Saved Usernames</Form.Label>
         <Form.Select value={savedUser} onChange={handleUserSelect}>
           {accounts.map((user) => (
             <option key={user} value={user}>
               {user}
             </option>
           ))}
         </Form.Select>
       </Form.Group>
      }
      </div>

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
