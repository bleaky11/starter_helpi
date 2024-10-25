import { useState } from "react";
import { Button } from "react-bootstrap";
import userProfile from "./Images/user-profile.png";

export function HomePage(): JSX.Element {
    const [showButton, setShowButton] = useState(false);

    function logIn():JSX.Element
    {
        return <div></div>
    }
    return (
        <div>
            <div style={{ float: "left" }}>
                <img 
                    style={{ width: "50px", height: "55px", cursor: "pointer" }} 
                    src={userProfile} 
                    alt="user-profile" 
                />
            </div>
            <a href="https://bleaky11.github.io/starter_helpi/" style={{ color: "black" }}>
                <h1>The Career Quiz</h1>
            </a>
        </div>
    );
}
