import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { borderedStyle } from "./CSS/Border";
import { headingStyle } from "./CSS/Heading";
import { HomePage } from "./homepagelogo";
import { NotifBell } from "./notification";
import magGlass from "./Images/magnifying-glass.jpg";
import detective from "./Images/Detective.png";

interface HomeComponentProps {
    page: string;
    setPage: (page: string) => void;
    basicComplete: boolean;
    detailedComplete: boolean;
    count: number;  // Add count here directly
    isKeyEntered: boolean
}

export function MainPage({setPage, page, basicComplete, detailedComplete, count, isKeyEntered}: HomeComponentProps): JSX.Element {
    return(
        <div className="App">
          <header className="App-header">
            <NotifBell basicComplete={basicComplete} detailedComplete={detailedComplete}></NotifBell>
            <HomePage />
            <Container>
              <Row>
                <Col style={{...borderedStyle, display: "flex", flexDirection: "column"}}>
                <div style={{flex: 1}} >
                  <h2>Basic Career Assessment</h2>
                  <h6 style={{...headingStyle, fontSize: "16px"}}>You will be asked a series of multiple choice questions. If you're
                  looking for more in-depth questions and results, go to the Detailed Career Page. Before you begin, make sure you're in a comfortable environment and
                  answer each question to your best ability.</h6>
                  </div>
                  <img src={magGlass} alt="Magnifying Glass" style={{margin: "0 auto", paddingBottom: "30px", width: "200px", height: "230px"}}/>
                  <nav style={{ marginTop: "auto", textAlign: "center" }}>
  {count === 0 ? (
    !isKeyEntered ? (
      <div>
        <Button disabled={true}>Basic Questions</Button>
        <h6>Please enter an API Key</h6>
      </div>
    ) : (
      <Link to="/basic-questions" onClick={() => setPage("Basic-Questions")}>
        <Button>Basic Questions</Button>
      </Link>
    )
  ) : count > 0 ? (
    !isKeyEntered ? (
      <div>
        <Button disabled={true}>Basic Questions</Button>
        <h6>Please enter an API Key</h6>
      </div>
    ) : (
      <Link to="/basic-questions" onClick={() => setPage("Basic-Questions")}>
        <Button>Basic Questions (Last Save)</Button>
      </Link>
    )
  ) : null}
</nav>

                </Col>
                <Col style={{...borderedStyle, display: "flex", flexDirection: "column"}}>
                <div style={{flex: 1}} >
                  <h2>Detailed Career Assessment</h2>
                  <h6 style={{...headingStyle, fontSize: "16px"}}>You will be asked a series of elaborate questions that may require some
                  additional thought to answer. Your results will be more accurate and personable than the basic assessment. Before you begin, make sure you're in a comfortable environment and
                  answer each question to your best ability.</h6>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                  <img src={detective} alt="Detective" style={{margin: "0 auto", paddingBottom: "30px", width: "200px", height: "230px", marginRight: "10px" }}/>
                  <img src={detective} alt="Detective" style={{margin: "0 auto", paddingBottom: "30px", width: "200px", height: "230px", marginRight: "40px" }}/>
                  </div>
                  <nav style={{marginTop: "auto", textAlign: "center"}}>
                  {!isKeyEntered ? <div><Button disabled={true}>Detailed Questions</Button><h6>Please enter An API Key</h6></div> : <Link to="/detailed-questions" onClick={() => setPage("Detailed-Questions")}>
                      < Button>Detailed Questions</Button>
                    </Link>}
                  </nav>
                </Col>
              </Row>
            </Container>
          </header>
        </div>
    );
}
