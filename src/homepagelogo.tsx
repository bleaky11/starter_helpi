import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import jerboa from './Images/Four-toes-jerboa-modified.png';
import { LoginForm } from './LoginForm';
import { Button } from 'react-bootstrap';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ username: string; password: string }>({ username: "", password: "" });
  const [remember, setRemember] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>("Create Account");
  const [db, setDb] = useState<IDBDatabase | null>(null); // Store db instance
  const [accounts, setAccounts] = useState<string[]>([]);
  const [savedUser, setSavedUser] = useState<string>(accounts[0]);

  const checkInfo = (savedUsername: string, savedPassword: string, userInput: string, passInput: string) => {
    let userAccess: boolean = false;
    if ((userInput === savedUsername) && (passInput === savedPassword)) {
      userAccess = true;
    } else if (userInput !== savedUsername) {
      alert("Wrong username entered!");
    } else if (passInput !== savedPassword) {
      alert("Wrong password entered!");
    }
    return userAccess;
  }

  useEffect(() => {

    const savedAccounts = JSON.parse(localStorage.getItem("savedAccounts") || "[]");
    setAccounts(savedAccounts);
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
        if (userQuery.result) { // Check that the result is not null or undefined
            const savedUsername = userQuery.result.username;
            const savedPassword = userQuery.result.password;
    
            if (checkInfo(savedUsername, savedPassword, userInfo.username, userInfo.password)) {
                setIsLoggedIn(true);
            }
        } else if (formTitle === "Create Account") {
            const newUser = { username: userInfo.username, password: userInfo.password };
            store.put(newUser).onsuccess = () => setIsLoggedIn(true);
    
            // Update accounts array and localStorage
            const updatedAccounts = [...accounts, userInfo.username];
            setAccounts(updatedAccounts);
            localStorage.setItem("savedAccounts", JSON.stringify(updatedAccounts));
        } else {
            alert("User does not exist. Please create an account first.");
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

  const handleLogout = () =>
  {
    setIsLoggedIn(!isLoggedIn);
  }

  const handleRemember = () => {
    const newRememberState = !remember;
    setRemember(newRememberState);
    localStorage.setItem("rememberMe", newRememberState ? "true" : "false"); // Save remember me state
    console.log("Remember Me state changed to:", newRememberState);
  };

  // Show form with specific title
  const showForm = (title: string) => {
    setFormTitle(title);
    toggleForm();
  };

  return (
    <div>
     {isLoggedIn ? (
  // If the user is logged in, show the jerboa image and a log out button
  <div>
    <img
      src={jerboa}
      alt="Four-Toed Jerboa"
      style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }}
      onClick={() => showForm("Create Account")}
      title={userInfo.username} // Tooltip with the username
    />
    <Button
      onClick={handleLogout} // Define this function to handle logout
      style={{ float: "left", marginTop: "10px", borderRadius: "20px", backgroundColor: "darkred" }}
    >
      Log out
    </Button>
  </div>
) : (
  // If the user is not logged in, show the guest profile image and the log in button
  <div>
    <img
      src={userProfile}
      alt="User Profile"
      style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }}
      onClick={() => showForm("Create Account")}
      title="Guest" // Tooltip for guest
    />
    <Button
      onClick={() => showForm("Log in")}
      style={{ float: "left", marginTop: "10px", borderRadius: "20px", backgroundColor: "darkblue" }}
    >
      Log in
    </Button>
  </div>
)}  
      {isFormOpen && !isLoggedIn && (
        <LoginForm
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          remember={remember}
          setRemember={setRemember}
          handleRemember={handleRemember}
          handleSubmit={handleSubmit}
          updateStatus={updateStatus}
          savedUser={savedUser}
          setSavedUser={setSavedUser}
          accounts={accounts}
          closeForm={toggleForm} // Use toggleForm to close the form
          formTitle={formTitle} // Pass the form title to LoginForm
        />
      )}
  
      <a href="https://bleaky11.github.io/starter_helpi/" style={{ color: 'black' }}>
        <h1>The Career Quiz</h1>
      </a>
    </div>
  );
};


  
























