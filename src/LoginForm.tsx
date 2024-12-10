import { Form } from 'react-bootstrap';
import { useEffect } from 'react';
import './LoginForm.css';
import React from 'react';

export interface LoginFormProps {
  closeForm: () => void;
  userInfo: { username: string; password: string; remembered: boolean };
  setUserInfo: (value: React.SetStateAction<{ username: string; password: string; remembered: boolean }>) => void;
  remember: boolean;
  setRemember: React.Dispatch<React.SetStateAction<boolean>>;
  updateStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemember: () => void;
  handleLogin: (event: React.FormEvent<HTMLFormElement>) => void;
  accounts: { username: string; password: string; remembered: boolean; ivUser:string, ivPass: string }[];
  selectedUser: string;
  setSelect: (value: React.SetStateAction<string>) => void;
  formTitle: string;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  decryptUsername: (encryptedPassword: string, ivUser: string) => string;
  decryptPassword: (encryptedPassword: string, ivPass: string) => string;
  passwordPlaceholder: string;
  setPlaceholder: React.Dispatch<React.SetStateAction<string>>;
  isPasswordReset: boolean;
  setIsPasswordReset: React.Dispatch<React.SetStateAction<boolean>>;
  newPassword: string;
  updatePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  calledUsername: string;
  setCalled: React.Dispatch<React.SetStateAction<string>>;
  updateCalledUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  userInfo,
  setUserInfo,
  remember,
  setRemember,
  updateStatus,
  handleRemember,
  handleLogin,
  closeForm,
  accounts,
  selectedUser,
  setSelect,
  formTitle,
  setFormTitle,
  decryptUsername,
  decryptPassword,
  passwordPlaceholder,
  setPlaceholder,
  isPasswordReset,
  setIsPasswordReset,
  newPassword,
  updatePassword,
  calledUsername,
  setCalled,
  updateCalledUser
}) => {

  useEffect(() => { // Displays saved credentials for dropdown for selected user
    if (formTitle === "Log in" && selectedUser && accounts.length > 0) {
      const selectedAccount = accounts.find(account => account.username === selectedUser // Compare decrypted username
      );
      if (selectedAccount) {
        const decryptedUsername = decryptUsername(selectedAccount.username, selectedAccount.ivUser);
        const decryptedPassword = decryptPassword(selectedAccount.password, selectedAccount.ivPass);
        if (
          userInfo.username !== decryptedUsername || 
          userInfo.password !== decryptedPassword ||
          userInfo.remembered !== selectedAccount.remembered
        ) {
          setUserInfo({
            username: decryptedUsername, // updates user info with account credentials for input display
            password: decryptedPassword,
            remembered: selectedAccount.remembered ?? false,
          });
        }
      }
    }
  }, [formTitle, selectedUser, accounts, decryptUsername, decryptPassword, setUserInfo, userInfo, remember]);
  
  const handleUserSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUsername = event.target.value;
    setSelect(selectedUsername); // change selected user in saved dropdown
    setCalled(selectedUsername); // handle username input
  
    if (selectedUsername === "") { // default user account for allowing logging into users not remembered
      setUserInfo({
        username: "",
        password: "",
        remembered: false,
      });
    }
  };  

  const handleResetClick = () => { 
    setIsPasswordReset(false); 
    setFormTitle("Log in"); // go back to log in form to see change
    setUserInfo(prevState => ({
      ...prevState,
      username: "",
      password: ""
    }));
    alert("Password Reset!");
  };

  const handlePasswordReset = () => { // Switch to password reset view
    setFormTitle("Reset Password");
    setCalled(""); // reset blank username for input
    setPlaceholder(""); // reset blank password for input
    setIsPasswordReset(true);
  };

  return (
    <div className="form-popup" id="myForm">
      <form className="form-container" onSubmit={handleLogin}>
        <h1>{formTitle}</h1>
        <Form.Group controlId="savedUsers">
  {formTitle === "Log in" && (  
    <div style={{ marginBottom: "25px" }}>
      {accounts.filter((account) => account.remembered && account.username !== 'Select a saved user').length === 0 ? (
        <>
          <Form.Label>No Saved Usernames</Form.Label>
          <Form.Select value="" disabled>
            <option value="">No saved usernames</option>
          </Form.Select>
        </>
      ) : (
        <>
          <Form.Label>Saved Usernames</Form.Label>
          <Form.Select value={selectedUser} onChange={handleUserSelect}>
          <option value="">Select a saved user</option>
          {accounts
          .filter(account => account.remembered && account.username?.trim()) 
          .map(user => {
            const decryptedUsername = decryptUsername(user.username, user.ivUser);
            return (
              <option key={user.username} value={user.username}>
                {decryptedUsername}
              </option>
            );
          })}
        </Form.Select>
        </>
      )}
    </div>
  )}
    </Form.Group>
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

            <label htmlFor="password"><b>Password</b></label>
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
                onClick={handlePasswordReset}  // Trigger password reset mode
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

        <div>
          {!isPasswordReset ? (
            <>
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
          <label htmlFor="resetUser"><b>Username</b></label>
          <input
            type="text"
            value={calledUsername}  
            placeholder="Enter Username"
            onChange={updateCalledUser}
            required
          />

          <label htmlFor="resetPassword"><b>New Password</b></label>
          <input
            type="password"
            value={passwordPlaceholder}  
            placeholder="Enter New Password"
            onChange={updatePassword}
            required
          />

          <button
            disabled={calledUsername === "" || passwordPlaceholder === ""}
            style={{ marginTop: '10px' }}
            type="button"
            className="btn"
            onClick={handleResetClick}
          >
            Reset Password
          </button>

          <button
                style={{ marginTop: '10px'}}
                type="button"
                className="btn cancel"
                onClick={() => closeForm()}  
              >
                Close
          </button>
          </>
                )}
              </div>
            </form>
          </div>
        );
      };




