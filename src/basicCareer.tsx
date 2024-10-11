import { useState } from "react"
import { Button } from "react-bootstrap";

export function BasicCareerComponent(): JSX.Element
{
    const[page, setPage] = useState<boolean>(false);
    function changePage(): void
    {
        setPage(!page);
    }
    return(
    <div>
        <Button onClick = {changePage}>Basic Career Questions</Button>
    </div>
    )
}