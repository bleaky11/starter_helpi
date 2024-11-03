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
    const initializeDB = () => {
      const indexedDB = window.indexedDB;
      const request = indexedDB.open("UserDatabase", 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore("users", { autoIncrement: true });
        store.createIndex("username", "username", { unique: true });
      };

      request.onsuccess = () => {
        const db = request.result;
        checkExistingUser(db);
      };

      request.onerror = (event) => {
        console.error("Error accessing user database!", event);
      };
    };

    const checkExistingUser = (db: IDBDatabase) => {
      const transaction = db.transaction("users", "readonly");
      const store = transaction.objectStore("users");
      const allUsers = store.getAll();

      allUsers.onsuccess = () => {
        setFormTitle(allUsers.result.length > 0 ? "Log In" : "Create Account");
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };

    initializeDB();
  }, []);

  const saveUser = () => {
    if (!userInfo.username || !userInfo.password) {
      console.error("Username or password is missing");
      return;
    }

    const indexedDB = window.indexedDB;
    const request = indexedDB.open("UserDatabase", 1);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");

      const userObject = {
        username: userInfo.username,
        password: userInfo.password,
      };

      const addRequest = store.add(userObject);

      addRequest.onsuccess = () => {
        console.log("User successfully added to database!");
        setIsLoggedIn(true);
        setIsFormOpen(false);
      };

      addRequest.onerror = (event) => {
        console.error("Error adding user to database:", event);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };

    request.onerror = (event) => {
      console.error("Error opening database for saving user:", event);
    };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveUser();
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












