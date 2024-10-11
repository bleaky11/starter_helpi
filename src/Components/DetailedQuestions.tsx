import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

export function DetailedQuestions(): React.JSX.Element {
    const [page, setPage] = useState<boolean>(false);

    function updatePage(){
        setPage(() => true)
    }

    return(
            <Button href = "src\DetailedQs.tsx">Detailed Questions</Button>
    ) 
}