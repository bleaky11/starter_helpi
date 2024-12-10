import React, { useState, useEffect, useCallback } from 'react';
import userProfile from './Images/user-profile.png';
import detective from './Images/detective-profile.png';
import { initializeDatabase } from './db';
import { Database } from './db';
import { LoginForm } from './LoginForm';
import { Button } from 'react-bootstrap';
import { Question } from './basicCareer';
import { DetailedQuestion } from './detailedCareer';

export interface Account
{
  username: string;
  password: string;
  remembered: boolean; // tracks whether the user is remembered 
  loggedIn: string;
  basicComplete: boolean;
  detailedComplete: boolean;
  quiz: Question[]; // user's saved basic questions
  progress: number,
  detailedQuiz: DetailedQuestion[]; // user's saved detailed questions
  ivUser: string;
  ivPass: string;
}

interface Users
{
  loggedUser: Account | null; // tracks logged in account
  setLoggedUser: React.Dispatch<React.SetStateAction<Account | null>>;
}

export const HomePage = ({db, setDb, loggedUser, setLoggedUser}: Users & Database) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", password: "", remembered: false});
  const [remember, setRemember] = useState(false); // tracks form state
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [formTitle, setFormTitle] = useState("Create Account"); 
  const [accounts, setAccounts] = useState<Account[]>([]); 
  const [selectedUser, setSelect] = useState("Select a saved user");
  const [passwordPlaceholder, setPlaceholder] = useState<string>(""); // a blank input space for the reset form
  const [newPassword, setNewPassword] = useState<string>(""); // new password for reset form
  const [calledUsername, setCalled]= useState<string>("");
  const [isPasswordReset, setIsPasswordReset] = React.useState<boolean>(false);

  const CryptoJS = require("crypto-js");
  const secretKey = process.env.REACT_APP_SECRET_KEY; 

  const decryptPassword = useCallback((encryptedPassword: string, iv: string) => { 
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey, { iv: CryptoJS.enc.Hex.parse(iv) }); // parse IV into readable form
    return bytes.toString(CryptoJS.enc.Utf8); 
  }, [CryptoJS.AES, CryptoJS.enc.Hex, CryptoJS.enc.Utf8, secretKey]);
  
  const decryptUsername = useCallback((encryptedUsername: string, iv: string) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedUsername, secretKey, { iv });
      const username = decrypted.toString(CryptoJS.enc.Utf8); // returns decrypted username for secure transaction
      return username;
    } catch (error) {
      console.error("Error decrypting username:", error);
      return null;
    }
  }, [CryptoJS.AES, CryptoJS.enc.Utf8, secretKey]);

  const updateSavedUsers = useCallback(() => {
    if (db) {
      const transaction = db.transaction("users", "readonly");
      const store = transaction.objectStore("users");
      const request = store.getAll();
  
      request.onsuccess = () => {
        const allAccounts = request.result;
  
        if (!allAccounts || allAccounts.length === 0) {
          console.warn("No accounts found in the database.");
          setAccounts([]); // Explicitly set an empty array to avoid stale state
          return;
        }
  
        setAccounts(allAccounts); // grants general access to fetched accounts
  
        const rememberedAccounts = allAccounts.filter(account => account.remembered);
  
        if (rememberedAccounts.length > 0) {
          const account = rememberedAccounts[0]; // track the selected user info in saved dropdown
  
          if (account.username && account.password && account.iv) { 
            const decryptedPassword = decryptPassword(account.password, account.iv);
            const decryptedUsername = decryptUsername(account.username, account.iv);
  
            setUserInfo({
              username: decryptedUsername, // update info
              password: decryptedPassword,
              remembered: account.remembered,
            });
            setSelect(account.username);
          }
        } 
      };
  
      request.onerror = () => {
        console.error("Error fetching users from the database.");
      };
    }
  }, [db, decryptPassword, decryptUsername]);
  
  
  const findUser = useCallback((username: string, accounts: Account[]) => { // finds a user account
    return accounts.find(account => { 
      try {
        const decryptedUsername = decryptUsername(account.username, account.ivUser);
        return decryptedUsername === username;
      } catch (error) {
        console.error("Failed to decrypt username:", error);
        return false; // Skip account if not found
      }
    });
  }, [decryptUsername]);

  const loadAccounts = useCallback(
    async (database: IDBDatabase): Promise<Account[]> => { // returns a Promise to perform async db operations
      if (!database) throw new Error("Database not initialized");
  
      return new Promise((resolve, reject) => {
        const transaction = database.transaction("users", "readonly");
        const store = transaction.objectStore("users");
        const request = store.getAll(); // fetch all accounts
  
        request.onsuccess = () => {
          updateSavedUsers();
          resolve(request.result as Account[]); // fulfills the promise with the updated accounts
        };
  
        request.onerror = () => {
          console.error("Failed to fetch accounts from database");
          reject("Failed to fetch accounts"); 
        };
      });
    },
    [updateSavedUsers]
  );

  const trackUser = useCallback( // sets logged user attributes for changes in db
    (username: string, accounts: Account[]) => {
      const user = findUser(username, accounts);
      if (user) {
        setUserInfo({
          username: decryptUsername(user.username, user.ivUser),
          password: user.password,
          remembered: user.remembered,
        });
        setIsLoggedIn(true);
        setLoggedUser(user);
      } else {
        console.warn("No matching user found");
      }
    },
    [findUser, decryptUsername, setUserInfo, setIsLoggedIn, setLoggedUser] // Dependencies for useCallback
  );
  
  const trackGuest = useCallback(() => { // sets guest attributes for changes in db
    setIsLoggedIn(false);
    setLoggedUser(null);
  }, [setIsLoggedIn, setLoggedUser]); 
  
  useEffect(() => {
    if (!secretKey) {
      console.error("Missing secret key in environment variables");
    }
  }, [secretKey]);

  useEffect(() => {
    const initializeAndFetchAccounts = async () => {
      try {
        const database = db || (await initializeDatabase()); // set db or wait for initilization
        setDb(database); // track latest version
  
        const allAccounts = await loadAccounts(database);
        setAccounts(allAccounts); // fetch accounts
  
        const loggedIn = sessionStorage.getItem("loggedIn") === "true";
        const storedUsername = sessionStorage.getItem("username");
  
        if (loggedIn && storedUsername) {
          trackUser(storedUsername, allAccounts); // user case
        } else {
          trackGuest(); // guest case
        }
      } catch (error) {
        console.error("Error in initializeAndFetchAccounts:", error);
      }
    };
    initializeAndFetchAccounts();
  }, [db, loadAccounts, setDb, trackGuest, trackUser]); 
  
