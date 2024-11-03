import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import { LoginForm } from './LoginForm';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ username: string; password: string }>({ username: "", password: "" });
  const [remember, setRemember] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>("Create Account");
  const [db, setDb] = useState<IDBDatabase | null>(null); // Store db instance

  useEffect(() => {
    const indexedDB = window.indexedDB;
    const request = indexedDB.open("UserDatabase", 2); // Increment version for schema changes

    request.onerror = (event) => {
      console.error("Error accessing user database!", event);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore("users", { keyPath: "username" });
    };

    request.onsuccess = () => {
      setDb(request.result);
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userInfo.username || !userInfo.password) {
      console.error("Username and password must be provided.");
      return;
    }

    if (db) {
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");

      const userQuery = store.get(userInfo.username);

      userQuery.onsuccess = () => {
        if (userQuery.result && !remember) {
          console.log('User exists, logging in:', userInfo.username);
          setFormTitle("Log In");
          setIsLoggedIn(true);
        } else if (userQuery.result && remember) {
          setIsLoggedIn(true);
        } else {
          const newUser = { username: userInfo.username, password: userInfo.password };
          console.log('User does not exist, adding new user:', newUser);

          const addUserRequest = store.put(newUser);

          addUserRequest.onsuccess = () => {
            console.log("User added successfully!");
            setFormTitle("Create Account");
            setIsLoggedIn(true);
          };

          addUserRequest.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            const errorMessage = error ? error.message : "Unknown error";
            console.error("Error adding user:", event);
            console.error("IndexedDB error details:", errorMessage);
          };
        }
      };

      userQuery.onerror = (event) => {
        console.error("Error querying user data");
      };

      transaction.onerror = (event) => {
        const error = (event.target as IDBTransaction).error;
        const errorMessage = error ? error.message : "Unknown error";
        console.error("Transaction failed:", event);
        console.error("Transaction error details:", errorMessage);
      };
    } else {
      console.error("Database not initialized");
    }
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























