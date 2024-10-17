import bell from "./Bell (1).png"
export function NotifBell(): JSX.Element{
    return (
        <img src={bell} onClick={() => console.log("It works")} alt="Bell here"> </img>
    )
}