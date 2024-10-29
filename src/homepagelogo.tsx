import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import { LoginForm } from './LoginForm';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [userInfo, setInfo] = useState({username: "", password: ""});
  const [remember, setRemember] = useState<boolean>(false);
  const [isClicked, setClicked] = useState<boolean>(false);

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
    saveUser();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClicked((prevClick) => !prevClick);
  }

  const saveUser = () => {
    localStorage.setItem("username", userInfo.username);
    localStorage.setItem("password", userInfo.password);
  };

  const clearStorage = () => {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
  }
  
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");

    if (!savedUsername && !savedPassword) {
      clearStorage(); // This will clear local storage and session storage
  } 
  else if (savedUsername && savedPassword )
  {
      setInfo({username: savedUsername, password: savedPassword}); // Load saved progress
  }
}, []);
  
  return (
    <div>
      { (localStorage.getItem("username") && localStorage.getItem("password")) && isClicked ? <h3 style = {{float: "left"}}>Signed in as: {userInfo.username}!</h3>:
      <img
        src={userProfile}
        alt="User Profile"
        style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }}
        onClick={toggleForm}
      />
      }
      <a href="https://bleaky11.github.io/starter_helpi/" style={{ color: 'black' }}>
        <h1>The Career Quiz</h1>
      </a>
      {isFormOpen && <LoginForm userInfo = {userInfo} setInfo = {setInfo} remember = {remember} setRemember={setRemember} handleRemember = {handleRemember} isClicked = {isClicked} setClicked = {setClicked} handleSubmit = {handleSubmit} updateStatus = {updateStatus} closeForm={() => setIsFormOpen(false)} />}
    </div>
  );
};

