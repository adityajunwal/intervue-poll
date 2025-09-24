const pollService = require("../services/pollService")

function pollSocket(io) {
    io.on("connection", (socket) => {
        console.log("New Client connected: ", socket.id)
        
        // For teacher for creating a poll
        socket.on("teacher:create_poll", ({ question, options, duration }) => {
            console.log("PollCreated:", question)
            const poll = pollService.createPoll(question, options, duration)
            io.emit("poll:new", poll)
        })

        // for students for submitting answers
        socket.on("student:submit_answer", ({ studentName, answer }) => {
            const result = pollService.submitAnswer(studentName, answer)

            if (result.error) {
                socket.emit("poll:error", result.error)
            } else {
                io.emit("poll:update_results", pollService.getPoll())
            }
        })

        socket.on("disconnect", () => {
            console.log("Client Disconnected:", socket.id)
        })
    })
}

module.exports = pollSocket