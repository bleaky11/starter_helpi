import React, { useState } from 'react';
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import { BasicCareerComponent } from './basicCareer';
import { DetailedCareerComponent } from './detailedCareer';
import { HeaderComponent } from './header';
import { MainPage } from './home';

// Local storage and API Key
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData);
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

function App() {
  const [key, setKey] = useState<string>(keyData);
  const [page, setPage] = useState<string>("Home");
  const [basicComplete, toggleBasic] = useState<boolean>(false);
  const [detailedComplete, toggleDetailed] = useState<boolean>(false);
  const [isKeyEntered] = useState<boolean>(JSON.parse(sessionStorage.getItem('isKeyEntered') || 'false'));

  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    sessionStorage.setItem('isKeyEntered', JSON.stringify(key.length > 0));
    window.location.reload();
  }

  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }

  return (
    <Router>
      <MainContent
        setPage={setPage}
        basicComplete={basicComplete}
        toggleBasic={toggleBasic}
        detailedComplete={detailedComplete}
        toggleDetailed={toggleDetailed}
        isKeyEntered={isKeyEntered}
      />
      {page === "Home" && (
        <Form className='Header-footer'>
          <Form.Label style={{ color: "white" }}>API Key:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Insert API Key Here"
            onChange={changeKey}
          />
          <br />
          <Button className="Submit-Button" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      )}
    </Router>
  );
}

// Define an interface for the props
interface MainContentProps {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  basicComplete: boolean;
  toggleBasic: React.Dispatch<React.SetStateAction<boolean>>;
  detailedComplete: boolean;
  toggleDetailed: React.Dispatch<React.SetStateAction<boolean>>;
  isKeyEntered: boolean;
}

function MainContent({ setPage, basicComplete, toggleBasic, detailedComplete, toggleDetailed, isKeyEntered }: MainContentProps) {
  const location = useLocation();
  const currentPage = location.pathname === "/" ? "Home" : (location.pathname === "/basic-questions" ? "Basic-Questions" : "Detailed-Questions");

  return (
    <>
      <HeaderComponent setPage={setPage} page={currentPage} />
      <Routes>
        <Route path="/basic-questions" element={<BasicCareerComponent basicComplete={basicComplete} toggleBasic={toggleBasic} />} />
        <Route path="/detailed-questions" element={<DetailedCareerComponent detailedComplete={detailedComplete} toggleDetailed={toggleDetailed} />} />
        <Route path="/" element={<MainPage setPage={setPage} page={currentPage} basicComplete={basicComplete} detailedComplete={detailedComplete} isKeyEntered={isKeyEntered} />} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/*Navigate to homepage if route is unrecognized*/}
      </Routes>
    </>
  );
}

export default App;
