import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { borderedStyle } from "./CSS/Border";
import { headingStyle } from "./CSS/Heading";
import { HomePage } from "./homepagelogo";
import logo from "./logo.svg"
import { NotifBell } from "./notification";

interface HomeComponentProps {
    page: string
    setPage: (page: string) => void;
}


export function MainPage({setPage, page}: HomeComponentProps): JSX.Element {
    return(
        <div className="App">
          <header className="App-header">
            <NotifBell/>
            <HomePage />
            <img src={logo} className="App-logo" alt="logo" />
            <Container>
              <Row>
                <Col style={borderedStyle}>
                  <h2>Basic Career Assessment</h2>
                  <h6 style={headingStyle}>You will be asked a series of multiple choice questions. If you're
                  looking for more in-depth questions and results, go to the Detailed Career Page. Before you begin, make sure you're in a comfortable environment and
                  answer each question to your best ability.</h6>
                  <nav>
                    <Link to="/basic-questions" onClick={() => setPage("Basic-Questions")}>
                      < Button>Basic Questions</Button>
                    </Link>
                  </nav>
                </Col>
                <Col style={borderedStyle}>
                  <h2>Detailed Career Assessment</h2>
                  <h6 style={headingStyle}>You will be asked a series of elaborate questions that may require some
                  additional thought to answer. Your results will be more accurate and personable than the basic assessment. Before you begin, make sure you're in a comfortable environment and
                  answer each question to your best ability.</h6>
                  <nav>
                    <Link to="/detailed-questions" onClick={() => setPage("Detailed-Questions")}>
                      < Button>Detailed Questions</Button>
                    </Link>
                  </nav>
                </Col>
              </Row>
            </Container>
          </header>
        </div>
    )
}