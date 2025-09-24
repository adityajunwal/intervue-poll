const pollService = require("../services/pollService")

function createPoll(req, res){
    const { question, options, duration} = req.body;

    if (!question || !options || options.length < 2){
        return res.status(400).json({
            error: "Invalid poll data"
        })
    }

    const poll = pollService.createPoll(question, options, duration)
    res.status(201).json(poll)
}

function getCurrentPoll(req, res) {
    const { currePoll, pollResults } = pollService.getPoll();

    if (!currePoll){
        return res.status(404).json({
            error: "No Active Polls"
        })
    }

    res.json({
        poll: currePoll,
        results: pollResults
    })
}

module.exports = {
    createPoll,
    getCurrentPoll
}