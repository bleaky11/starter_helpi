import { Database } from "./db";
import { BasicProps } from "./notification";
import { HomeBackground } from "./homeBackground";

interface HomeComponentProps {
  page: string;
  setPage: (page: string) => void;
  basicComplete: boolean;
  detailedComplete: boolean;
  isKeyEntered: boolean;
  apiKey: string;
}

export function MainPage({
  setPage,
  page,
  basicComplete,
  detailedComplete,
  isKeyEntered,
  apiKey,
  db,
  setDb,
  loggedUser
}: HomeComponentProps & Database & BasicProps): JSX.Element {
  return (
    <div>
      <header className="App-header"> 
        <HomeBackground basicComplete={basicComplete} setPage={setPage} page={page}/>
      </header>
    </div>
  );
}