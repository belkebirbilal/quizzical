import React,{useState, useEffect} from "react";
import "./Quize.css";

function Quize() {
    const [data , setData] = useState([])
    const [all , setAll] = useState([])
    const [correctAnswers , setCorrectAnswers] = useState([])
    // const [userChoices , setUserChoices] = useState([])
    const [isChecked , setIsChecked] = useState(false)
    const [correct , setCorrect] = useState(0)
    const [playAgain , setPlayAgain] = useState(false)
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://api.jsonbin.io/v3/b/66de8cb6acd3cb34a8808d40')
                const data = await response.json()
                setData(data.record)
            } catch(error) {
                console.error('error in fetching data ...')
            }
        }
        fetchData()
    },[playAgain])
    useEffect(() => {
        const quesAndAnswers = []
        const cAnswers = []
        for (let i = 0; i < 5; i++) {
            const obj = {}
            const random = Math.floor(Math.random() * data.length);
            const questionObj = data[random];
            if (questionObj) {
                if (questionObj.question) {
                    obj.question = questionObj.question;
                }
                if (questionObj.correct_answer && Array.isArray(questionObj.incorrect_answers)) {
                    const sorted = [questionObj.correct_answer, ...questionObj.incorrect_answers].sort()
                    obj.answers = sorted;
                    obj["correct_answer"] = questionObj["correct_answer"]
                    cAnswers.push(questionObj["correct_answer"])
                }
            }
            quesAndAnswers.push(obj)
        }
        setCorrectAnswers(cAnswers)
        setAll(quesAndAnswers)
    },[data])
    function handleAnswerClick(event) {
        const answers = event.target.parentElement.children
        // i change this to an array because parentElement.children returns an HTMLCollection
        Array.from(answers).forEach(el => {
            if (el.classList.contains("chosen")) {
                el.classList.remove("chosen")
            }
        });
        event.target.classList.add("chosen")
    }
    function handleCheckAnswers(event) {
        const section = document.querySelector(".section").children
        const Choices = []
        section && Array.from(section).forEach(el => {
            const all = el.children
            Array.from(all).forEach((el) => {
                if(el.className === "answers") {
                    const answers = el.children
                    Array.from(answers).forEach(ans => {
                        if (ans.classList.contains("chosen")) {
                            Choices.push(ans.textContent)
                        }
                    })
                }
            })
        })
        // setUserChoices(Choices)
        if(Choices) {
            let counter = 0
            let c = 0
            section && Array.from(section).forEach(el => {
                const all = el.children
                Array.from(all).forEach((el) => {
                    if(el.className === "answers") {
                        const answers = el.children
                        let isThereACorrect = 0
                        Array.from(answers).forEach(ans => {
                            isThereACorrect++
                            if(correctAnswers[counter] === ans.textContent) {
                                if(ans.classList.contains("chosen")) {
                                    ans.style.backgroundColor = "#94D7A2"
                                    ans.style.color = "#293264"
                                    c++
                                }
                            } else if(ans.classList.contains('chosen')) {
                                ans.style.backgroundColor = "#F8BCBC"
                                ans.style.color = "#293264"
                            }
                            if(isThereACorrect === 4) {
                                Array.from(answers).forEach(a => {
                                    if(correctAnswers[counter] === a.textContent) {
                                        a.style.backgroundColor = "#94D7A2"
                                        a.style.color = "#293264"
                                    }
                                })
                            }
                        })
                        isThereACorrect++
                        counter++
                    }
                })
            })
            setCorrect(c)
        }
    }
    function handleDisplay() {
        setIsChecked(prev => !prev)
    }

    function handlePlayAgain() {
        setIsChecked(prev => !prev)
        setPlayAgain(prev => !prev)
        const section = document.querySelector(".section").children
        section && Array.from(section).forEach(el => {
            const all = el.children
            Array.from(all).forEach((el) => {
                if(el.className === "answers") {
                    const answers = el.children
                    Array.from(answers).forEach(ans => {
                        ans.style.removeProperty("background-color");
                        ans.style.removeProperty("color");
                        if(ans.classList.contains("chosen")) {
                            ans.classList.remove("chosen")
                        }
                    })
                }
            })
        })
    }
    return (
        <div className="quize">
            <div className="section">
            {all.map((el,quesindex) => {
                return (
                    <div className="all" key={`question${quesindex}`}>
                        <h3 className="ques">{el.question}</h3>
                        <div className="answers">
                            {
                                el.answers && el.answers.map((ele,index) => {
                                    return <p onClick={handleAnswerClick} key={index} className="answer">{ele}</p>
                                })
                            }
                        </div>
                        <hr />
                    </div>
                )
            })}
            </div>
            <div className="check">
                <div className="play_again"
                    style={{display: isChecked ? "flex" : "none", alignItems: "center"}}>
                    <p>You scored {correct}/5 correct answers</p>
                    <button onClick={handlePlayAgain}>play again</button>
                </div>
                <button
                    style={{display: isChecked ? "none" : "block"}}
                    onClick={(event) => {handleCheckAnswers(event); handleDisplay(event)}}
                    >check answers
                </button>
            </div>
        </div>
    )
}

export default Quize;