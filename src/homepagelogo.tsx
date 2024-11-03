import React, { useState} from 'react';
import userProfile from './Images/user-profile.png';
import { LoginForm } from './LoginForm';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [userInfo, setInfo] = useState<{ username: string; password: string }>({ username: "", password: "" });
  const [remember, setRemember] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userID, setID] = useState<number>(1);

  const indexedDB = window.indexedDB;

  const request = indexedDB.open("UserDatabase", 1);

  request.onerror = function(event){
    console.error("Error occured accessing user database!");
    console.error(event);
  }

  request.onupgradeneeded = function()
  {
    const db = request.result;
    const store = db.createObjectStore("users", {keyPath: "id"});
    store.createIndex("username_and_password", ["username", "password"], {unique: false});
  }

  request.onsuccess = function()
  {
    const db = request.result;
    const transaction = db.transaction("users", 'readwrite');
    const store = transaction.objectStore("users");
    const makeUserIndex = store.index("username_and_password");
    if(isLoggedIn)
    {
      store.put({id: userID, username: userInfo.username, password: userInfo.password});
      const userQuery = makeUserIndex.get(userID);
      if(userQuery.onsuccess)
      {
        if(isFormOpen)
          {
            <LoginForm
              userInfo={userInfo}
              setInfo={setInfo}
              remember={remember}
              setRemember={setRemember}
              handleRemember={handleRemember}
              handleSubmit = {handleSubmit}
              updateStatus={updateStatus}
              closeForm={() => setIsFormOpen(false)}
              formTitle={(userQuery.result === "username" && userQuery.result === "password") ? "Log In" : "Create Account"}
               // Pass the title based on conditions
            />
          }
      }
      transaction.oncomplete = function()
      {
        setID(userID + 1); // set for next user
        db.close();
      }
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
  {
    event.preventDefault();
    setIsLoggedIn(true);
  }

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const updateStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleRemember = () => {
    setRemember((prevRemember) => !prevRemember);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div style={{position: "absolute", float: "left" }}>
          <h3>Signed in as: {userInfo.username}!</h3>
        </div>
      ) : (
        <div>
          {/* Show the user image only when not logged in */}
          <img
            src={userProfile}
            alt="User Profile"
            style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }}
            onClick={toggleForm}
          />
        </div>
      )}
      <a href="https://bleaky11.github.io/starter_helpi/" style={{ color: 'black' }}>
        <h1>The Career Quiz</h1>
      </a>
    </div>
  );
};


