interface completed{
    basicComplete: boolean;
    detailedComplete: boolean;
}

export function ResultPage({basicComplete, detailedComplete}: completed): JSX.Element
{

    return (
    <div className="Background">
        <h1 className="App">Result page</h1>
        {!(basicComplete && detailedComplete) && <p className="testing">Complete questions for results</p>}
        
    </div>
    )
}