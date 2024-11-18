import React, { useState, useEffect } from 'react';
import userProfile from './Images/user-profile.png';
import detective from './Images/detective-profile.png';
import { LoginForm } from './LoginForm';
import { Button} from 'react-bootstrap';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", password: "", remembered: false});
  const [remember, setRemember] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formTitle, setFormTitle] = useState("Create Account");
  const [db, setDb] = useState<IDBDatabase | null>(null); // stores the indexedDB database instance
  const [accounts, setAccounts] = useState<{ username: string; password: string, remembered: boolean, ivUser: string, ivPass: string }[]>([]);
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
            const defaultAccount = { username: "Select a saved user", password: "", remember: true, ivUser: "", ivPass: "" };
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
  }, [isLoggedIn]);

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

const findUser = () => { // Find the matching account by decrypting usernames
  return accounts.find((account) => {
    try {
      const decryptedUsername = decryptUsername(account.username, account.ivUser);
      return decryptedUsername === userInfo.username;
    } catch (error) {
      console.error("Decryption failed for account:", account, error);
      return false; // Skip this account
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

  const usernameToUpdate = findUser()?.username;

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
  setCalled(event.target.value);
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
      const matchingUser = findUser();

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
            if (remember !== remembered) {  // Update remembered status if needed
              matchingUser.remembered = remember;
              const updateRequest = store.put(matchingUser);
              updateRequest.onsuccess = () => updateSavedUsers();
              updateRequest.onerror = (event) =>
                console.error("Error updating remembered status:", event);
            } else {
              updateSavedUsers();
            }

            if (!remember) {   // Remove from dropdown if "Remember me" is not checked
              removeFromDropdown(userInfo.username);
            }
          } else {
            alert("Incorrect username or password.");
          }
        } else {
          alert("Account already exists. Please log in.");
          clearForm();
        }
      }
      else if (formTitle === "Create Account") 
      {
        const { encryptedPassword, ivPass } = encryptPassword(userInfo.password);
        const { encryptedUsername, ivUser } = encryptUsername(userInfo.username);

        const newUser = { // store used with encrypted username and password for security
          username: encryptedUsername,
          password: encryptedPassword,
          ivPass: ivPass,
          remembered: remember,
          ivUser: ivUser,
        };

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

        getRequest.onsuccess = async () => {
          const userAccount = findUser();
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
      if (!allAccounts || allAccounts.length === 0) { // Ensure that request.result is not empty
        return;
      }

      setAccounts(allAccounts); // Set all users for general access

      const rememberedAccounts = allAccounts.filter(account => account.remembered);

      if (rememberedAccounts.length > 0) { // Check if there are any remembered accounts and if data is valid
        const account = rememberedAccounts[0];  
        
        if (account.password && account.iv && account.username && account.iv) {  // Check if account properties exist before decrypting
          const decryptedPassword = decryptPassword(account.password, account.iv);
          const decryptedUsername = decryptUsername(account.username, account.iv);

          setUserInfo({
            username: decryptedUsername,
            password: decryptedPassword,
            remembered: account.remembered,
          });
          setSelect(account.username);  // Update the dropdown to show the remembered username
        } 
      } else {
        // If no remembered accounts, reset user info
        setUserInfo({
          username: userInfo.username,
          password: userInfo.password,
          remembered: false,
        });
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

  return (<div style={{ height: '100px', display: "flex", justifyContent: "flex-start", alignItems: "center", position: 'relative'}}>
    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
      {isLoggedIn ? (
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
          <img
            src={detective} // default profile picture
            alt="detective profile"
            style={{ width: '80px', height: '80px', cursor: 'pointer' }}
            onClick={() => showForm("Create Account")}
            title={userInfo.username}
          />
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
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
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
          <img
            src={userProfile}
            alt="User Profile"
            style={{ width: '50px', height: '55px', cursor: 'pointer' }}
            onClick={() => showForm("Create Account")}
            title="Guest" // default visitor status
          />
          <Button
            style={{ borderRadius: "20px", height: "40px", backgroundColor: "darkblue" }}
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
    <div style={{ position: 'absolute', left: '595px', top: '50%', transform: 'translateY(-50%)' }}>
      <a
        href="https://bleaky11.github.io/starter_helpi/"
        style={{ color: 'black', fontSize: '40px', textDecoration: 'none' }}
      >
        The Career Codebreaker
      </a>
    </div>
  </div>
)}  