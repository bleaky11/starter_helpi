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

    useEffect(() => { //Runs on basicComplete or detailedComplete update
        if (basicComplete && sessionStorage.getItem("basicCount") === null) { //if basicQs completed for the first time, notify user
            setNotification(true);
        } else if (detailedComplete && sessionStorage.getItem("detailedCount") === null){//if detailedQs completed for the first time, notify user
            setNotification(true);
        } else {//Turn notification off after viewed 
            setNotification(false);
        }
    }, [basicComplete, detailedComplete]);

    useEffect(() => { //Changes image of bell to notification bell when notification is updated
        if(notification){
            changeImage(true);
        }
        else{
            changeImage(false);
        }
    }, [notification])

    function basicToggle(): void{ //Function to handle toggling the notification bar on and off
        toggleBar(!notifBar);
        if(notification === true){
            setNotification(false); //set notification to false if it equals true when clicked
            if(basicComplete){
                sessionStorage.setItem("basicCount", "1") //update counter so notification doesn't keep getting displayed after being viewed
            }
            
            if(detailedComplete){ //update counter so notification doesn't keep getting displayed after being viewed
                sessionStorage.setItem("detailedCount", "1")
            }
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