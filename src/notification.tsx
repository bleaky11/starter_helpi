import { useState } from "react"

import bell from "./bell.png"

export interface submitButton{ // Interface for keeping track of Basic Question Completion
    basicComplete: boolean;
}

export function NotifBell({basicComplete}: submitButton): JSX.Element{
    const [notifBar, toggleBar] = useState<boolean>(false);
    // const [detailedComplete, toggleDetailed] = useState<boolean>(false);
    function toggleNotif(): void{
        toggleBar(!notifBar);
        console.log(basicComplete)
    }
    return (<div className="container">
        <div>
            <img src={bell} onClick={toggleNotif} alt="Bell here" className="notif-bell"></img>
        </div>
        {(basicComplete)? (notifBar && <div className="notif-bar">Basic Questions are complete!</div>) : notifBar && <div className="notif-bar">No questions finished yet</div>}
    </div>)
}