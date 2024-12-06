import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotifBell } from "./notification";
import magGlass from "./Images/magnifying-glass.jpg";
import detective from "./Images/Detective.png";
import { HomeBackground } from "./homeBackground";

interface HomeComponentProps {
  page: string;
  setPage: (page: string) => void;
  basicComplete: boolean;
  detailedComplete: boolean;
  isKeyEntered: boolean;
  apiKey: string;
}

export function MainPage({
  setPage,
  page,
  basicComplete,
  detailedComplete,
  isKeyEntered,
  apiKey,
}: HomeComponentProps): JSX.Element {
  return (
    <div>
      <header className="App-header"> 
        <HomeBackground setPage={setPage} page={page}/>
      </header>
    </div>
  );
}