const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const pollRoutes = require("./routes/pollRoutes")
const pollSocket = require("./sockets/pollSocket")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      "https://intervue-poll-umber.vercel.app", // Vercel frontend
      "http://localhost:5173", // local dev (if needed)
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});



app.use(express.json())

app.use("/poll", pollRoutes)

pollSocket(io)

const PORT = process.env.PORT ||  3000
server.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`)
})