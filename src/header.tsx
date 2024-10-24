import { Button } from "react-bootstrap";
import { centerStyle } from "./CSS/Center";
import { Link } from "react-router-dom";
import { HomePage } from "./homepagelogo";

interface HeaderComponentProps {
    page: string
    setPage: (page: string) => void;
}

export function HeaderComponent({setPage, page}: HeaderComponentProps): JSX.Element | null {
    if(page === "Basic-Questions"){
        return(
            <div className='Header-footer'>
                <nav style={centerStyle}>
                    <Link to="/">
                        <Button onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    <Link to="/detailed-questions">
                        <Button onClick={() => setPage("Detailed-Questions")}>Detailed Questions</Button>
                    </Link>
                </nav>
            </div>
        )
    }
    else if(page === "Detailed-Questions"){
        return(
            <div className="Header-footer">
                <nav style={centerStyle}>
                    <Link to="/">
                        <Button onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    <Link to="/basic-questions">
                        <Button onClick={() => setPage("Basic-Questions")}>Basic Questions</Button>
                    </Link>
                </nav>
            </div>
        )
    }
    else{
        return(
        <div className='Header-footer' style={{textAlign: "center"}}>
            <HomePage />
        </div>
        )
    }
}