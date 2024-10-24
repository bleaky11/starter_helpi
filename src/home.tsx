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
}

export function MainPage({
  setPage,
  page,
  basicComplete,
  detailedComplete,
  isKeyEntered,
}: HomeComponentProps): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <NotifBell
          basicComplete={basicComplete}
          detailedComplete={detailedComplete}
        ></NotifBell>
        <Container>
          <Row>
            <Col
              className="Bordered"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ flex: 1 }}>
                <h2>Basic Career Assessment</h2>
                <h6 className="Body-Heading" style={{fontSize: "16px" }}>
                  You will be asked a series of multiple choice questions. If
                  you're looking for more in-depth questions and results, go to
                  the Detailed Career Page. Before you begin, make sure you're
                  in a comfortable environment and answer each question to your
                  best ability.
                </h6>
              </div>
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
              <nav style={{ marginTop: "auto", textAlign: "center" }}>
                <nav>
                  {/* Case 1: First visit (no progress saved, no API key entered) */}
                  {!localStorage.getItem("quizProgress") &&
                  !sessionStorage.getItem("isKeyEntered") ? (
                    <div>
                      <Button disabled={true}>Basic Questions</Button>
                      <h6>Please enter an API Key</h6>
                    </div>
                  ) : /* Case 2: First visit, API key entered but no saved progress */
                  !localStorage.getItem("quizProgress") &&
                    sessionStorage.getItem("isKeyEntered") ? (
                    <Link
                      to="/basic-questions"
                      onClick={() => setPage("Basic-Questions")}
                    >
                      <Button>Basic Questions</Button>
                    </Link>
                  ) : /* Case 3: Returning visit with saved progress but no API key entered */
                  localStorage.getItem("quizProgress") &&
                    !sessionStorage.getItem("isKeyEntered") ? (
                    <div>
                      <Button disabled={true}>
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
                      <Button>Basic Questions (Last Save)</Button>
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
                  marginBottom: "30px",
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
                    <Button disabled={true}>Detailed Questions</Button>
                    <h6>Please enter An API Key</h6>
                  </div>
                ) : (
                  <Link
                    to="/detailed-questions"
                    onClick={() => setPage("Detailed-Questions")}
                  >
                    <Button>Detailed Questions</Button>
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
