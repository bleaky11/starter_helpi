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
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  accounts: { username: string; password: string; remembered: boolean; iv: string }[];
  selectedUser: string;
  setSelect: (value: React.SetStateAction<string>) => void;
  formTitle: string;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  decryptPassword: (encryptedPassword: string, iv: string) => string;
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
  handleSubmit,
  closeForm,
  accounts,
  selectedUser,
  setSelect,
  formTitle,
  setFormTitle,
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

  const handleUserSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUsername = event.target.value;
    setSelect(selectedUsername);
    // If "None" is selected (blank option), clear the form
    if (selectedUsername === "") {
      setUserInfo({
        username: "",
        password: "",
        remembered: false,
      });
      setRemember(false); // Optionally reset the 'remember' state if necessary
    } else {
      // Proceed with selecting a saved user
      const selectedAccount = accounts.find(account => account.username === selectedUsername);
      if (selectedAccount) {
        const decryptedPassword = decryptPassword(selectedAccount.password, selectedAccount.iv);
        setUserInfo({
          username: selectedAccount.username,
          password: decryptedPassword,
          remembered: selectedAccount.remembered ?? false,
        });
      }
    }
  };

  // Handle reset password click
  const handleResetClick = () => {
    setIsPasswordReset(false);
    setFormTitle("Log in");
    setUserInfo(prevState => ({
      ...prevState,
      password: ""  
    }));
    alert("Password Reset!");
  };

  // Switch to password reset view
  const handlePasswordReset = () => {
    setFormTitle("Reset Password");
    setCalled(""); // reset blank username for input
    setPlaceholder(""); // reset blank password for input
    setIsPasswordReset(true);
  };

  return (
    <div className="form-popup" id="myForm">
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>{formTitle}</h1>

        {/* Display saved users dropdown if not in reset mode */}
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
            <option value=""></option> {/* Default placeholder */}
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

        {/* Login fields */}
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
                value={calledUsername}  // Display the new password here
                placeholder="Enter Username"
                onChange={updateCalledUser}
                required
              />
              <label htmlFor="resetPassword"><b>New Password</b></label>
              <input
                type="password"
                value={passwordPlaceholder}  // Display the new password here
                placeholder="Enter New Password"
                onChange={updatePassword}
                required
              />
              <button
                disabled = {calledUsername === "" || passwordPlaceholder === ""}
                style={{ marginTop: '10px' }}
                type="button"
                className="btn"
                onClick={handleResetClick}  // Reset state to login
              >
                Reset
              </button>
              <button
                style={{ marginTop: '10px' }}
                type="button"
                className="btn cancel"
                onClick={() => closeForm()}  // Reset state to login
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




