import { Form } from 'react-bootstrap';
import { useEffect } from 'react';
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
  accounts: { username: string; password: string, remembered: boolean, iv: string }[];
  selectedUser: string;
  setSelect: (value: React.SetStateAction<string>) => void;
  formTitle: string;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  decryptPassword: (encryptedPassword: string, iv: string) => string;
  passwordPlaceholder: string;
  isPasswordReset: boolean;
  setIsPasswordReset: React.Dispatch<React.SetStateAction<boolean>>;
  newPassword: string;
  updatePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  setFormTitle,
  decryptPassword,
  passwordPlaceholder,
  isPasswordReset,
  setIsPasswordReset,
  newPassword,
  updatePassword
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

  const handlePasswordReset = () => {
    setIsPasswordReset(false);
    setFormTitle("Log in"); // set back to log in after reset
  };

  return (
    <div className="form-popup" id="myForm">
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>{formTitle}</h1>

        {/* Only show saved users dropdown if not in password reset mode */}
        {formTitle === "Log in" && !isPasswordReset && (
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

        {/* Login Fields (Username, Password, Remember Me) */}
        {!isPasswordReset && (
          <>
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

            {formTitle === "Log in" && (
              <div
                onClick={() => setIsPasswordReset(true)} // Trigger password reset mode
                style={{
                  fontSize: "12px", 
                  marginBottom: "10px", 
                  cursor: "pointer", 
                  color: "blue", 
                  textDecoration: "underline"
                }}
                tabIndex={0}
                role="button"
              >
                Forgot Password?
              </div>
            )}
          </>
        )}

        {/* Buttons for Login or Password Reset */}
        <div>
          {!isPasswordReset ? (
            <>
              <button type="submit" className="btn">
                Login
              </button>
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
              <button
                style={{ marginTop: '10px' }}
                type="button"
                className="btn cancel"
                onClick={closeForm}
              >
                Close
              </button>
            </>
          ) : (
            <>
              {setFormTitle("Reset Password")}
              <label htmlFor="resetPassword"><b>New Password</b></label>
              <input
                type="password"
                value={passwordPlaceholder}  // Display the new password here
                placeholder="Enter New Password"
                onChange={updatePassword}  // Handles new password input
                required
              />
              <button
                style={{ marginTop: '10px' }}
                type="button"
                className="btn cancel"
                onClick={handlePasswordReset} // Reset password logic here
              >
                Reset
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
