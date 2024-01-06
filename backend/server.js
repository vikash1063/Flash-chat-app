const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
// const userRoutes = require("./routes/userRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const messageRoutes = require("./routes/messageRoutes");

dotenv.config()

connectDB();

const PORT = process.env.PORT || 5000

const app = express()

// middleware
app.use(express.json())

app.use((req,res,next) => {
    console.log(req.path, req.method)
    next();
})

// routes
// app.use('api/workouts', workoutRoutes)

// listen
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})




