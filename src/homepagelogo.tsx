import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import jerboa from './Images/Four-toes-jerboa-modified.png';
import { LoginForm } from './LoginForm';
import { Button} from 'react-bootstrap';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", password: "", remembered: false});
  const [remember, setRemember] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formTitle, setFormTitle] = useState("Create Account");
  const [db, setDb] = useState<IDBDatabase | null>(null); // stores the indexedDB database instance
  const [accounts, setAccounts] = useState<{ username: string; password: string, remembered: boolean, iv: string }[]>([]);
  const [selectedUser, setSelect] = useState("Select a saved user");
  const [passwordPlaceholder, setPlaceholder] = useState<string>(""); // a blank input space for the reset form
  const [newPassword, setNewPassword] = useState<string>("");
  const [calledUsername, setCalled]= useState<string>("");
  const [isPasswordReset, setIsPasswordReset] = React.useState<boolean>(false);

  const CryptoJS = require("crypto-js");

  const secretKey = process.env.REACT_APP_SECRET_KEY; // private password for the encryption algorithmn

  useEffect(() => {
    if (!secretKey) {
      console.error("Missing secret key in environment variables");
    }
  }, [secretKey]);

  useEffect(() => {
    const initializeDatabase = async () => {
      const indexedDB = window.indexedDB;
      const request = indexedDB.open("UserDatabase", 2);
  
      request.onerror = (event) => {
        console.error("Error opening user database!", event);
      };
  
      request.onupgradeneeded = (event) => {
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        dbInstance.createObjectStore("users", { keyPath: "username" }); // creates or updates database: creates an objectStore if not found
      };
  
      request.onsuccess = () => {
        const dbInstance = request.result;
        if (dbInstance) {
          setDb(dbInstance); // save current db instance
          const transaction = dbInstance.transaction("users", "readonly");
          const store = transaction.objectStore("users");
          const getAllRequest = store.getAll();
  
          getAllRequest.onsuccess = () => {
            const allUsers = getAllRequest.result;
            const defaultAccount = { username: "Select a saved user", password: "", remember: true, iv: "" };
            setAccounts([defaultAccount, ...allUsers]);
            if(!isLoggedIn)
            {
              clearForm(); // clear form for account deletion
            }
          };
        } else {
          if (!localStorage.getItem("homeVisit")) { // save user visit to refresh saved accounts for next surf
            localStorage.setItem("homeVisit", "true");
          }
        }
      };
    };
    initializeDatabase(); // create/update database
  }, [formTitle, isLoggedIn]);

/* Encrypt password and store both encrypted password and IV
    Secret Key: A private password for Advanced Encryption Standard (AES)
    Initialized Vector (IV): unique random string used to control encyption output. Prevents hackers from recognizing patterns.
*/

const encryptPassword = (password: string) => {
  const iv = CryptoJS.lib.WordArray.random(16); // Generate a new random IV
  const encrypted = CryptoJS.AES.encrypt(password, secretKey, { iv: iv }).toString();
  return { encryptedPassword: encrypted, iv: iv.toString() };
};

const decryptPassword = (encryptedPassword: string, iv: string) => { // decrypt the user password for log in purposes
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey, { iv: CryptoJS.enc.Hex.parse(iv) }); // parse IV into readable form
  return bytes.toString(CryptoJS.enc.Utf8); 
};

const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => { // updates the password to be reset in the reset form
  const placeholder = event.target.value; 
  setPlaceholder(placeholder); 
  
  const encrypted = encryptPassword(placeholder);
  const encryptedPassword = encrypted.encryptedPassword;
  setNewPassword(encryptedPassword);
  
  setUserInfo(prevState => ({ // updates user info
    ...prevState,
    password: encryptedPassword,
  }));
  
  const usernameToUpdate = calledUsername;  // reset password for the called user
  
  if (db) {
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    const getUserRequest = store.get(usernameToUpdate); 
    
    getUserRequest.onsuccess = () => {
      const existingUser = getUserRequest.result;
  
      if (existingUser) {
        
        existingUser.password = encryptedPassword;
        
        const updateRequest = store.put(existingUser); // overwrites old password in database
        
        updateRequest.onsuccess = () => {
          updateSavedUsers();  // Update saved accounts
        };
  
        updateRequest.onerror = (event) => {
          console.error("Error updating password:", event);
        };
      } else {
        console.error("User not found for updating password.");
      }
    };
  
    transaction.onerror = (event) => {
      console.error("Error accessing user store:", event);
    };
  }
};

const updateCalledUser = (event: React.ChangeEvent<HTMLInputElement>) =>
{
  setCalled(event.target.value);
}

