import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotifBell } from "./notification";
import { Database } from "./db";
import { BasicProps } from "./notification";
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
  db,
  setDb,
  loggedUser
}: HomeComponentProps & Database & BasicProps): JSX.Element {
  return (
    <div className="App">
      <header className="App-header"> 
        <NotifBell
          basicComplete={basicComplete}
          detailedComplete={detailedComplete}
          db = {db}
          setDb = {setDb}
          loggedUser={loggedUser}
        ></NotifBell>

        <Container>
          <Col className="ResultBorder" >
              <div style={{ flex: 2 }}>
                <h2>Results Page</h2>
                <h6 className="Body-Heading" style={{fontSize: "16px" }}>
                  Results of the quiz will be displayed after completing basic and/or detailed question
                </h6>
              </div>
              <nav style={{ marginTop: "auto", textAlign: "center" }}>
              {!loggedUser ? ( // User is not logged in
              !basicComplete && !detailedComplete ? (
                <div>
                  <Button className="Button" disabled={true}>
                    Results
                  </Button>
                  <h6>Please complete a Quiz!</h6>
                </div>
              ) : (
                <Link to="/results-page" onClick={() => setPage("Results-Page")}>
                  <Button className="flashy-button">Results</Button>
                </Link>
              )
            ) : ( // User is logged in
                  !loggedUser.basicComplete && !loggedUser.detailedComplete ? (
                    <div>
                      <Button className="Button" disabled={true}>
                        Results
                      </Button>
                      <h6>Please complete a Quiz!</h6>
                    </div>
                  ) : (
                    <Link to="/results-page" onClick={() => setPage("Results-Page")}>
                      <Button className="flashy-button">Results</Button>
                    </Link>
                  )
                )}
            </nav>
            </Col>
            
        </Container>
        <Container>
          <Row>
            <Col
              className="Bordered"
              style={{ display: "flex", flexDirection: "column" }}
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
                      <Button className="Button">Basic Questions</Button>
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
                      <Button className="Button">Basic Questions (Last Save)</Button>
                    </Link>
                  ) : null}
                </nav>
              </nav>
            </Col>
            <Col
              className="Bordered"
              style={{ display: "flex", flexDirection: "column" }}
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
                    <Button className="Button">Detailed Questions</Button>
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