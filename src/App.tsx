import React, { useState } from 'react';
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
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
  const [key, setKey] = useState<string>(keyData); // For API key input
  const [page, setPage] = useState<string>("Home"); // Visibility for accessing basic questions
  const [basicComplete, toggleBasic] = useState<boolean>(false)// To track basic question completion
  const [detailedComplete, toggleDetailed] = useState<boolean>(false) // To track detailed question completion
  const [savedCareer, setCareer] = useState<string>("");

  // Sets the local storage item to the API key the user inputted
  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload();
  }

  // Whenever there's a change it'll store the API key in a local state called key
  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }
  return (
    <Router>
          <>
          <HeaderComponent setPage={setPage} page={page} />
            <Routes>
              <Route path="/basic-questions" element={<BasicCareerComponent basicComplete={basicComplete} toggleBasic={toggleBasic} savedCareer = {savedCareer} setCareer = {setCareer}/>}/>
              <Route path="/detailed-questions" element={<DetailedCareerComponent detailedComplete={detailedComplete} toggleDetailed={toggleDetailed}/>}/>
              <Route path="/" element={<MainPage setPage={setPage} page={page} basicComplete={basicComplete} detailedComplete={detailedComplete}/>} />
            </Routes>
          </>
          <Form>
            <Form.Label>API Key:</Form.Label>
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
    </Router>
  );
}

export default App;
