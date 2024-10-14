import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Form } from 'react-bootstrap';
import { HomePage } from './homepagelogo';
import { BasicCareerComponent } from './basicCareer';
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import { buttonStyle } from './CSS/Button';

//local storage and API Key: key should be entered in by the user and will be stored in local storage (NOT session storage)
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData); //so it'll look like: MYKEY: <api_key_value here> in the local storage when you inspect
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

interface pageProps
{
    setPage: (newPage: string) => void
    page: string
}
  
function SwitchPage({setPage, page}: pageProps): JSX.Element 
{
  return (
      <div>
          <a href='src\basicCareer.tsx' style={buttonStyle}>Hi</a>
          <Button className = "me-2" onClick={() => setPage("Home")}>Home</Button>
          <Button className = "me-2" onClick={() => setPage("Basic Questions")}>Basic Questions</Button>
          <Button className = "me-2" onClick={() => setPage("Detailed Questions")}>Detailed Questions</Button>
      </div>
  );
}

function App() {
  const [key, setKey] = useState<string>(keyData); //for api key input
  const [page, setPage] = useState<string>("Home"); // visibilty for accessing basic questions

  //sets the local storage item to the api key the user inputed
  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload(); //when making a mistake and changing the key again, I found that I have to reload the whole site before openai refreshes what it has stores for the local storage variable
  }

  //whenever there's a change it'll store the api key in a local state called key but it won't be set in the local storage until the user clicks the submit button
  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }
  return (
    <div>
      <SwitchPage setPage = {setPage} page = {page}></SwitchPage>
            {page === "Basic Questions" ? <BasicCareerComponent></BasicCareerComponent>:
            null}
      {page === "Home" ?
      <div className="App">
      <header className="App-header">
        <HomePage />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
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
        ></Form.Control>
        <br />
        <Button className="Submit-Button" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </div>: null}
  </div>
  )}

export default App;
