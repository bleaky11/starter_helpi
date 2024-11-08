import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotifBell } from "./notification";
import magGlass from "./Images/magnifying-glass.jpg";
import detective from "./Images/Detective.png";

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
    <div className="App">
                  <div className='Header-footer'>
                <nav className="Centered">
                    <Link to="/">
                        <Button onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    <Link to="/basic-questions">
                        <Button onClick={() => setPage("Basic-Questions")}>Basic Questions</Button>
                    </Link>
                    <Link to="/detailed-questions">
                        <Button onClick={() => setPage("Detailed-Questions")}>Detailed Questions</Button>
                    </Link>
                    <NotifBell
          basicComplete={basicComplete}
          detailedComplete={detailedComplete}
        ></NotifBell>
                </nav>
            </div>
      <header className="App-header">
        
        <Container>
          <Col className="ResultBorder" >
              <div style={{ flex: 1 }}>
                <h2>Results Page</h2>
                <h6 className="Body-Heading" style={{fontSize: "16px" }}>
                  Results of the quiz will be displayed after completing basic and/or detailed question
                </h6>
              </div>
              <nav style={{ marginTop: "auto", textAlign: "center" }}>
                {!basicComplete && !detailedComplete ? (
                  <div>
                    <Button style={{background: "#c47937", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} disabled={true}>Results</Button>
                    <h6>Please complete a Quiz!</h6>
                  </div>
                ) : (
                  <Link
                    to="/results-page"
                    onClick={() => setPage("Results-Page")}
                  >
                    <Button style={{background: "#c47937", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}}>Results</Button>
                  </Link>
                )}
              </nav>
            </Col>
        </Container>
        <Container>
          <Row style={{width: "100%"}}>
            <Col
              className="Bordered"
              style={{ display: "flex", flexDirection: "column", width: "45%" }}
            >
              <div style={{ flex: 1 }}>
                <div><h2>Basic Career Assessment</h2></div>
                <h6>
                  You will be asked a series of multiple choice questions. If
                  you're looking for more in-depth questions and results, go to
                  the Detailed Career Page. Before you begin, make sure you're
                  in a comfortable environment and answer each question to your
                  best ability.
                </h6>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
              <img
                src={magGlass}
                alt="Magnifying Glass"
                style={{
                  margin: "0 auto",
                  paddingBottom: "30px",
                  width: "200px",
                  height: "230px",
                }}
              />
              </div>
              <nav style={{ marginTop: "auto", textAlign: "center" }}>
                <nav>
                  {/* Case 1: First visit (no progress saved, no API key entered) */}
                  {!localStorage.getItem("quizProgress") &&
                  !sessionStorage.getItem("isKeyEntered") ? (
                    <div>
                      <Button style={{background: "#c47937", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} disabled={true}>Basic Career Questions</Button>
                      <h6>Please enter an API Key</h6>
                    </div>
                  ) : /* Case 2: First visit, API key entered but no saved progress */
                  !localStorage.getItem("quizProgress") &&
                    sessionStorage.getItem("isKeyEntered") ? (
                    <Link
                      to="/basic-questions"
                      onClick={() => setPage("Basic-Questions")}
                    >
                      <Button style={{background: "#c47937", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}}>Basic Questions</Button>
                    </Link>
                  ) : /* Case 3: Returning visit with saved progress but no API key entered */
                  localStorage.getItem("quizProgress") &&
                    !sessionStorage.getItem("isKeyEntered") ? (
                    <div>
                      <Button style={{background: "#c47937", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} disabled={true}>
                        Basic Questions (Last Save)
                      </Button>
                      <h6>Please enter an API Key</h6>
                    </div>
                  ) : /* Case 4: Returning visit with saved progress and API key entered */
                  localStorage.getItem("quizProgress") &&
                    sessionStorage.getItem("isKeyEntered") ? (
                    <Link
                      to="/basic-questions"
                      onClick={() => setPage("Basic-Questions")}
                    >
                      <Button style={{background: "#c47937", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}}>Basic Questions (Last Save)</Button>
                    </Link>
                  ) : null}
                </nav>
              </nav>
            </Col>
            <Col
              className="Bordered"
              style={{ display: "flex", flexDirection: "column", width: "45%" }}
            >
              <div style={{ flex: 1 }}>
                <h2>Detailed Career Assessment</h2>
                <h6 className="Body-Heading" style={{fontSize: "16px" }}>
                  You will be asked a series of elaborate questions that may
                  require some additional thought to answer. Your results will
                  be more accurate and personable than your basic assessment results.
                  Before you begin, make sure you're in a comfortable
                  environment and answer each question to your best ability.
                </h6>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={detective}
                  alt="Detective"
                  style={{
                    margin: "0 auto",
                    paddingBottom: "30px",
                    width: "200px",
                    height: "230px",
                    marginRight: "10px",
                  }}
                />
                <img
                  src={detective}
                  alt="Detective"
                  style={{
                    margin: "0 auto",
                    paddingBottom: "30px",
                    width: "200px",
                    height: "230px",
                    marginRight: "40px",
                  }}
                />
              </div>
              <nav style={{ marginTop: "auto", textAlign: "center" }}>
                {!isKeyEntered ? (
                  <div>
                    <Button style={{background: "#c47937", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} disabled={true}>Detailed Questions</Button>
                    <h6>Please enter an API Key</h6>
                  </div>
                ) : (
                  <Link
                    to="/detailed-questions"
                    onClick={() => setPage("Detailed-Questions")}
                  >
                    <Button style={{background: "#c47937", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}}>Detailed Questions</Button>
                  </Link>
                )}
              </nav>
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  );
}
