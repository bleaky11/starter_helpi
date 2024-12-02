import { useEffect, useState } from "react";
import { Database } from "./db";
import { Account } from "./homepagelogo";
import bell from "./Images/bell.png";
import notificationBell from "./Images/notificationBell.png";

export interface submitButton { // Interface for keeping track of Basic Question Completion
    basicComplete: boolean;
    detailedComplete: boolean;
}

export interface BasicProps {
    loggedUser: Account | null;
}

export function NotifBell({
    basicComplete,
    detailedComplete,
    db,
    setDb,
    loggedUser,
}: submitButton & Database & BasicProps): JSX.Element {
    const [notifBar, toggleBar] = useState<boolean>(false);
    const [image, changeImage] = useState<boolean>(false);
    const [notification, setNotification] = useState<boolean>(false);

    // Track the completion status and sync it across sessions
    useEffect(() => {
        if (loggedUser && db) {
            const transaction = db.transaction("users", "readonly");
            const store = transaction.objectStore("users");
            const userRequest = store.get(loggedUser.username);

            userRequest.onsuccess = () => {
                const userRecord = userRequest.result;
                if (userRecord && userRecord.basicComplete === "true") {
                    setNotification(true);
                }
            };
        } else if (basicComplete && sessionStorage.getItem("basicCount") === null) {
            setNotification(true);
        } else if (detailedComplete && sessionStorage.getItem("detailedCount") === null) {
            setNotification(true);
        } else {
            setNotification(false);
        }
    }, [basicComplete, db, detailedComplete, loggedUser]);

    // Handle changing the bell icon based on notification state
    useEffect(() => {
        if (notification) {
            changeImage(true);
        } else {
            changeImage(false);
        }
    }, [notification]);

    const basicToggle = (): void => {
        toggleBar(!notifBar);
        if (notification) {
            setNotification(false);
            if (basicComplete) {
                sessionStorage.setItem("basicCount", "1"); // update counter so notification doesn't show again
            }

            if (detailedComplete) {
                sessionStorage.setItem("detailedCount", "1");
            }
        }
    };

    return (
        <div className="container">
            <div>
                <img
                    src={image ? notificationBell : bell}
                    onClick={basicToggle}
                    alt="Bell here"
                    className="notif-bell"
                />
            </div>
            {notifBar && (
                <div className="notif-bar">
                    {basicComplete && detailedComplete
                        ? "Both Basic and Detailed Questions are complete! Check out the results page!"
                        : basicComplete
                        ? "Basic Questions are complete! Check out the results page!"
                        : detailedComplete
                        ? "Detailed Questions are complete! Check out the results page!"
                        : "No questions finished yet"}
                </div>
            )}
        </div>
    );
}
