import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import jerboa from './Images/Four-toes-jerboa-modified.png';
import { LoginForm } from './LoginForm';
import { Button } from 'react-bootstrap';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", password: "", remembered: true});
  const [remember, setRemember] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formTitle, setFormTitle] = useState("Create Account");
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [accounts, setAccounts] = useState<{ username: string; password: string, remembered: boolean }[]>([]);
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
      };
  
      request.onsuccess = () => {
        const dbInstance = request.result;
        if (dbInstance) 
        {
          setDb(dbInstance);
          const transaction = dbInstance.transaction("users", "readonly");
          const store = transaction.objectStore("users");
          const getAllRequest = store.getAll();
  
          getAllRequest.onsuccess = () => {
            const allUsers = getAllRequest.result as { username: string; password: string; remembered: boolean }[];
            const rememberedAccounts = allUsers.filter(user => user.remembered);
            setAccounts(rememberedAccounts);

            if (localStorage.getItem("homeVisit") && rememberedAccounts.length > 0) {
              const firstAccount = rememberedAccounts[0];
              const getRequest = store.get(firstAccount.username);
              getRequest.onsuccess = () => {
                const rememberedUser = getRequest.result;
                if (rememberedUser) {
                  setUserInfo({
                    username: rememberedUser.username,
                    password: rememberedUser.password,
                    remembered: true,
                  });
                  setSelect(rememberedUser.username); 
                } else {
                  console.error("No user found for the remembered account:", firstAccount.username);
                }
              };
              getRequest.onerror = (event) => {
                console.error("Error retrieving remembered user:", event);
              };
            } else {
              // If this is the first visit, set homeVisit for future checks
              if (!localStorage.getItem("homeVisit")) {
                localStorage.setItem("homeVisit", "true");
              }
            }
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
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInfo.username || !userInfo.password) 
    {
      alert("Username and password are required.");
      return;
    }
  
    if (db) {
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");
  
      const userQuery = store.get(userInfo.username);
  
      userQuery.onsuccess = () => {
        const existingUser = userQuery.result;
  
        if (existingUser) {
          // If user exists and form is for logging in, verify credentials
          if (formTitle === "Log in") {
            const { username, password, remembered } = existingUser;
  
            if (checkInfo(username, password, userInfo.username, userInfo.password)) {
              setIsLoggedIn(true);
  
              if (remember !== remembered) {
                existingUser.remembered = remember;
                const updateRequest = store.put(existingUser);
                updateRequest.onsuccess = () => {
                  updateSavedUsers(); 
                };
              } else {
                updateSavedUsers(); // Refresh accounts if no change
              }
              
              // If "Remember me" is unchecked, delete the account from the saved accounts
              if (!remember) {
                removeFromDropdown(userInfo.username);
              }
            }
          } else {
            // If account exists, prompt user to log in
            alert("Account already exists. Please log in.");
            clearForm();
          }
        } else if (formTitle === "Create Account") {
          // If user does not exist, create a new account
          const newUser = { ...userInfo, remembered: remember };
          store.put(newUser).onsuccess = () => {
            alert("Account created successfully!");
            setIsLoggedIn(true);
            updateSavedUsers(); // Refresh accounts after new account creation
          };
        }
      };
  
      userQuery.onerror = (event) => {
        console.error("Error retrieving user:", event);
      };
    }  
  };  

  const removeFromDropdown = (username: string) => {
    if (db) {
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");
      const getUserRequest = store.get(username);
  
      getUserRequest.onsuccess = () => {
        const user = getUserRequest.result;
        
        if (user) {
          user.remembered = false;
  
          const updateRequest = store.put(user);
  
          updateRequest.onsuccess = () => {
            updateSavedUsers(); // Refresh the accounts list after updating
          };
  
          updateRequest.onerror = (event) => {
            console.error("Error updating account:", event);
          };
        }
      };
  
      transaction.onerror = (event) => {
        console.error("Error accessing the user store:", event);
      };
    }
  };
  
  const deleteAccount = (username: string) => {
    if (db) {
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");
      store.delete(username);
      setIsLoggedIn(false); // Log the user out after deleting the account
  
      transaction.oncomplete = () => {
        updateSavedUsers(); // Refresh the accounts list after deletion
      };
  
      transaction.onerror = (event) => {
        console.error("Error deleting account:", event);
      };
    }
  };  
  
  const updateSavedUsers = () => {
    if (db) {
      const transaction = db.transaction("users", "readonly");
      const store = transaction.objectStore("users");
      const request = store.getAll();
  
      request.onsuccess = () => {
        const rememberedAccounts = request.result.filter((account: { remembered: boolean }) => account.remembered);
        setAccounts(rememberedAccounts); // Update dropdown with remembered users only
  
        if (rememberedAccounts.length > 0) {
          setUserInfo({
            username: rememberedAccounts[0].username,
            password: rememberedAccounts[0].password,
            remembered: rememberedAccounts[0].remembered,
          });
          setSelect(rememberedAccounts[0].username);
        } else {
          clearForm(); // If no remembered accounts left, clear form
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
    setUserInfo({ username: "", password: "", remembered: false });
    setRemember(false);
  };  

  const updateStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox" ? checked : value,
    }));
  };   

  const handleLogout = () => {
    setIsLoggedIn(false);
    updateSavedUsers();
  };
  
  const handleRemember = () => {
    const newRememberState = !remember;
    setRemember(newRememberState); // Toggle remember state
  };  
  
  const showForm = (title: string) => {
    setFormTitle(title);
    clearForm();
    if (title === "Log in") 
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
          <div>
            <Button 
              style={{ float: "left", marginTop: "10px", borderRadius: "20px", backgroundColor: "salmon" }}
              onClick={handleLogout}
            >
              Log out
            </Button>
  
            <Button 
              onClick={() => deleteAccount(userInfo.username)} // Ensure the username is passed correctly here
              style={{
                float: "left", 
                marginTop: "10px", 
                borderRadius: "20px", 
                backgroundColor: "darkred"
              }}
            >
              Delete Account
            </Button>
          </div>
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
            style={{ float: "left", marginTop: "10px", borderRadius: "20px", backgroundColor: "darkblue" }}
            onClick={() => showForm("Log in")}
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
  )};