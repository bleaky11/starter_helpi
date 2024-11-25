import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import detective from './Images/detective-profile.png';
import { initializeDatabase } from './db';
import { LoginForm } from './LoginForm';
import { Button } from 'react-bootstrap';
import { Question } from './basicCareer';

export const HomePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", password: "", remembered: false});
  const [remember, setRemember] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formTitle, setFormTitle] = useState("Create Account");
  const [db, setDb] = useState<IDBDatabase | null>(null); // stores the indexedDB database instance
  const [accounts, setAccounts] = useState<{ username: string; password: string, remembered: boolean, loggedIn: boolean, quiz: Question[], ivUser: string, ivPass: string }[]>([]);
  const [selectedUser, setSelect] = useState("Select a saved user");
  const [passwordPlaceholder, setPlaceholder] = useState<string>(""); // a blank input space for the reset form
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbInstance = await initializeDatabase();
        const db = dbInstance as IDBDatabase;
        setDb(db);
  
        const transaction = db.transaction("users", "readonly");
        const store = transaction.objectStore("users");
  
        const getAllUsers = () =>
          new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = (error) => reject(error);
          });
  
        const allUsers = await getAllUsers() as typeof accounts; // Await the result of the promise
        setAccounts(allUsers); // Update accounts state with the resolved value
        console.log("Fetched and updated accounts:", allUsers);
      } catch (error) {
        console.error("Error initializing the database:", error);
      }
    };
    if(sessionStorage.getItem("loggedIn"))
    {
      setIsLoggedIn(true);
    }
    fetchData();
  }, []); // Dependency array ensures this runs once  

/* Encrypt password and store both encrypted password and IV
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

const decryptUsername = (encryptedUsername: string, iv: string) => { 
  const bytes = CryptoJS.AES.decrypt(encryptedUsername, secretKey, { iv: CryptoJS.enc.Hex.parse(iv) }); // parse IV into readable form
  return bytes.toString(CryptoJS.enc.Utf8); 
}

const decryptPassword = (encryptedPassword: string, iv: string) => { // decrypt the user password for log in purposes
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey, { iv: CryptoJS.enc.Hex.parse(iv) }); // parse IV into readable form
  return bytes.toString(CryptoJS.enc.Utf8); 
};

const findUser = (username: string) => { // Find the matching account by decrypting usernames
  return accounts.find((account) => {
    try {
      const decryptedUsername = decryptUsername(account.username, account.ivUser);
      // Log for debugging decryption success
      console.log(`Decrypted Username: ${decryptedUsername}, Comparing with: ${username}`);
      return decryptedUsername === username;  // Compare decrypted username with input username
    } catch (error) {
      console.error("Decryption failed for account:", account, "Error:", error);  // Log decryption failure
      return false; // Skip this account if decryption fails
    }
  });
};

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

  console.log("username:", userInfo.username);
  const usernameToUpdate = findUser(userInfo.username)?.username;
  console.log("to update: ", usernameToUpdate);

  if (db && usernameToUpdate) {
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    const getUserRequest = store.get(usernameToUpdate);

    getUserRequest.onsuccess = () => {
      const existingUser = getUserRequest.result;

      if (existingUser) {
        // Update the password and IV in the database
        existingUser.password = encryptedPassword;
        existingUser.ivPass = encrypted.ivPass; // Use the IV generated during encryption

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
  if (decryptedUsername === userInput) {
    const decryptedPassword = decryptPassword(savedEncryptedPassword, savedPasswordIV);
    return decryptedPassword.trim() === passInput.trim();
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
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
      console.log("Fetching accounts in handleSubmit:", accounts);  // Log accounts before calling findUser

      // Proceed only after accounts are loaded
      const matchingUser = findUser(userInfo.username);
      console.log("Matching user in handleSubmit:", matchingUser);  // Log matching user

      if (matchingUser) {
        const { username: storedEncryptedUsername, password: storedEncryptedPassword, ivPass, remembered, ivUser } = matchingUser;

        if (formTitle === "Log in") {
          const isValid = checkInfo(  // Validate username and password
            storedEncryptedUsername,
            storedEncryptedPassword,
            ivUser,
            ivPass,
            userInfo.username,
            userInfo.password
          );

          if (isValid) {
            setIsLoggedIn(true);
            sessionStorage.setItem("loggedIn", "true");

            if (remember !== remembered) {  // Update remembered status if needed
              matchingUser.remembered = remember;
              const updateRequest = store.put(matchingUser);
              updateRequest.onsuccess = () => updateSavedUsers();
              updateRequest.onerror = (event) => console.error("Error updating remembered status:", event);
            } else {
              updateSavedUsers();
            }

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
          ivPass: ivPass,
          remembered: remember,
          loggedIn: isLoggedIn,
          quiz: [],
          ivUser: ivUser,
        };

        store.put(newUser).onsuccess = () => {
          alert("Account created successfully!");
          setIsLoggedIn(true);
          sessionStorage.setItem("loggedIn", "true");
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
        const getRequest = store.getAll();

        getRequest.onsuccess = () => {
          const userAccount = findUser(userInfo.username);
          if (userAccount) 
            {
            if (userAccount.remembered) {
              removeFromDropdown(username);
            }
         
            const deleteRequest = store.delete(userAccount.username);  // Delete the account using its encrypted username

            deleteRequest.onsuccess = () => {
              handleLogout(); // Reset the login state
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
    
const updateSavedUsers = () => {
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
        const account = rememberedAccounts[0];

        if (account.password && account.iv && account.username && account.iv) {
          const decryptedPassword = decryptPassword(account.password, account.iv);
          const decryptedUsername = decryptUsername(account.username, account.iv);

          setUserInfo({
            username: decryptedUsername,
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
    setTimeout(() => {
      alert("Logging out...");
      sessionStorage.removeItem("loggedIn"); // Clear session storage flag
      clearForm(); 
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

  return (<div style={{ height: '100px', display: "flex", alignItems: "center", position:'relative' }}>
    <div style={{position:'absolute', zIndex: 5 }}>
      {isLoggedIn ? (
        <div style={{ gap: "10px" }}>
          <img
            src={detective} // default profile picture
            alt="detective profile"
            style={{ width: '80px', height: '80px', cursor: 'pointer' }}
            onClick={() => showForm("Create Account")}
            title={userInfo.username}
          />
          <div style={{ gap: "10px" }}>
            <Button
              style={{ borderRadius: "20px", backgroundColor: "salmon" }}
              onClick={handleLogout}
            >
              Log out
            </Button>
            <Button
              onClick={() => deleteAccount(userInfo.username)}
              style={{
                borderRadius: "20px",
                backgroundColor: "darkred"
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ }}>
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
    </div>
  
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
    {/* Fixed Career Quiz Link */}
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