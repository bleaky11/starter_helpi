import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import jerboa from './Images/Four-toes-jerboa-modified.png';
import { LoginForm } from './LoginForm';
import { Button} from 'react-bootstrap';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", password: "", remembered: true});
  const [remember, setRemember] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formTitle, setFormTitle] = useState("Create Account");
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [accounts, setAccounts] = useState<{ username: string; password: string, remembered: boolean, iv: string }[]>([]);
  const [selectedUser, setSelect] = useState("");
  const [passwordPlaceholder, setPlaceholder] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [calledUsername, setCalled]= useState<string>("");
  const [isPasswordReset, setIsPasswordReset] = React.useState<boolean>(false);

  const CryptoJS = require("crypto-js");

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  useEffect(() => {
    if (!secretKey) {
      console.error("Missing secret key in environment variables");
    }
  }, [secretKey]);

  // Encrypt password and store both encrypted password and IV
const encryptPassword = (password: string) => {
  const iv = CryptoJS.lib.WordArray.random(16); // Generate a new random IV
  const encrypted = CryptoJS.AES.encrypt(password, secretKey, { iv: iv }).toString();
  
  return { encryptedPassword: encrypted, iv: iv.toString() };
};

const decryptPassword = (encryptedPassword: string, iv: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey, { iv: CryptoJS.enc.Hex.parse(iv) });
  return bytes.toString(CryptoJS.enc.Utf8); // Return the decrypted password
};

const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
  const placeholder = event.target.value; 
  setPlaceholder(placeholder);
  
  const encrypted = encryptPassword(placeholder);
  const encryptedPassword = encrypted.encryptedPassword;
  setNewPassword(encryptedPassword);
  
  setUserInfo(prevState => ({
    ...prevState,
    password: encryptedPassword,
  }));
  
  // Use resetUsername for fetching the user in the reset password form
  const usernameToUpdate = calledUsername;  // Use the username entered in the reset form
  
  // Proceed to update IndexedDB
  if (db) {
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    // Fetch the user based on the resetUsername, not userInfo.username
    const getUserRequest = store.get(usernameToUpdate);  // This will use the entered username
    
    getUserRequest.onsuccess = () => {
      const existingUser = getUserRequest.result;
  
      if (existingUser) {
        // Update the password in the existing user object
        existingUser.password = encryptedPassword;
        
        const updateRequest = store.put(existingUser);
        
        // On successful update, call updateSavedUsers() to refresh and decrypt
        updateRequest.onsuccess = () => {
          updateSavedUsers();  // This decrypts and updates the UI as needed
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

const checkInfo = (savedUsername: string, savedEncryptedPassword: string, savedIV: string, userInput: string, passInput: string) => {
  if (userInput === savedUsername) {
    try {
      const decryptedPassword = decryptPassword(savedEncryptedPassword, savedIV);
      if (decryptedPassword.trim() === passInput.trim()) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error decrypting password:", error);
      return false; // Return false if decryption fails
    }
  } else {
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
        };
      } else {
        if (!localStorage.getItem("homeVisit")) {
          localStorage.setItem("homeVisit", "true");
        }
        clearForm();
      }
    };
  };
  initializeDatabase();
}, [formTitle]);

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
            // Update remembered status if different
            if (remember !== remembered) {
              existingUser.remembered = remember;
              const updateRequest = store.put(existingUser);
              updateRequest.onsuccess = () => updateSavedUsers(); // Refresh after updating
              updateRequest.onerror = (event) => console.error("Error updating remembered status:", event);
            } else {
              updateSavedUsers();
            }

            if (!remember) {
              removeFromDropdown(userInfo.username);
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
            // First, get the account from the store
            const getRequest = store.get(username);

            getRequest.onsuccess = () => {
                const userAccount = getRequest.result;

                // Check if the account is remembered
                if (userAccount && userAccount.remembered) {
                    removeFromDropdown(username);
                }

                // Now delete the account
                const deleteRequest = store.delete(username);

                deleteRequest.onsuccess = () => {
                    setUserInfo({ username: "", password: "", remembered: false });
                    handleLogout();
                    clearForm();
                };

                deleteRequest.onerror = () => {
                    console.error("Error deleting account");
                };
            };

            getRequest.onerror = () => {
                console.error("Error fetching account");
            };
        }
    }
};
    
const updateSavedUsers = () => { 
  if (db) {
      const transaction = db.transaction("users", "readonly");
      const store = transaction.objectStore("users");
      const request = store.getAll();

      request.onsuccess = () => {
          const rememberedAccounts = request.result.filter(account => account.remembered);
          setAccounts(rememberedAccounts);

          if (rememberedAccounts.length > 0) {
              const account = rememberedAccounts[0];
              const decryptedPassword = decryptPassword(account.password, account.iv);
              setUserInfo({
                  username: account.username,
                  password: decryptedPassword,  // Decrypted password
                  remembered: account.remembered,
              });
              setSelect(account.username);
          }
          else
          {
            clearForm();
          }
      };
  }
};

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const clearForm = () => {
    setUserInfo({ username: "", password: "", remembered: false });
    setRemember(true); // Ensure 'remembered' is also reset
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
    setIsFormOpen(false);
}; 
  
  const handleRemember = () => {
    const newRememberState = !remember;
    setRemember(newRememberState); // Toggle remember state
  };  
  
  const showForm = (title: string) => {
    setFormTitle(title);
    if (title === "Create Account") {
      clearForm(); // Clear form fields when switching to "Create Account"
    }
    else if(title === "Log in")
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