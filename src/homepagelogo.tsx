import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import { LoginForm } from './LoginForm';
import { Button} from 'react-bootstrap';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ username: string; password: string }>({ username: "", password: "" });
  const [remember, setRemember] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>("Create Account");
  const [accounts, setAccounts] = useState<string[]>([]);
  const [db, setDb] = useState<IDBDatabase | null>(null); // Store db instance

  useEffect(() => {
    // Load accounts from localStorage
    const savedAccounts = JSON.parse(localStorage.getItem("savedAccounts") || "[]");
    setAccounts(savedAccounts);

    const indexedDB = window.indexedDB;
    const request = indexedDB.open("UserDatabase", 2);

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

      // Remember Me logic
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      setRemember(rememberMe);

      if (rememberMe) {
        const savedUsername = localStorage.getItem("savedUsername");
        if (savedUsername) {
          const transaction = dbInstance.transaction("users", "readonly");
          const store = transaction.objectStore("users");
          const userQuery = store.get(savedUsername);

          userQuery.onsuccess = () => {
            if (userQuery.result) {
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
        } else if (formTitle === "Create Account") {
          const newUser = { username: userInfo.username, password: userInfo.password };
          store.put(newUser).onsuccess = () => setIsLoggedIn(true);

          // Update accounts array and localStorage
          const updatedAccounts = [...accounts, userQuery.result.pathway];
          setAccounts(updatedAccounts);
          localStorage.setItem("savedAccounts", JSON.stringify(updatedAccounts));
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

      if (remember) {
        localStorage.setItem("savedUsername", userInfo.username);
      } else {
        localStorage.removeItem("savedUsername");
      }
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
    localStorage.setItem("rememberMe", newRememberState ? "true" : "false");
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
          formTitle={formTitle} accounts={[]} savedUser={''} setSavedUser={function (value: React.SetStateAction<string>): void {
            throw new Error('Function not implemented.');
          } }        />
      )}
    </div>
  );
};

