const checkInfo = (savedUsername: string, savedEncryptedPassword: string, savedIV: string, userInput: string, passInput: string) => // checks if log in input matches user credentials
{
  if (userInput === savedUsername) {
      const decryptedPassword = decryptPassword(savedEncryptedPassword, savedIV); // decrypt password to compare
      return decryptedPassword.trim() === passInput.trim()
  } else {
    return false;
  }
};

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
          const { username, password: encryptedPassword, iv, remembered } = existingUser;

          if (checkInfo(username, encryptedPassword, iv, userInfo.username, userInfo.password)) {
            setIsLoggedIn(true);
            if (remember !== remembered) {
              existingUser.remembered = remember;
              const updateRequest = store.put(existingUser); // change remembered field of user if changed
              updateRequest.onsuccess = () => updateSavedUsers(); // save changes
              updateRequest.onerror = (event) => console.error("Error updating remembered status:", event);
            } else {
              updateSavedUsers(); // update regardless if updateSavedUsers() finds no remembered accounts
            }
            if (!remember) {
              removeFromDropdown(userInfo.username); // remove saved account when not remembered
            }
          } else {
            alert("Incorrect username or password.");
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
      } else {
        alert("Username doesn't exist!");
        clearForm();
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
              user.remembered = false; // set to false to remove from saved accounts

              const updateRequest = store.put(user);

              updateRequest.onsuccess = () => {
                  updateSavedUsers(); // Refresh the accounts list after updating
                  // Trigger a re-render for the dropdown or selected user change.
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

const deleteAccount = async (username: string) => {
  if (db) {
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    if (window.confirm("Are you sure you want to delete your account? This can't be undone!")) {
      try {
        const getRequest = store.get(username);

        getRequest.onsuccess = async () => {
          const userAccount = getRequest.result;

          if (userAccount && userAccount.remembered) {
            removeFromDropdown(username); // Remove account from saved dropdown if remembered
          }

          const deleteRequest = store.delete(username);

          deleteRequest.onsuccess = () => {
            handleLogout(); // Reset the login state
            updateSavedUsers(); // Update saved accounts
            alert("Account deleted!");
          };

          deleteRequest.onerror = () => {
            console.error("Error deleting account");
          };
        };

        getRequest.onerror = () => {
          console.error("Error fetching account");
        };
      } catch (error) {
        console.error("An error occurred while deleting the account:", error);
      }
    }
  }
};
    
const updateSavedUsers = () => { 
  if (db) {
    const transaction = db.transaction("users", "readonly");
    const store = transaction.objectStore("users");
    const request = store.getAll();

    request.onsuccess = () => {
      const allAccounts = request.result;
      setAccounts(allAccounts); // Set all users for general access

      const rememberedAccounts = allAccounts.filter(account => account.remembered);
      if (rememberedAccounts.length > 1) { 
        const account = rememberedAccounts[0];  // Select the first remembered account
        const decryptedPassword = decryptPassword(account.password, account.iv); 
        setUserInfo({
          username: account.username,
          password: decryptedPassword,  
          remembered: account.remembered,
        });
        setSelect(account.username);  // Update the dropdown to show the remembered username
      } else {
        setUserInfo({
          username: userInfo.username,
          password: userInfo.password,
          remembered: false, 
        });
      }
    };
  }
};

  const toggleForm = () => { // controls opening/closing form
    if(formTitle === "Reset Password")
    {
      setIsPasswordReset(false);
    }
    setIsFormOpen(!isFormOpen);
  };

  const clearForm = () => {
    setTimeout(() => {
      setUserInfo({ username: "", password: "", remembered: false });
      setSelect(""); // Clear selected user from dropdown
    }, 50); 
  };  

  const updateStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target; // destructured HTML element
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox" ? checked : value, // takes name as generic key... updates field based on type
    }));
  };   

  const handleLogout = () => {
    setTimeout(() =>
    {
      alert("Logging out...");
      setIsLoggedIn(false);
      setIsFormOpen(false);
    }, 1500);
}; 
  
  const handleRemember = () => {
    const newRememberState = !remember; // switch remember on check mark click/unclick
    setRemember(newRememberState); 
  };  
  
  const showForm = (title: string) => {
    setFormTitle(title);
    if (title === "Create Account") {
      clearForm(); // clear form fields when switching to "Create Account"
    }
    else if(title === "Log in")
    {
      setRemember(true); // set true regardless to show saved accounts
    }
    toggleForm();
  }; 

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <img
            src={jerboa} // default profile picture
            alt="Four-Toed Jerboa"
            style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }}
            onClick={() => showForm("Create Account")}
            title={userInfo.username} 
          />
          <div>
            <Button 
              style={{ float: "left", marginTop: "10px", borderRadius: "20px", backgroundColor: "salmon" }}
              onClick={handleLogout}
            >
              Log out
            </Button>
  
            <Button 
              onClick={() => deleteAccount(userInfo.username)} 
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
            title="Guest" // default visiter status
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
          setFormTitle={setFormTitle}
          decryptPassword = {decryptPassword}
          passwordPlaceholder = {passwordPlaceholder}
          setPlaceholder={setPlaceholder}
          isPasswordReset = {isPasswordReset}
          setIsPasswordReset={setIsPasswordReset}
          newPassword = {newPassword}
          updatePassword = {updatePassword}
          calledUsername = {calledUsername}
          setCalled = {setCalled}
          updateCalledUser = {updateCalledUser}
        />
      )}
      <a href="https://bleaky11.github.io/starter_helpi/" style={{ color: 'black' }}>
        <h1>The Career Quiz</h1>
      </a>
    </div>
  )};