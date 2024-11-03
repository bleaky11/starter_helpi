import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import { LoginForm } from './LoginForm';
import { Button } from 'react-bootstrap';

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
      console.log("Object store created.");
    };

    request.onsuccess = () => {
      const dbInstance = request.result;
      setDb(dbInstance);
      console.log("Database opened successfully.");

      // Check if there's saved user data for "Remember Me"
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      setRemember(rememberMe);

      if (rememberMe) {
        // Attempt to load saved user data
        const savedUsername = localStorage.getItem("savedUsername");
        if (savedUsername) {
          const transaction = dbInstance.transaction("users", "readonly");
          const store = transaction.objectStore("users");
          const userQuery = store.get(savedUsername);

          userQuery.onsuccess = () => {
            if (userQuery.result) {
              // Load saved user data
              setUserInfo({ username: userQuery.result.username, password: userQuery.result.password });
              setIsLoggedIn(true);
              setFormTitle("Log In");
              console.log("Loaded saved user data:", userQuery.result);
            } else {
              console.log("No saved user data found for username:", savedUsername);
            }
          };

          userQuery.onerror = (event) => {
            console.error("Error querying user data:", event);
          };
        }
      }
    };
  }, []); // Run on component mount

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
        if (userQuery.result) {
          // User exists
          if (remember) {
            // Update existing user's password if Remember Me is checked
            console.log('User exists and Remember Me is checked, updating password:', userInfo.username);
            const updatedUser = { username: userInfo.username, password: userInfo.password };
            store.put(updatedUser);
            setIsLoggedIn(true);
          } else {
            console.log('User exists, logging in without saving:', userInfo.username);
            setIsLoggedIn(true);
          }
        } else {
          // User does not exist, create new user
          const newUser = { username: userInfo.username, password: userInfo.password };
          console.log('User does not exist, adding new user:', newUser);

          const addUserRequest = store.put(newUser);

          addUserRequest.onsuccess = () => {
            console.log("User added successfully!");
            setFormTitle("Create Account");
            setIsLoggedIn(true);
          };

          addUserRequest.onerror = (event) => {
            console.error("Error adding user:", event);
          };
        }
      };

      userQuery.onerror = (event) => {
        console.error("Error querying user data");
      };

      transaction.onerror = (event) => {
        console.error("Transaction failed:", event);
      };

      // Save the username for future logins if "Remember Me" is checked
      if (remember) {
        localStorage.setItem("savedUsername", userInfo.username);
      } else {
        localStorage.removeItem("savedUsername");
      }
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
    const newRememberState = !remember;
    setRemember(newRememberState);
    localStorage.setItem("rememberMe", newRememberState ? "true" : "false"); // Save remember me state
    console.log("Remember Me state changed to:", newRememberState);
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
          <Button style = {{float: "left", marginTop: "10px"}}>Log in</Button>
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

























