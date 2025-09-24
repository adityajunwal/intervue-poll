import React, { useState, useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { io } from "socket.io-client"
import "./TeacherScreen.css";

const socket = io("https://intervue-backend.up.railway.app", {
  transports: ["websocket"],
});
function TeacherScreen() {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""])
    const [currentPoll, setCurrentPoll] = useState(null)
    const [results, setResults] = useState()
    const [duration, setDuration] = useState(60)
    
    function showError(msg) {
        alert(msg); // temporary, later you can make a proper UI banner
    }


    useEffect(() => {
        socket.on("poll:new", (poll) => {
            setCurrentPoll(poll)
            setResults(null)
        })

        socket.on("poll:update_results", (data) => {
            setResults(data.pollResults)
        })

        socket.on("poll:error", (err) => showError(err))

    }, [])

    function createPoll() {
        const filteredOptions = options.filter((opt) => opt.trim() !== "")

        if (!question || filteredOptions.length < 2) {
            showError("Enter a question and atleast 2 Options")
            return
        }

        socket.emit("teacher:create_poll", {
            question,
            options: filteredOptions,
            duration: duration
        })

        setQuestion("")
        setOptions(["", ""])
    }

    function updateOption(index, value) {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    function addOption() {
        setOptions([...options, ""])
    }

    return (

        <>
            {!currentPoll ? (

                <>
                    <div className="super-container">
                        <div className='intervue-logo'>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.2762 8.76363C12.2775 8.96965 12.2148 9.17098 12.0969 9.33992C11.979 9.50887 11.8116 9.63711 11.6178 9.707L8.35572 10.907L7.15567 14.1671C7.08471 14.3604 6.95614 14.5272 6.78735 14.645C6.61855 14.7628 6.41766 14.826 6.21181 14.826C6.00596 14.826 5.80506 14.7628 5.63627 14.645C5.46747 14.5272 5.33891 14.3604 5.26794 14.1671L4.06537 10.9111L0.804778 9.71104C0.611716 9.63997 0.445097 9.5114 0.327404 9.34266C0.20971 9.17392 0.146606 8.97315 0.146606 8.76742C0.146606 8.56169 0.20971 8.36092 0.327404 8.19218C0.445097 8.02345 0.611716 7.89487 0.804778 7.82381L4.06688 6.62376L5.26693 3.36418C5.33799 3.17112 5.46657 3.0045 5.6353 2.88681C5.80404 2.76911 6.00482 2.70601 6.21054 2.70601C6.41627 2.70601 6.61705 2.76911 6.78578 2.88681C6.95452 3.0045 7.08309 3.17112 7.15416 3.36418L8.35421 6.62629L11.6138 7.82633C11.8074 7.8952 11.9749 8.02223 12.0935 8.19003C12.2121 8.35782 12.2759 8.55817 12.2762 8.76363ZM8.73923 2.70024H9.7498V3.71081C9.7498 3.84482 9.80303 3.97334 9.89779 4.06809C9.99255 4.16285 10.1211 4.21609 10.2551 4.21609C10.3891 4.21609 10.5176 4.16285 10.6124 4.06809C10.7071 3.97334 10.7604 3.84482 10.7604 3.71081V2.70024H11.7709C11.9049 2.70024 12.0335 2.64701 12.1282 2.55225C12.223 2.45749 12.2762 2.32897 12.2762 2.19496C12.2762 2.06095 12.223 1.93243 12.1282 1.83767C12.0335 1.74291 11.9049 1.68968 11.7709 1.68968H10.7604V0.679111C10.7604 0.545101 10.7071 0.416581 10.6124 0.321822C10.5176 0.227063 10.3891 0.173828 10.2551 0.173828C10.1211 0.173828 9.99255 0.227063 9.89779 0.321822C9.80303 0.416581 9.7498 0.545101 9.7498 0.679111V1.68968H8.73923C8.60522 1.68968 8.4767 1.74291 8.38194 1.83767C8.28718 1.93243 8.23395 2.06095 8.23395 2.19496C8.23395 2.32897 8.28718 2.45749 8.38194 2.55225C8.4767 2.64701 8.60522 2.70024 8.73923 2.70024ZM14.2973 4.72137H13.7921V4.21609C13.7921 4.08208 13.7388 3.95356 13.6441 3.8588C13.5493 3.76404 13.4208 3.71081 13.2868 3.71081C13.1528 3.71081 13.0242 3.76404 12.9295 3.8588C12.8347 3.95356 12.7815 4.08208 12.7815 4.21609V4.72137H12.2762C12.1422 4.72137 12.0137 4.77461 11.9189 4.86937C11.8242 4.96412 11.7709 5.09264 11.7709 5.22665C11.7709 5.36066 11.8242 5.48918 11.9189 5.58394C12.0137 5.6787 12.1422 5.73194 12.2762 5.73194H12.7815V6.23722C12.7815 6.37123 12.8347 6.49975 12.9295 6.59451C13.0242 6.68927 13.1528 6.7425 13.2868 6.7425C13.4208 6.7425 13.5493 6.68927 13.6441 6.59451C13.7388 6.49975 13.7921 6.37123 13.7921 6.23722V5.73194H14.2973C14.4313 5.73194 14.5599 5.6787 14.6546 5.58394C14.7494 5.48918 14.8026 5.36066 14.8026 5.22665C14.8026 5.09264 14.7494 4.96412 14.6546 4.86937C14.5599 4.77461 14.4313 4.72137 14.2973 4.72137Z" fill="white" />
                            </svg>
                            <span>Intervue Poll</span>
                        </div>
                        <h1>Let's <span>Get Started</span></h1>
                        <p className="message">you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real time</p>
                        <div className="que-dur-selector">
                            <label htmlFor="question" className="question-label">Enter your question</label>
                            <div className="selector">
                                <select
                                    value={duration}
                                    name="duration"
                                    id="dur-selector"
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                >   <option className="dur-opt" value="60">60 seconds</option>
                                    <option className="dur-opt" value="45">45 seconds</option>
                                    <option className="dur-opt" value="30">30 seconds</option>
                                    <option className="dur-opt" value="15">15 seconds</option>
                                </select>
                                <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.70325 13.8925L0.323656 0.486524L16.7771 0.300191L8.70325 13.8925Z" fill="#480FB3" />
                                </svg>
                            </div>
                        </div>
                        <textarea
                            maxLength={100}
                            name="question-text"
                            id="question-text"
                            placeholder="Enter your question here..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        ></textarea>

                        <div className="option-heading">
                            <h5>Edit Options</h5>
                            <h5 id="is-correct">Is it Correct?</h5>
                        </div>

                        {options.map((opt, idx) => (
                            <div className="option">
                                <div className="opt-bullet">{idx + 1}</div>
                                <input
                                    className="poll-option"
                                    key={idx}
                                    type="text"
                                    placeholder={`Option ${idx + 1}`}
                                    value={opt}
                                    onChange={(e) => updateOption(idx, e.target.value)}
                                />
                                <div className="is-correct-radio">
                                    <label>
                                        <input type="radio" name={`is-cor ${idx}`} value="yes" /> Yes
                                    </label>
                                    <label>
                                        <input type="radio" name={`is-cor ${idx}`} value="no" /> No
                                    </label>
                                </div>
                            </div>
                        ))}
                        <button
                            className="add-option-btn"
                            onClick={addOption}
                        >+ Add more options</button>
                    </div>
                    <div className="footer">
                        <button
                            className="ask-question"
                            onClick={createPoll}
                        >Ask Question</button>
                    </div>
                </>
            ) : (
                <>
                    <div className="question-container">
                        <h3 className="que-text">Question</h3>
                        <div className="inner-container">
                            <p className="ques-text">
                                <h4>{currentPoll.question}</h4>
                            </p>
                            {currentPoll.options.map((opt, idx) => (
                                <div key={idx}>
                                    <div className="vote-bar">
                                        <div
                                            className="vote-fill"
                                            style={{
                                                width: results
                                                    ? `${(results[opt] / Math.max(1, Object.values(results).reduce((a, b) => a + b))) * 100}%`
                                                    : "0%",
                                                color: results && Object.values(results).reduce((a, b) => a + b, 0) > 0 &&
                                                    (results[opt] / Object.values(results).reduce((a, b) => a + b, 0)) * 100 > 0
                                                    ? "white"
                                                    : "black"
                                            }}
                                        >
                                            <span className="opt-marker">
                                                <span id="opt-num">
                                                    {idx + 1}
                                                </span>
                                                <span className="option-text">
                                                    {opt}
                                                </span>
                                            </span>
                                        </div>
                                        <span>
                                            {results
                                                ? `${(results[opt] / Math.max(1, Object.values(results).reduce((a, b) => a + b))) * 100}%`
                                                : "0%"
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="btn-div">
                            <button
                                className="ask-another-btn"
                                onClick={(e) => setCurrentPoll(null)}
                            >+ Ask another question</button>
                        </div>
                    </div>

                </>
            )}

        </>

    )
}

export default TeacherScreen