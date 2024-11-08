import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HomePage } from "./homepagelogo";

interface HeaderComponentProps {
    page: string
    setPage: (page: string) => void;
}

export function HeaderComponent({setPage, page}: HeaderComponentProps): JSX.Element | null { //Function to handle setting the header buttons
    if(page === "Basic-Questions"){ //If on basic questions page, display home and detailed questions button
        return(
            <div className='Header-footer'>
                <nav className="Centered">
                    <Link to="/">
                        <Button style={{background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    <Link to="/detailed-questions">
                        <Button style={{background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} onClick={() => setPage("Detailed-Questions")}>Detailed Questions</Button>
                    </Link>
                </nav>
            </div>
        )
    }
    else if(page === "Detailed-Questions"){//If on detailed questions page, display home and basic questions button
        return(
            <div className="Header-footer">
                <nav className="Centered">
                    <Link to="/">
                        <Button style={{background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    <Link to="/basic-questions">
                        <Button style={{background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} onClick={() => setPage("Basic-Questions")}>Basic Questions</Button>
                    </Link>
                </nav>
            </div>
        )
    }
    else if(page === "Results-Page"){//If on results page, display basic, home, and detailed questions button
        return(
            <div className="Header-footer">
                <nav className="Centered">
                    <Link to="/basic-questions">
                        <Button style={{background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} onClick={() => setPage("Basic-Questions")}>Basic Questions</Button>
                    </Link>
                    <Link to="/">
                        <Button style={{background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    <Link to="/detailed-questions">
                        <Button style={{background: "#DDA15E", border: "3px", borderColor: "#bc6c25", borderStyle: "solid"}} onClick={() => setPage("Detailed-Questions")}>Detailed Questions</Button>
                    </Link>
                </nav>
            </div>
        )
    }
    else{//If on homepage, display homepage component
        return(
        <div className='Header-footer' style={{textAlign: "center"}}>
            <HomePage />
        </div>
        )
    }
}