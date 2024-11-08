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

const CryptoJS = require("crypto-js");

const secretKey = CryptoJS.lib.WordArray.random(32); // 256-bit random key
console.log(secretKey.toString(CryptoJS.enc.Hex)); // Display key in hex format

const encryptPassword = (password: string) => {
  const iv = CryptoJS.lib.WordArray.random(16); // Generate a random 128-bit IV
  const encrypted = CryptoJS.AES.encrypt(password, secretKey, { iv });
  return { encryptedPassword: encrypted.toString(), iv: iv.toString(CryptoJS.enc.Hex) };
};

const decryptPassword = (encryptedPassword: string, iv: string) => {
  const ivWordArray = CryptoJS.enc.Hex.parse(iv); // Convert hex back to WordArray
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey, { iv: ivWordArray });
  return bytes.toString(CryptoJS.enc.Utf8); // Decrypt and return as string
};

const checkInfo = (savedUsername: string, savedEncryptedPassword: string, savedIV: string, userInput: string, passInput: string) => {
  if (userInput === savedUsername) {
    try {
      const decryptedPassword = decryptPassword(savedEncryptedPassword, savedIV);
      if (decryptedPassword === passInput) {
        console.log("Login successful");
        return true;
      } else {
        console.log("Incorrect password");
        return false;
      }
    } catch (error) {
      console.error("Error decrypting password:", error);
      return false; // Return false if decryption fails
    }
  } else {
    console.log("Incorrect username");
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
      if (dbInstance) {
        setDb(dbInstance);
        const transaction = dbInstance.transaction("users", "readonly");
        const store = transaction.objectStore("users");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          const allUsers = getAllRequest.result;
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
              }
            };
          } else {
            if (!localStorage.getItem("homeVisit")) {
              localStorage.setItem("homeVisit", "true");
            }
          }
        };
      }
    };
  };
  initializeDatabase();
}, []);

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!userInfo.username || !userInfo.password) {
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
        if (formTitle === "Log in") {
          const { username, password, iv, remembered } = existingUser;

          if (checkInfo(username, password, iv, userInfo.username, userInfo.password)) {
            setIsLoggedIn(true);

            if (remember !== remembered) {
              existingUser.remembered = remember;
              const updateRequest = store.put(existingUser);
              updateRequest.onsuccess = () => {
                updateSavedUsers();
              };
            } else {
              updateSavedUsers();
            }

            if (!remember) {
              removeFromDropdown(userInfo.username);
            }
          }
        } else {
          alert("Account already exists. Please log in.");
          clearForm();
        }
      } else if (formTitle === "Create Account") {
        const { encryptedPassword, iv } = encryptPassword(userInfo.password);
        const newUser = { ...userInfo, password: encryptedPassword, iv, remembered: remember };
        store.put(newUser).onsuccess = () => {
          alert("Account created successfully!");
          setIsLoggedIn(true);
          updateSavedUsers();
        };
      }
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
  
      if (window.confirm("Are you sure you want to delete your account? This can't be undone!")) {
        const deleteRequest = store.delete(username);
  
        deleteRequest.onsuccess = () => {
          console.log(`Account ${username} deleted successfully.`);
          setUserInfo({username: "", password: "", remembered: false});
          clearForm(); 
          handleLogout(); // Ensure the user is logged out after deletion
        };
  
        deleteRequest.onerror = (event) => {
          console.error("Error deleting account:", event);
        };
      }
  
      transaction.oncomplete = () => {
        console.log("Delete transaction completed.");
      };
  
      transaction.onerror = (event) => {
        console.error("Error in transaction while deleting account:", event);
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
        console.log("Remembered accounts:", rememberedAccounts);
  
        setAccounts(rememberedAccounts); // Update dropdown with remembered users only
  
        if (rememberedAccounts.length > 0) {
          setUserInfo({
            username: rememberedAccounts[0].username,
            password: rememberedAccounts[0].password,
            remembered: rememberedAccounts[0].remembered,
          });
          setSelect(rememberedAccounts[0].username);
        } 
      };
  
      request.onerror = () => {
        console.error("Error fetching users.");
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
    setIsFormOpen(true);  // Ensure the form opens after logout
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