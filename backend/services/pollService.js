let currentPoll = null
let pollResults = {}
let answeredStudents = new Set()
let pollTimer = null

function createPoll(question, options, duration = 60) {
    currentPoll = { question, options, active: true}
    pollResults = {}
    options.forEach(opt => {
        pollResults[opt] = 0
    });

    answeredStudents.clear()

    if (pollTimer){
        clearTimeout(pollTimer)
    }

    pollTimer = setTimeout(() => closePoll(), duration * 1000)

    return currentPoll;
}

function submitAnswer(studentName, answer){
    if (!currentPoll || !currentPoll.active){
        return {
            error: "No active poll"
        }
    }

    if (answeredStudents.has(studentName)){
        return {
            error: "Already Answered"
        }
    }

    if (!pollResults.hasOwnProperty(answer)){
        return {
            error: "Invalid Option" 
        }
    }

    pollResults[answer]++;
    answeredStudents.add(studentName)

    return {success: true, results: pollResults}
}

function closePoll() {
    if (currentPoll){
        currentPoll.active = false
    }
    return pollResults
}

function getPoll() {
    return { currentPoll, pollResults }
}

module.exports = {
    createPoll,
    submitAnswer,
    closePoll,
    getPoll
}