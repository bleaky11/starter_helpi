import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import { HomePage } from './homepagelogo';
import { BasicCareerComponent } from './basicCareer';

// Local storage and API Key
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData);
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

function App() {
  const [key, setKey] = useState<string>(keyData); // For API key input
  const [page, setPage] = useState<string>(""); // Visibility for accessing basic questions

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
            <nav>
              <Link to="/basic-questions" onClick={() => setPage("Basic-Questions")}>
                <Button>Basic Questions</Button>
              </Link>
              <Link to="/detailed-questions" onClick={() => setPage("Detailed-Questions")}>
                <Button>Detailed Questions</Button>
              </Link>
            </nav>
            <Routes>
              <Route path="/basic-questions" element={<BasicCareerComponent/>}/>
              <Route path="/detailed-questions" element={<div>Detailed Questions</div>} />
            </Routes>
          </>
          <div className="App">
            <header className="App-header">
              <HomePage />
              <img src={logo} className="App-logo" alt="logo" />
              <p>Edit <code>src/App.tsx</code> and save to reload.</p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React | Ryan Burtson | Levi Chen | Thomas Florio | Tolu AKin
              </a>
            </header>
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
          </div>
        )
    </Router>
  );
}

export default App;
