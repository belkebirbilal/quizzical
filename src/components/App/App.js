import React, {useState} from "react";
import Quize from "../questions/Quize";
import "./App.css";

function App() {
    const [take , setTake] = useState(false)
    function handleClick() {
        setTake(prev => !prev)
    }
    return (
        <div className="App">
            <div className="take_quize" style={{display: take ? "none" : "flex"}}>
                <div className="quizzical">
                    <h1>Quizzical</h1>
                    <p>Test your knowledge</p>
                    <button onClick={handleClick}>Take Quize</button>
                </div>
            </div>
            {take && <Quize />}
        </div>
    )
}

export default App;