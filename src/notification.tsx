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
    const [notification, setNotification] = useState<boolean>(false);

    useEffect(() => {
        if (basicComplete && sessionStorage.getItem("basicCount") === null) {
            setNotification(true);
        } else if (detailedComplete && sessionStorage.getItem("detailedCount") === null){
            setNotification(true);
        } else {
            setNotification(false);
        }
    }, [basicComplete, detailedComplete]);

    useEffect(() => {
        if(notification){
            changeImage(true);
        }
        else{
            changeImage(false);
        }
    }, [notification])

    function basicToggle(): void{
        toggleBar(!notifBar);
        if(notification === true){
            setNotification(false);
            if(basicComplete){
                sessionStorage.setItem("basicCount", "1")
            }
            
            if(detailedComplete){
                sessionStorage.setItem("detailedCount", "1")
            }
        }
    }
    return (<div className="container" style={{width: "10%", margin: "0px", backgroundColor: "#FDF6C3", borderRadius: "7px", right: "2%",
        top:"5px",
        position:"absolute"}}>
        <div>
            <img src={image === true ? notificationBell : bell} onClick={basicToggle} alt="Bell here" className="notif-bell"></img>
        </div>
        {(basicComplete && detailedComplete)? (notifBar && <div className="notif-bar">Basic Questions are complete! <br></br> Detailed Questions are complete!</div>) :
        ((basicComplete && !detailedComplete)? (notifBar && <div className="notif-bar">Basic Questions are complete!</div>) :
        ((detailedComplete && !basicComplete)?  (notifBar && <div className="notif-bar">Detailed Questions are complete!</div> ): (notifBar && <div className="notif-bar">No questions finished yet</div>)))}

    </div>)
}