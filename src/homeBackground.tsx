import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from "./Images/themeHome.svg";

interface HomeBackgroundProps {
    basicComplete: boolean;
    page: string;
    setPage: (page: string) => void;
  }

export function HomeBackground({basicComplete, page, setPage}: HomeBackgroundProps): JSX.Element {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    // SVG dimensions
    const svgDimensions = { width: "100%", height: "100%" };
    const handleNavQuiz = () => {
        navigate("/interface");
        setPage("Interface");
    };

    const handleNavResults = () => {
        navigate("/results-page");
        setPage("Results-Page")
    }


    return (
        <div>
            {isHovered && <h2 style={{paddingTop: "12%", paddingLeft: "31.5%", position: 'relative', zIndex: 10}}>Get to work, Detective</h2>}
            {basicComplete && <h3 style={{paddingTop: "12%", paddingLeft: "32.5%", position: 'relative', zIndex: 10}}>Show me your findings.</h3>}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={svgDimensions.width}
            height={svgDimensions.height}
            preserveAspectRatio='none'
            viewBox="0 0 1920 900"
            className="home-background"
            style={{position: 'absolute', zIndex: 0}}
        >
            {/* Image fill the SVG container */}
            <image 
                href={theme} 
                x="0" 
                y="0" 
                width="100%" 
                height="100%" 
                preserveAspectRatio="xMidYMid slice"  // Ensures the image fills the SVG
            />
            
            {basicComplete ? <ellipse
                cx={1190}
                cy={382}
                rx={245}
                ry={210}
                r={225}
                fill='transparent'
                onClick={handleNavQuiz}
                style={{ cursor: 'pointer' }}
            /> : <ellipse
            className='Breathing'
            cx={1190}
            cy={382}
            rx={245}
            ry={210}
            r={225}
            stroke="red"
            strokeWidth="2"
            onClick={handleNavQuiz}
            style={{ cursor: 'pointer' }}
        />}
            
            {basicComplete ? <rect 
                width={190}
                height={490}
                x={670}
                y={290}
                onClick={handleNavResults}
                fill="transparent"
                style={{ cursor: 'pointer' }}
            /> : <rect 
            width={190}
            height={490}
            x={670}
            y={290}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            fill="transparent"
            style={{ cursor: 'pointer' }}
        />}
            
        </svg>
        </div>
    );
}