/* Encrypt username and password for user security
    Secret Key: A private password for Advanced Encryption Standard (AES)
    Initialized Vector (IV): unique random string used to control encyption output. Prevents hackers from recognizing patterns.
*/

const encryptUsername = (username: string) => 
{
  const iv = CryptoJS.lib.WordArray.random(16); // Generate a new random IV
  const encrypted = CryptoJS.AES.encrypt(username, secretKey, { iv: iv }).toString();
  return {encryptedUsername: encrypted, ivUser: iv.toString()};
}

const encryptPassword = (password: string) => {
  const iv = CryptoJS.lib.WordArray.random(16); // Generate a new random IV
  const encrypted = CryptoJS.AES.encrypt(password, secretKey, { iv: iv }).toString();
  return { encryptedPassword: encrypted, ivPass: iv.toString() };
};

const resetUserData = () => 
{
  sessionStorage.removeItem("userBasicCount"); // reset notifications for a fresh count of the next logged in user
  sessionStorage.removeItem("userDetailedCount");
  sessionStorage.removeItem("quizAnswers"); // remove detailed sessionStorage for distinction between users and guests
  sessionStorage.removeItem("quizQuestions"); 
}

const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => { // Update the password to be reset in the reset form
  const placeholder = event.target.value;
  setPlaceholder(placeholder); 

  const encrypted = encryptPassword(placeholder);
  const encryptedPassword = encrypted.encryptedPassword;

  setNewPassword(encryptedPassword);

  setUserInfo((prevState) => ({  // Update user info
    ...prevState,
    password: encryptedPassword,
  }));

  const usernameToUpdate = findUser(userInfo.username, accounts)?.username;

  if (db && usernameToUpdate) {
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    const getUserRequest = store.get(usernameToUpdate);

    getUserRequest.onsuccess = () => {
      const existingUser = getUserRequest.result;

      if (existingUser) {
        existingUser.password = encryptedPassword; // update account attributes
        existingUser.ivPass = encrypted.ivPass; 

        const updateRequest = store.put(existingUser);

        updateRequest.onsuccess = () => {
          updateSavedUsers(); // Update saved accounts
        };

        updateRequest.onerror = (event) => {
          console.error("Error updating password:", event);
        };
      } else {
        console.error("User not found for updating password.");
      }
    };

    getUserRequest.onerror = (event) => {
      console.error("Error fetching user for password update:", event);
    };

    transaction.onerror = (event) => {
      console.error("Error accessing user store:", event);
    };
  } else {
    console.error("Database is not available or usernameToUpdate is undefined.");
  }
};

