import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HomePage } from "./homepagelogo";

interface HeaderComponentProps {
    page: string;
    setPage: (page: string) => void;
}

interface DatabaseProps {
    db: IDBDatabase | null;
    setDb: React.Dispatch<React.SetStateAction<IDBDatabase | null>>;
}

export function HeaderComponent({ setPage, page, db, setDb }: HeaderComponentProps & DatabaseProps): JSX.Element | null { 
    if (page === "Basic-Questions") {
        return (
            <div className='Header-footer'>
                <nav className="Centered">
                    <Link to="/">
                        <Button className="Button" onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    <Link to="/detailed-questions">
                        <Button className="Button" onClick={() => setPage("Detailed-Questions")}>Detailed Questions</Button>
                    </Link>
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
                        <Button className="Button" onClick={() => setPage("Basic-Questions")}>Basic Questions</Button>
                    </Link>
                </nav>
            </div>
        );
    } else if (page === "Results-Page") {
        return (
            <div className="Header-footer">
                <nav className="Centered">
                    <Link to="/basic-questions">
                        <Button className="Button" onClick={() => setPage("Basic-Questions")}>Basic Questions</Button>
                    </Link>
                    <Link to="/">
                        <Button className="Button" onClick={() => setPage("Home")}>Home</Button>
                    </Link>
                    <Link to="/detailed-questions">
                        <Button className="Button" onClick={() => setPage("Detailed-Questions")}>Detailed Questions</Button>
                    </Link>
                </nav>
            </div>
        );
    } else { 
        return (
            <div className='Header-footer' style={{ textAlign: "center" }}>
                <HomePage db={db} setDb={setDb} />
            </div>
        );
    }
}