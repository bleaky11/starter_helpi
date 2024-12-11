import React from 'react';
import { Link } from 'react-router-dom';
import quizInterface from "./Images/quizInterface.png";
import { Container, Col, Button, Row } from 'react-bootstrap';
import { NotifBell } from './notification';
import { Database } from "./db";
import { Account } from './homepagelogo';

interface QuizInterfaceProps {
    loggedUser: Account | null;
    page: string;
    setPage: (page: string) => void;
    basicComplete: boolean;
    detailedComplete: boolean;
    isKeyEntered: boolean;
  }

export function QuizInterface({loggedUser, db, setDb, basicComplete, detailedComplete, setPage, isKeyEntered}: QuizInterfaceProps & Database): JSX.Element {
    return (
        <header className='App-header'>
            <div style={{marginTop: '12vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative', zIndex: 10}}>
                <NotifBell 
                db={db}
                setDb={setDb}
                loggedUser={loggedUser}
                basicComplete={basicComplete}
                detailedComplete={detailedComplete}
                ></NotifBell>
                <Container>
                <Row style={{ display:'flex', flexWrap:'wrap', maxWidth:'100%' }}>
                    <Col
                    className="Bordered"
                    style={{ display: "flex", flexDirection: "column", maxWidth:'100%' }}
                    >
                    <div style={{ flex: 1 }}>
                        <h6 style={{marginTop: 'auto', fontSize: '20px', color: '#D7DCF4', textShadow: '15px 15px 18px black', textAlign: 'center'}}>
                        Our suspect has left clues all over the crime scene. It is your duty to find and analyze these clues so we can build our case.
                        We have our suspicions, but it is up to you to gather the evidence.  
                        Are you ready, Detective?
                        </h6>
                    </div>
                    <nav style={{ marginTop: "auto", textAlign: "center"}}>
                        <nav>
                        {
                        !sessionStorage.getItem("isKeyEntered") ? (
                            <div style = {{pointerEvents: "none"}}>
                            <Button style={{background: "#c47937", border: "3px", borderColor: "#bc6c25", borderStyle: "solid", pointerEvents: "auto", cursor: "not-allowed"}} disabled={true}>Collect Evidence</Button>
                            <h6 style={{color: "white", textShadow: '15px 15px 18px black'}}>Please enter an API Key</h6>
                            </div>
                        ) :
                        (
                            <Link
                            to="/basic-questions"
                            onClick={() => setPage("Basic-Questions")}
                            >
                            <Button style = {{pointerEvents: "auto"}} className="Button">Collect Evidence</Button>
                            </Link>
                        )}
                        </nav>
                    </nav>
                    </Col>
                    <Col
                    className="Bordered"
                    style={{ display: "flex", flexDirection: "column" }}
                    >
                    {loggedUser ?
                        loggedUser.basicComplete ?
                        <div><h6 style={{marginTop: 'auto', fontSize: '20px', color: '#D7DCF4', textShadow: '15px 15px 18px black', textAlign: 'center'}}>
                            Great work, detective, we're getting closer. We've just gathered our leading witnesses,
                            now we need you to go in there and question them in order to find out what they know. Report back ASAP.
                        </h6></div> : <div><h6 style={{marginTop: 'auto', fontSize: '20px', color: '#D7DCF4', textShadow: '15px 15px 18px black', textAlign: 'center', opacity: "30%"}}>
                            Great work, detective, we're getting closer. We've just gathered our leading witnesses,
                            now we need you to go in there and question them in order to find out what they know. Report back ASAP.
                        </h6></div>
                    :
                        basicComplete ? <div><h6 style={{marginTop: 'auto', fontSize: '20px', color: '#D7DCF4', textShadow: '15px 15px 18px black', textAlign: 'center'}}>
                        Great work, detective, we're getting closer. We've just gathered our leading witnesses,
                        now we need you to go in there and question them in order to find out what they know. Report back ASAP.
                        </h6></div> : <div><h6 style={{marginTop: 'auto', fontSize: '20px', color: '#D7DCF4', textShadow: '15px 15px 18px black', textAlign: 'center', opacity: "30%"}}>
                        Great work, detective, we're getting closer. We've just gathered our leading witnesses,
                        now we need you to go in there and question them in order to find out what they know. Report back ASAP.
                        </h6></div>
                    }
                    <nav style={{ marginTop: "auto", textAlign: "center" }}>
                    {!isKeyEntered ? (
                        <div style = {{pointerEvents: "none"}}>
                            <Button
                                style={{
                                    background: "#c47937",
                                    border: "3px solid #bc6c25",
                                    borderStyle: "solid",
                                    pointerEvents: "auto",
                                    cursor: "not-allowed"
                                }}
                                disabled={true}
                            >
                                Question Witnesses
                            </Button>
                            <h6
                                style={{
                                    color: "white",
                                    textShadow: "15px 15px 18px black",
                                }}
                            >
                                Please enter an API Key
                            </h6>
                        </div>
                    ) : loggedUser ? (
                        loggedUser.basicComplete ? (
                            <Link
                                to="/detailed-questions"
                                onClick={() => setPage("Detailed-Questions")}
                            >
                                <Button className="Button">Question Witnesses</Button>
                            </Link>
                        ) : (
                            <div>
                                <Button
                                    style={{
                                        background: "#c47937",
                                        border: "3px solid #bc6c25",
                                        borderStyle: "solid",
                                        pointerEvents: "auto",
                                        cursor: "not-allowed"
                                    }}
                                    disabled={true}
                                >
                                    Question Witnesses
                                </Button>
                                <h6
                                    style={{
                                        color: "white",
                                        textShadow: "15px 15px 18px black",
                                        pointerEvents: "none"
                                    }}
                                >
                                    Go Collect Some Evidence, Detective!
                                </h6>
                            </div>
                        )
                    ) : basicComplete ? (
                        <Link
                            to="/detailed-questions"
                            onClick={() => setPage("Detailed-Questions")}
                        >
                            <Button className="Button">Question Witnesses</Button>
                        </Link>
                    ) : (
                        <div style = {{pointerEvents: "none"}}>
                            <Button
                                style={{
                                    background: "#c47937",
                                    border: "3px solid #bc6c25",
                                    borderStyle: "solid",
                                    pointerEvents: "auto",
                                    cursor: "not-allowed"
                                }}
                                disabled={true}
                            >
                                Question Witnesses
                            </Button>
                            <h6
                                style={{
                                    color: "white",
                                    textShadow: "15px 15px 18px black",
                                }}
                            >
                                Go Collect Some Evidence, Detective!
                            </h6>
                        </div>
                    )}
                </nav>
                </Col>
                </Row>
                </Container>
            </div>
            <img className='home-background' src={quizInterface} alt='Quiz Interface' style={{position: 'absolute', zIndex: 0}} />
        </header>
    );
}
