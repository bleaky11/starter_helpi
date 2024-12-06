import React from 'react';
import { useNavigate } from 'react-router-dom';
import theme from "./Images/themeHome.svg";

interface HomeBackgroundProps {
    page: string;
    setPage: (page: string) => void;
  }

export function HomeBackground({page, setPage}: HomeBackgroundProps): JSX.Element {
    const navigate = useNavigate();

    // SVG dimensions
    const svgDimensions = { width: "100%", height: "100%" };
    const handleNav = () => {
        navigate("/interface");
        setPage("Interface");
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={svgDimensions.width}
            height={svgDimensions.height}
            preserveAspectRatio='none'
            viewBox="0 0 1920 900"
            className="home-background"
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
            
            {/* Clickable circle area */}
            <ellipse
                cx={1190}
                cy={382}
                rx={245}
                ry={210}
                r={225}
                fill="transparent"
                stroke="red"
                strokeWidth="2"
                onClick={handleNav}
                style={{ cursor: 'pointer' }}
            />
        </svg>
    );
}
