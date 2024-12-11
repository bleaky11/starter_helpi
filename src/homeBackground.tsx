import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from "./Images/themeHome.svg";
import theme1 from "./Images/themeHomeDrawerOpen1.svg"
import theme2 from "./Images/themeHomeDrawerOpen2.svg"
import theme3 from "./Images/themeHomeDrawerOpen3.svg"
import theme4 from "./Images/themeHomeDrawerOpen4.svg"
import { Images } from 'openai/resources';

interface HomeBackgroundProps {
    basicComplete: boolean;
    page: string;
    setPage: (page: string) => void;
  }

export function HomeBackground({basicComplete, page, setPage}: HomeBackgroundProps): JSX.Element {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [backgroundImageIndex, setImageIndex] = useState(0);
    const backgrounds = [
        theme,
        theme1,
        theme2,
        theme3,
        theme4
    ]

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

    const openDrawer = () => {
        if(isAnimating){
            return;
        }
        else{
            setIsAnimating(true);
            let currentIndex = 0;
            const interval = setInterval(() => {
                if(currentIndex < backgrounds.length - 1){
                    currentIndex++;
                    setImageIndex(currentIndex);
                } else {
                    clearInterval(interval);
                    setIsAnimating(false);
                }
            }, 500);
        }
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
                href={backgrounds[backgroundImageIndex]} 
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

        <rect 
            width={180}
            height={58}
            x={136}
            y={590}
            stroke='red'
            fill='transparent'
            style={{ cursor: 'pointer' }}
            onClick={openDrawer}
        />
            
        </svg>
        </div>
    );
}
