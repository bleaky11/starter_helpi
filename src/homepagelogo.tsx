import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import jerboa from './Images/Four-toes-jerboa-modified.png';
import { LoginForm } from './LoginForm';
import { Button} from 'react-bootstrap';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ username: string; password: string }>({ username: "Guest", password: "" });
  const [remember, setRemember] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>("Create Account");
  const [accounts, setAccounts] = useState<string[]>([]);
  const [savedUser, setSavedUser] = useState<string>(accounts[0]);
  const [db, setDb] = useState<IDBDatabase | null>(null); // Store db instance

  const checkInfo = (savedUsername: string, savedPassword: string, userInput: string, passInput: string) => {
    return userInput === savedUsername && passInput === savedPassword;
  };

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
    if (db) {
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");
      const userQuery = store.get(userInfo.username);

      userQuery.onsuccess = () => {
        const savedUsername = userQuery.result?.username;
        const savedPassword = userQuery.result?.password;

        if (userQuery.result) {
          if (checkInfo(savedUsername, savedPassword, userInfo.username, userInfo.password)) {
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
          alert("User does not exist. Please create an account first.");
        }
      };

      if (remember) {
        localStorage.setItem("savedUsername", userInfo.username);
      } else {
        localStorage.removeItem("savedUsername");
      }
    }
  };

  const handleLogout = () => setIsLoggedIn(false);

  const handleRemember = () => {
    const newRememberState = !remember;
    setRemember(newRememberState);
    localStorage.setItem("rememberMe", newRememberState ? "true" : "false");
  };

  const showForm = (title: string) => {
    setFormTitle(title);
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <img src={jerboa} alt="Four-Toed Jerboa" style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }} onClick={() => showForm("Create Account")} title={userInfo.username} />
          <Button onClick={handleLogout} style={{ float: "left", marginTop: "10px", borderRadius: "20px", backgroundColor: "darkred" }}>Log out</Button>
        </div>
      ) : (
        <div>
          <img src={userProfile} alt="User Profile" style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }} onClick={() => showForm("Create Account")} title="Guest" />
          <Button onClick={() => showForm("Log in")} style={{ float: "left", marginTop: "10px", borderRadius: "20px", backgroundColor: "darkblue" }}>Log in</Button>
        </div>
      )}
      {isFormOpen && !isLoggedIn && (
        <LoginForm userInfo={userInfo} setUserInfo={setUserInfo} remember={remember} setRemember={setRemember} handleRemember={handleRemember} handleSubmit={handleSubmit} accounts={accounts} savedUser={savedUser} setSavedUser={setSavedUser} updateStatus={(event) => setUserInfo({ ...userInfo, [event.target.name]: event.target.value })} closeForm={() => setIsFormOpen(false)} formTitle={formTitle} />
      )}
      <a href="https://bleaky11.github.io/starter_helpi/" style={{ color: 'black' }}><h1>The Career Quiz</h1></a>
    </div>
  );
};



  
























