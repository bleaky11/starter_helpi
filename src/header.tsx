import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HomePage } from "./homepagelogo";
import { Account } from "./homepagelogo";

interface HeaderComponentProps {
    basicComplete: boolean;
    page: string;
    setPage: (page: string) => void;
}

interface DatabaseProps {
    db: IDBDatabase | null;
    setDb: React.Dispatch<React.SetStateAction<IDBDatabase | null>>;
}

interface UserProps
{
  loggedUser: Account | null;
  setLoggedUser: React.Dispatch<React.SetStateAction<Account | null>>;
}

export function HeaderComponent({ basicComplete, setPage, page, db, setDb, loggedUser, setLoggedUser }: HeaderComponentProps & DatabaseProps & UserProps): JSX.Element | null { 
    if (page === "Basic-Questions") {
        return (
            <div className='Header-footer'>
                <nav className="Centered">
                    <Link to="/">
                        <Button className="Button" onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    {loggedUser ? (
                    loggedUser.basicComplete ? (
                        <Link to="/detailed-questions">
                            <Button className="Button" onClick={() => setPage("Detailed-Questions")}>Question Witnesses</Button>
                        </Link>
                    ) : (
                        <Button className="Button" disabled={true}>Question Witnesses</Button>
                    )
                ) : basicComplete ? (
                    <Link to="/detailed-questions">
                        <Button className="Button" onClick={() => setPage("Detailed-Questions")}>Question Witnesses</Button>
                    </Link>
                ) : (
                    <Button className="Button" disabled={true}>Question Witnesses</Button>
                )}
                </nav>
            </div>
        );
    } else if (page === "Detailed-Questions") {
        return (
            <div className="Header-footer">
                <nav className="Centered">
                    <Link to="/">
                        <Button className="Button" onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    <Link to="/basic-questions">
                        <Button className="Button" onClick={() => setPage("Basic-Questions")}>Collect Evidence</Button>
                    </Link>
                </nav>
            </div>
        );
    } else if (page === "Results-Page") {
        return (
            <div className="Header-footer">
                <nav className="Centered">
                    <Link to="/basic-questions">
                        <Button className="Button" onClick={() => setPage("Basic-Questions")}>Collect Evidence</Button>
                    </Link>
                    <Link to="/">
                        <Button className="Button" onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    <Link to="/detailed-questions">
                        <Button className="Button" onClick={() => setPage("Detailed-Questions")}>Question Witnesses</Button>
                    </Link>
                </nav>
            </div>
        )
    }
    else if(page === "Interface"){//If on Interface page, display home button
        return(
            <div className="Header-footer">
                <nav className="Centered">
                    <Link to="/">
                        <Button className="Button" onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                </nav>
            </div>
        )
    }
    else{//If on homepage, display homepage component
        return(
        <div className='Header-footer' style={{textAlign: "center"}}>
            <HomePage db={db} setDb={setDb} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
        </div>
        )
    }
}