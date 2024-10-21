import { useState } from "react"
import bell from "./bell.png"

export interface submitButton{ // Interface for keeping track of Basic Question Completion
    basicComplete: boolean;
    detailedComplete: boolean;
}

export function NotifBell({basicComplete, detailedComplete}: submitButton): JSX.Element{
    const [notifBar, toggleBar] = useState<boolean>(false);
    function basicToggle(): void{
        toggleBar(!notifBar);
    }
    return (<div className="container">
        <div>
            <img src={bell} onClick={basicToggle} alt="Bell here" className="notif-bell"></img>
        </div>
        {(basicComplete && detailedComplete)? (notifBar && <div className="notif-bar">Basic Questions are complete! <br></br> Detailed Questions are complete!</div>) :
        ((basicComplete && !detailedComplete)? (notifBar && <div className="notif-bar">Basic Questions are complete!</div>) :
        ((detailedComplete && !basicComplete)?  (notifBar && <div className="notif-bar">Detailed Questions are complete!</div> ): (notifBar && <div className="notif-bar">No questions finished yet</div>)))}

    </div>)
}