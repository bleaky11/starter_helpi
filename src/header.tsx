import React from "react";
import { headingStyle } from "./CSS/Heading";
import { Button } from "react-bootstrap";
import { centerStyle } from "./CSS/Center";
import { Link } from "react-router-dom";

interface HeaderComponentProps {
    page: string
    setPage: (page: string) => void;
}

export function HeaderComponent({setPage, page}: HeaderComponentProps): JSX.Element {
    if(page === "Basic-Questions"){
        return(
            <div>
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
            <div>
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
        return (
            <h5 style={headingStyle}>Placeholder Header</h5>
        )
    }
}