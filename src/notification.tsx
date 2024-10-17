import bell from "./bell.png"
export function NotifBell(): JSX.Element{
    return (
        <img src={bell} onClick={() => console.log("something else")} alt="Bell here" className="notif-bell"></img>
    )
}