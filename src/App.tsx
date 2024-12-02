import React, { useState } from 'react';
import './App.css';
import {HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import { BasicCareerComponent } from './basicCareer';
import { DetailedCareerComponent } from './detailedCareer';
import { HeaderComponent } from './header';
import { MainPage } from './home';
import { ResultPage } from './resultPage';
import { Account } from './homepagelogo';

// Local storage and API Key
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData);
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

function App() {
  const [key, setKey] = useState<string>(keyData); // For API key input
  const [page, setPage] = useState<string>("Home"); // Visibility for accessing basic questions
  const [db, setDb] = useState<IDBDatabase | null>(null); // stores the indexedDB database instance
  const [loggedUser, setLoggedUser] = useState<Account | null>(null);
  const [basicComplete, toggleBasic] = useState<boolean>(false)// To track basic question completion
  const [detailedComplete, toggleDetailed] = useState<boolean>(false) // To track detailed question completion
  const [savedBasicCareer, setBasicCareer] = useState<string>(""); //To track saved quiz data
  const [savedDetailedCareer, setDetailedCareer] = useState<string>("");
  const [isKeyEntered] = useState<boolean>(JSON.parse(sessionStorage.getItem('isKeyEntered') || 'false')); // To track if user has entered an API Key
  const [question, setQuestion] = useState<string>('');
  const [answerVals, setAnswerVals] = useState<{answer: string, tag: string}[]>([]); // To track user's quiz responses

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
        answerVals={answerVals}
        setAnswerVals={setAnswerVals}
        apiKey={key}
        setPage={setPage}
        db = {db}
        setDb = {setDb}
        basicComplete={basicComplete}
        toggleBasic={toggleBasic}
        detailedComplete={detailedComplete}
        toggleDetailed={toggleDetailed}
        isKeyEntered={isKeyEntered}
        setBasicCareer={setBasicCareer}
        savedBasicCareer={savedBasicCareer}
        setDetailedCareer={setDetailedCareer}
        savedDetailedCareer={savedDetailedCareer}
        question={question}
        setQuestion={setQuestion}
        loggedUser={loggedUser}
        setLoggedUser = {setLoggedUser}
      />
      {page === "Home" && (
        <div className='Header-footer' style={{paddingLeft:"20%",paddingRight:"20%"}}>
        <Form>
          <Form.Label style={{ color: "white"}}>API Key:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Insert API Key Here"
            onChange={changeKey}
          />
          <br />
          <Button className="Button" onClick={handleSubmit}>
            Submit
          </Button>
        </Form></div>
      )}
    </Router>
  );
}

// Define an interface for the props
interface MainContentProps {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  db: IDBDatabase | null;
  setDb: React.Dispatch<React.SetStateAction<IDBDatabase | null>>; 
  basicComplete: boolean;
  toggleBasic: React.Dispatch<React.SetStateAction<boolean>>;
  detailedComplete: boolean;
  toggleDetailed: React.Dispatch<React.SetStateAction<boolean>>;
  isKeyEntered: boolean;
  savedBasicCareer: string;
  setBasicCareer: React.Dispatch<React.SetStateAction<string>>;
  savedDetailedCareer: string;
  setDetailedCareer: React.Dispatch<React.SetStateAction<string>>;
  apiKey:string;
  question:string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  answerVals: {answer: string, tag:string}[];
  setAnswerVals: React.Dispatch<React.SetStateAction<{answer:string, tag: string}[]>>;
  loggedUser: Account | null;
  setLoggedUser: React.Dispatch<React.SetStateAction<Account|null>>;
}

function MainContent({ setPage, db, setDb, basicComplete, toggleBasic, detailedComplete, toggleDetailed, isKeyEntered,
   savedBasicCareer, setBasicCareer, savedDetailedCareer, setDetailedCareer, apiKey, answerVals, setAnswerVals, loggedUser, setLoggedUser}: MainContentProps) {
  const location = useLocation();
  const currentPage = location.pathname === "/" ? "Home" : (location.pathname === "/basic-questions" ? "Basic-Questions" : (location.pathname === "/detailed-questions" ? "Detailed-Questions": "Results-Page"));

  return (
    <>
      <HeaderComponent db = {db} setDb = {setDb} setPage={setPage} loggedUser = {loggedUser} setLoggedUser = {setLoggedUser} page={currentPage} />
      <Routes>
        <Route path="/basic-questions" element={<BasicCareerComponent db = {db} setDb = {setDb} basicComplete={basicComplete} toggleBasic={toggleBasic} savedBasicCareer= {savedBasicCareer} setBasicCareer={setBasicCareer} answers={answerVals} setAnswerVals={setAnswerVals}
        loggedUser = {loggedUser} setPage={setPage}/>} />
        <Route path="/detailed-questions" element={<DetailedCareerComponent detailedComplete={detailedComplete} toggleDetailed={toggleDetailed}/>}/>
        <Route path="/results-page" element={<ResultPage basicComplete={basicComplete} detailedComplete={detailedComplete} apiKey={apiKey} answerVals={answerVals}></ResultPage>} />
        <Route path="/" element={<MainPage setPage={setPage} page={currentPage} db = {db} setDb = {setDb} basicComplete={basicComplete} detailedComplete={detailedComplete} isKeyEntered={isKeyEntered} apiKey={apiKey} loggedUser={loggedUser}/>} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/*Navigate to homepage if route is unrecognized*/}
      </Routes>
    </>
  );
}

export default App;
