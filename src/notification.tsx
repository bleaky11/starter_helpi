import { useState } from "react"
import bell from "./bell.png"
export function NotifBell(): JSX.Element{
    const [notifBar, toggleBar] = useState<boolean>(false);
    function toggleNotif(): void{
        toggleBar(!notifBar);
    }
    return (<div className="container">
        <div>
            <img src={bell} onClick={toggleNotif} alt="Bell here" className="notif-bell"></img>
        </div>
        {notifBar && <div className="notif-bar">test</div>}
    </div>)
}