const updateCalledUser = (event: React.ChangeEvent<HTMLInputElement>) => {
  const username = event.target.value;
  setCalled(username);
  setUserInfo((prevState) => ({
    ...prevState,
    username, // Sync with userInfo
  }));
};

const checkInfo = (savedEncryptedUsername: string, savedEncryptedPassword: string, savedUsernameIV: string, savedPasswordIV: string, userInput: string, passInput: string) => {
  const decryptedUsername = decryptUsername(savedEncryptedUsername, savedUsernameIV); 
  if (decryptedUsername === userInput) { // validates input with account credentials
    const decryptedPassword = decryptPassword(savedEncryptedPassword, savedPasswordIV);
    return decryptedPassword.trim() === passInput.trim();
  } else {
    return false;
  }
};

const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!accounts.length && db) {
    await loadAccounts(db);
  }

  if (!userInfo.username || !userInfo.password) {
    alert("Username and password are required.");
    return;
  }

  if (db) {
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
      const matchingUser = findUser(userInfo.username, accounts);

      if (matchingUser) 
        {
        const { username: storedEncryptedUsername, password: storedEncryptedPassword, remembered, ivUser, ivPass} = matchingUser;
        if (formTitle === "Log in") {
          const isValid = checkInfo(  
            storedEncryptedUsername,
            storedEncryptedPassword,
            ivUser,
            ivPass,
            userInfo.username,
            userInfo.password
          );

          if (isValid) {
            if (remember !== remembered) {  // Update remembered status if needed
              matchingUser.remembered = remember;
            }
              const decryptedUsername = decryptUsername(matchingUser.username, matchingUser.ivUser);
              setUserInfo({
                username: decryptedUsername, 
                password: matchingUser.password,
                remembered: matchingUser.remembered,
              });
              sessionStorage.setItem("username", decryptedUsername);  // track logged user in db index
              sessionStorage.setItem("loggedIn", "true");
              resetUserData();
              setIsLoggedIn(true);
              setLoggedUser(matchingUser);
              matchingUser.loggedIn = "true";
              matchingUser.detailedComplete = false; // set to false on each log in via session storage
              store.put(matchingUser);
              updateSavedUsers();

            if (!remember) {  // Remove from dropdown if "Remember me" is not checked
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
        const { encryptedPassword, ivPass } = encryptPassword(userInfo.password);
        const { encryptedUsername, ivUser } = encryptUsername(userInfo.username);

        const newUser = { // store used with encrypted username and password for security
          username: encryptedUsername,
          password: encryptedPassword,
          ivUser: ivUser,
          ivPass: ivPass,
          remembered: remember,
          loggedIn: "true",
          basicComplete: false,
          detailedComplete: false,
          progress: 0,
          quiz: [],
          detailedQuiz: []
        };
        sessionStorage.setItem("username", userInfo.username); // track logged user in db index
        sessionStorage.setItem("loggedIn", "true");
        resetUserData();
        setIsLoggedIn(true); 
        setLoggedUser(newUser);
        store.put(newUser).onsuccess = () => {
          alert("Account created successfully!");
          updateSavedUsers();
        };
      } else {
        alert("Username doesn't exist!");
        clearForm();
      }
    };

    getAllRequest.onerror = () => {
      console.error("Error fetching users from the database.");
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

const handleLogout = async (username: string) => {
  if (db) {
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");
    
    const getRequest = store.getAll();  

    getRequest.onsuccess = () => {
      const userAccount = findUser(username, accounts); // find user to logout
      if (userAccount) {
        userAccount.loggedIn = "false";  
        const putRequest = store.put(userAccount);
        
        putRequest.onsuccess = () => {
            clearForm();
            resetUserData();
            setIsLoggedIn(false);  
            setLoggedUser(null); 
            setIsFormOpen(false);  
            sessionStorage.setItem("loggedIn", "false");  
            sessionStorage.removeItem("username");
        };
        putRequest.onerror = (error) => {
          console.error("Error updating user status in the database:", error);
        };
      } else {
        alert("User not found!");  // Handle the case where the user is not found
      }
    };

    getRequest.onerror = (error) => {
      console.error("Error fetching users for logout:", error);
    };
  }
};   

const deleteAccount = async (username: string) => {
  if (db) {
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    if (window.confirm("Are you sure you want to delete your account? This can't be undone!")) {
      try {
        const getRequest = store.getAll();

        getRequest.onsuccess = () => {
          const userAccount = findUser(username, accounts);
          if (userAccount) 
            {
            if (userAccount.remembered) {
              removeFromDropdown(username);
            }
         
            const deleteRequest = store.delete(userAccount.username);  // Delete the account using its encrypted username

            deleteRequest.onsuccess = () => {
              clearForm();
              sessionStorage.setItem("loggedIn", "false");  
              sessionStorage.removeItem("username");
              setIsLoggedIn(false);  
              setLoggedUser(null); 
              setIsFormOpen(false);  
              toggleForm();
              updateSavedUsers(); // Update saved accounts
              alert("Account deleted!");
            };
            deleteRequest.onerror = () => {
              console.error("Error deleting account");
            };
          } else {
            console.error("Account not found");
          }
        };
        getRequest.onerror = () => {
          console.error("Error fetching accounts");
        };
      } catch (error) {
        console.error("An error occurred while deleting the account:", error);
      }
    }
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
  
  const handleRemember = () => {
    const newRememberState = !remember; // switch remember on check mark click/unclick
    setRemember(newRememberState); 
  };  
  
  const showForm = (title: string) => {
    setFormTitle(title);
    if (title === "Create Account") {
      clearForm(); // clear form fields when switching to "Create Account"
      setRemember(false);
    }
    else if(title === "Log in")
    {
      setRemember(true); // set true regardless to show saved accounts
    }
    toggleForm();
  }; 

  return (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    {isLoggedIn ? (
      <>
        <img
          src={detective}
          alt="detective profile"
          style={{ width: "70px", height: "70px", cursor: "pointer" }}
          onClick={() => showForm("Create Account")}
          title={userInfo.username}
        />
        <Button
          style={{ borderRadius: "20px", backgroundColor: "salmon" }}
          onClick={() => [handleLogout(userInfo.username), alert("Logged out successfully!")]}
        >
          Log out
        </Button>
        <Button
          onClick={() => deleteAccount(userInfo.username)}
          style={{ borderRadius: "20px", backgroundColor: "darkred" }}
        >
          Delete Account
        </Button>
      </>
      ) : (
        <div>
          <img
            src={userProfile}
            alt="User Profile"
            style={{ width: '50px', height: '55px', cursor: 'pointer' }}
            onClick={() => showForm("Create Account")}
            title="Guest" // default visitor status
          />
          <Button
            style={{ borderRadius: "20px", height: "100%", backgroundColor: "darkblue" }}
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
        handleLogin={handleLogin}
        updateStatus={updateStatus}
        selectedUser={selectedUser}
        setSelect={setSelect}
        accounts={accounts}
        closeForm={toggleForm}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        decryptUsername = {decryptUsername}
        decryptPassword={decryptPassword}
        passwordPlaceholder={passwordPlaceholder}
        setPlaceholder={setPlaceholder}
        isPasswordReset={isPasswordReset}
        setIsPasswordReset={setIsPasswordReset}
        newPassword={newPassword}
        updatePassword={updatePassword}
        calledUsername={calledUsername}
        setCalled={setCalled}
        updateCalledUser={updateCalledUser}
      />
    )}
    <div style={{flexGrow:'1', textAlign:'center', position:'relative', zIndex: 1, marginTop: '15px'}}>
      <a
        href="https://bleaky11.github.io/starter_helpi/"
        style={{ color: 'black', fontSize: '45px', textDecoration: 'none', fontFamily:"fantasy" }}
      >
        The Career Codebreaker
      </a>
    </div>
  </div>
)}  