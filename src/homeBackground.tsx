import React from 'react';
import { useNavigate } from 'react-router-dom';
import theme from "./Images/themeHome.png";  // Assuming the PNG image is used

export function HomeBackground(): JSX.Element {
    const navigate = useNavigate();

    // SVG dimensions
    const svgDimensions = { width: "100vw", height: "100vh" };
    
    // Circle position and size (example)
    const scaledCx = window.innerWidth * 0.2;  // 20% from the left
    const scaledCy = window.innerHeight * 0.3; // 30% from the top
    const scaledRadius = 100;
    
    const handleHome = () => {
        navigate("/home");
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={svgDimensions.width}
            height={svgDimensions.height}
            viewBox="0 0 1920 1080"
        >

            <image href={theme} x="0" y="0" width="100%" height="100%" />
            
            {/* Clickable circle area */}
            <circle
                cx={scaledCx}
                cy={scaledCy}
                r={scaledRadius}
                fill="transparent"
                stroke="red"
                strokeWidth="2"
                onClick={handleHome}
                style={{ cursor: 'pointer' }}
            />
        </svg>
    );
}
