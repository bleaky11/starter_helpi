import React, { useState, useEffect } from 'react'; 
import userProfile from './Images/user-profile.png';
import { LoginForm } from './LoginForm';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ username: string; password: string }>({ username: "", password: "" });
  const [remember, setRemember] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>("Create Account");

  useEffect(() => {
    const indexedDB = window.indexedDB;
    const request = indexedDB.open("UserDatabase", 1);

    request.onerror = (event) => {
      console.error("Error accessing user database!", event);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.createObjectStore("users", { autoIncrement: true });
      store.createIndex("username_and_password", ["username", "password"], { unique: false });
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("users", "readonly");
      const store = transaction.objectStore("users");

      // Check if the user already exists
      const userQuery = store.index("username_and_password").get([userInfo.username, userInfo.password]);
      userQuery.onsuccess = () => {
        if (userQuery.result) {
          setFormTitle("Log In");
        } else {
          setFormTitle("Create Account");
        }
      };
      transaction.oncomplete = () => {
        db.close();
      };
    };
  }, [userInfo.password, userInfo.username]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!userInfo.username || !userInfo.password) {
      console.error("Username and password cannot be empty!");
      return; // Early return if validation fails
    }
    
    const request = indexedDB.open("UserDatabase", 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");
    
      // Add or update user data
      const userRecord = {
        username: userInfo.username,
        password: userInfo.password
      };
      
      const putRequest = store.put(userRecord);
      putRequest.onsuccess = () => {
        console.log("User data added/updated successfully");
      };
      
      putRequest.onerror = () => {
        console.error("Error adding/updating user data");
      };
      
      transaction.oncomplete = () => {
        db.close();
        setIsLoggedIn(true);
      };
    };
  };
  

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const updateStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleRemember = () => {
    setRemember(!remember);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div style={{ position: "absolute", float: "left" }}>
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
        </div>
      )}
      <a href="https://bleaky11.github.io/starter_helpi/" style={{ color: 'black' }}>
        <h1>The Career Quiz</h1>
      </a>

      {/* Conditionally render the LoginForm */}
      {isFormOpen && !isLoggedIn && (
        <LoginForm
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          remember={remember}
          setRemember={setRemember}
          handleRemember={handleRemember}
          handleSubmit={handleSubmit}
          updateStatus={updateStatus}
          closeForm={() => setIsFormOpen(false)}
          formTitle={formTitle}
        />
      )}
    </div>
  );
};















