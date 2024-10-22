import { useEffect, useState } from "react"
import bell from "./Images/bell.png"
import notificationBell from "./Images/notificationBell.png"

export interface submitButton{ // Interface for keeping track of Basic Question Completion
    basicComplete: boolean;
    detailedComplete: boolean;
}

export function NotifBell({basicComplete, detailedComplete}: submitButton): JSX.Element{
    const [notifBar, toggleBar] = useState<boolean>(false);
    const [image, changeImage] = useState<boolean>(false);

    useEffect(() => {
        if (basicComplete || detailedComplete) {
            changeImage(true);
        } else {
            changeImage(false);
        }
    }, [basicComplete, detailedComplete]);

    function basicToggle(): void{
        toggleBar(!notifBar);
        if(image === true){
            changeImage(false);
        }
    }
    return (<div className="container">
        <div>
            <img src={image === true ? notificationBell : bell} onClick={basicToggle} alt="Bell here" className="notif-bell"></img>
        </div>
        {(basicComplete && detailedComplete)? (notifBar && <div className="notif-bar">Basic Questions are complete! <br></br> Detailed Questions are complete!</div>) :
        ((basicComplete && !detailedComplete)? (notifBar && <div className="notif-bar">Basic Questions are complete!</div>) :
        ((detailedComplete && !basicComplete)?  (notifBar && <div className="notif-bar">Detailed Questions are complete!</div> ): (notifBar && <div className="notif-bar">No questions finished yet</div>)))}

    </div>)
}