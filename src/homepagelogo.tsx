import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import { LoginForm } from './LoginForm';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [userInfo, setInfo] = useState<{ username: string; password: string }>({ username: "", password: "" });
  const [remember, setRemember] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
 
  useEffect(() => {
    const savedUsername = localStorage.getItem("username") || "";
    const savedPassword = localStorage.getItem("password") || "";
    const remembered = localStorage.getItem("remembered") === "true";

    if (remembered) {
      setInfo({ username: savedUsername, password: savedPassword });
      setRemember(remembered);
      setIsLoggedIn(true); // User is considered logged in
    }
  }, []);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const updateStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleRemember = () => {
    setRemember((prevRemember) => !prevRemember);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkInfo()) 
    {
      saveUser();
      setIsLoggedIn(true);
    } 
    else if(!localStorage.getItem("username") && !localStorage.getItem("password"))
    {
      saveUser();
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
      alert("Wrong username or password!");
    }
  };

  const checkInfo = () => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    return userInfo.username === savedUsername && userInfo.password === savedPassword;
  };

  const saveUser = () => {
    if (remember) {
      localStorage.setItem("username", userInfo.username);
      localStorage.setItem("password", userInfo.password);
      localStorage.setItem("remembered", "true");
    } else {
      localStorage.setItem("username", userInfo.username);
      localStorage.setItem("password", userInfo.password);
      localStorage.removeItem("remembered");
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div style={{position: "absolute", float: "left" }}>
          <h3>Signed in as: {userInfo.username}!</h3>
        </div>
      ) : (
        <div>
          {/* Show the user image only when not logged in */}
          <img
            src={userProfile}
            alt="User Profile"
            style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }}
            onClick={toggleForm}
          />
          {isFormOpen && (
            <LoginForm
              userInfo={userInfo}
              setInfo={setInfo}
              remember={remember}
              setRemember={setRemember}
              handleRemember={handleRemember}
              handleSubmit={handleSubmit}
              updateStatus={updateStatus}
              closeForm={() => setIsFormOpen(false)}
              formTitle={localStorage.getItem("username") ? "Log In" : "Create Account"} // Pass the title based on conditions
            />
          )}
        </div>
      )}
      <a href="https://bleaky11.github.io/starter_helpi/" style={{ color: 'black', fontSize: '40px', fontWeight: "500"}}>The Career Codebreaker</a>
    </div>
  );
};


