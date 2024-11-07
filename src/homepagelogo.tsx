import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import jerboa from './Images/Four-toes-jerboa-modified.png';
import { LoginForm } from './LoginForm';
import { Button } from 'react-bootstrap';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formTitle, setFormTitle] = useState("Create Account");
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [accounts, setAccounts] = useState<{ username: string; password: string }[]>([]);
  const [selectedUser, setSelect] = useState("");

  const checkInfo = (savedUsername: string, savedPassword: string, userInput: string, passInput: string) => {
    if (userInput === savedUsername && passInput === savedPassword) {
      return true;
    } else {
      alert(userInput !== savedUsername ? "Wrong username entered!" : "Wrong password entered!");
      return false;
    }
  };

  useEffect(() => {
    const initializeDatabase = async () => {
      const indexedDB = window.indexedDB;
      const request = indexedDB.open("UserDatabase", 2);

      request.onerror = (event) => {
        console.error("Error opening user database!", event);
      };

      request.onupgradeneeded = (event) => {
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        dbInstance.createObjectStore("users", { keyPath: "username" });
        console.log("Object store created.");
      };

      request.onsuccess = () => {
        const dbInstance = request.result;
        setDb(dbInstance);

        if (dbInstance) {
          const transaction = dbInstance.transaction("users", "readonly");
          const store = transaction.objectStore("users");
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = () => {
            const allUsers = getAllRequest.result as { username: string; password: string; remembered: boolean }[];
            console.log("All users retrieved:", allUsers); // Check if data is retrieved here
            
            const rememberedAccounts = allUsers.filter(user => user.remembered);
            setAccounts(rememberedAccounts);
            console.log("Remembered accounts:", rememberedAccounts);
          };
            
          getAllRequest.onerror = (event) => {
            console.error("Error retrieving users from the users object store:", event);
          };
        } else {
          console.error("Database is not initialized.");
        }
      };
    };
    initializeDatabase();
  }, []); // Empty dependency array to avoid infinite loop  

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
        const existingUser = userQuery.result;
  
        if (existingUser) {
          const { username, password, remembered } = existingUser;
  
          if (checkInfo(username, password, userInfo.username, userInfo.password)) 
          {
            setIsLoggedIn(true);
  
            // Update "remembered" status if it has changed
            if (remembered !== remember) {
              const updatedUser = { ...existingUser, remembered: remember };
              store.put(updatedUser).onsuccess = () => {
                updateSavedUsers(); // Update saved users with the latest data
              };
            } else {
              updateSavedUsers(); // Update saved users even if "Remember me" is unchanged
            }
          }
        } else if (formTitle === "Create Account") {
          const newUser = { username: userInfo.username, password: userInfo.password, remembered: remember };
          store.put(newUser).onsuccess = () => {
            // Update saved users first to ensure the data is fresh
            updateSavedUsers(); // This ensures the account is updated in the list
            alert("Account creation success!");
            clearForm(); // Clears the form fields visually and resets the UI
            setIsLoggedIn(true); // Now set the login state as successful
          };
        } else {
          alert("User does not exist. Please create an account first.");
          clearForm();
        }
      };
  
      userQuery.onerror = () => {
        console.error("Error querying user data");
      };
  
      transaction.onerror = (event) => {
        console.error("Transaction failed:", event);
      };
    }
  };

  const updateSavedUsers = () => {
    if (db) {
      const transaction = db.transaction("users", "readonly");
      const store = transaction.objectStore("users");
      const request = store.getAll();
  
      request.onsuccess = () => {
        const rememberedAccounts = request.result.filter((account) => account.remembered);
        setAccounts(rememberedAccounts); // Update the accounts state with remembered users
        if (remember) {
          setSelect(userInfo.username); // Optionally set the selected user (if logged in and remember is true)
        }
      };
  
      request.onerror = () => {
        console.error("Error fetching users");
      };
    }
  };
  

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const clearForm = () => {
    setUserInfo({ username: "", password: "" });
  }

  const updateStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  

  const handleRemember = () => {
    const newRememberState = !remember;
    setRemember(newRememberState);
  };

  const showForm = (title: string) => {
    setFormTitle(title);
    if(title === "Create Account") {
      clearForm();
    }
    else
    {
      setRemember(true);
    }
    toggleForm();
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <img
            src={jerboa}
            alt="Four-Toed Jerboa"
            style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }}
            onClick={() => showForm("Create Account")}
            title={userInfo.username || "Logged-in User"} 
          />
          <Button
            onClick={handleLogout}
            style={{ float: "left", marginTop: "10px", borderRadius: "20px", backgroundColor: "darkred" }}
          >
            Log out
          </Button>
        </div>
      ) : (
        <div>
          <img
            src={userProfile}
            alt="User Profile"
            style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }}
            onClick={() => showForm("Create Account")}
            title="Guest"
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
          selectedUser={selectedUser}
          setSelect={setSelect}
          accounts={accounts}
          closeForm={toggleForm}
          formTitle={formTitle}
        />
      )}

      <a href="https://bleaky11.github.io/starter_helpi/" style={{ color: 'black' }}>
        <h1>The Career Quiz</h1>
      </a>
    </div>
  );
};