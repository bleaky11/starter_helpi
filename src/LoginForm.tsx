import { Form} from 'react-bootstrap';
import { useEffect} from 'react';
import './LoginForm.css';
import React from 'react';

export interface LoginFormProps {
  closeForm: () => void;
  userInfo: { username: string; password: string, remembered: boolean };
  setUserInfo: (value: React.SetStateAction<{ username: string; password: string, remembered: boolean }>) => void;
  remember: boolean;
  setRemember: React.Dispatch<React.SetStateAction<boolean>>;
  updateStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemember: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  accounts: { username: string; password: string, remembered: boolean, iv: string}[];
  selectedUser: string;
  setSelect: (value: React.SetStateAction<string>) => void;
  formTitle: string;
  resetPassword: () => JSX.Element;
  decryptPassword: (encryptedPassword: string, iv: string) => string;
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
  selectedUser,
  setSelect,
  formTitle,
  resetPassword,
  decryptPassword
}) => {

  const handleUserSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUsername = event.target.value;
    setSelect(selectedUsername);
  };

  useEffect(() => {
    if (formTitle === "Log in" && selectedUser) {
      const selectedAccount = accounts.find(account => account.username === selectedUser);
      if (selectedAccount) {
        const decryptedPassword = decryptPassword(selectedAccount.password, selectedAccount.iv);
        // Only update userInfo if it doesn’t already match
        if (
          userInfo.username !== selectedAccount.username ||
          userInfo.password !== decryptedPassword ||
          userInfo.remembered !== selectedAccount.remembered
        ) {
          setUserInfo({
            username: selectedAccount.username,
            password: decryptedPassword,
            remembered: selectedAccount.remembered ?? false,
          });
        }
      }
    }
  }, [formTitle, selectedUser, accounts, decryptPassword, setUserInfo, userInfo]);    
  
  return (
    <div className="form-popup" id="myForm">
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>{formTitle}</h1>
        {formTitle === "Log in" && (
          <div style={{ marginBottom: "25px" }}>
            {accounts.length === 0 ? (
              <Form.Group controlId="savedUsers">
                <Form.Label>No Saved Usernames</Form.Label>
                <Form.Select value={selectedUser} onChange={handleUserSelect} disabled>
                  <option>No saved users</option>
                </Form.Select>
              </Form.Group>
            ) : (
              <Form.Group controlId="savedUsers">
                <Form.Label>Saved Usernames</Form.Label>
                <Form.Select value={selectedUser} onChange={handleUserSelect}>
                  {accounts.map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.username}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </div>
        )}

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
       <div 
          onClick={resetPassword} 
          style={{fontSize: "12px", marginBottom: "10px", cursor: "pointer", color: "blue", textDecoration: "underline"}} 
          tabIndex={0} 
          role="button" 
        >
          Forgot Password?
      </div>

        <button type="submit" className="btn">Login</button>
        
        {/* Remember me option */}
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
