import React from 'react';
import { useNavigate } from 'react-router-dom';
import quizInterface from "./Images/quizInterface.png";
import { HomeBackground } from './homeBackground';
import { relative } from 'path';

export function QuizInterface(): JSX.Element {
    return (
        <div>
            <h1 style={{position: "absolute", zIndex: "10"}}>h1</h1>
            <img src={quizInterface} alt="Quiz Interface" style={{position: "relative", zIndex: "0"}} />
        </div>
    );
}
