import React, { useState } from 'react';
import userProfile from './Images/user-profile.png';
import { LoginForm } from './LoginForm';

export const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div>
      <img
        src={userProfile}
        alt="User Profile"
        style={{ float: "left", width: '50px', height: '55px', cursor: 'pointer' }}
        onClick={toggleForm}
      />
      <a href="https://bleaky11.github.io/starter_helpi/" style={{ color: 'black' }}>
        <h1>The Career Quiz</h1>
      </a>
      {isFormOpen && <LoginForm closeForm={() => setIsFormOpen(false)} />}
    </div>
  );
};

