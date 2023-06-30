const express = require("express")
const cors = require("cors")
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const mongoose = require("mongoose")
const socket = require("socket.io");

const app = express()
require("dotenv").config()

//app.use(cors())
app.use(cors({
    // origin:"http://localhost:5000"
    origin:"https://es-chit-chat-app.netlify.app"
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", userRoutes); 
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`)
})

const io = socket(server, {
  cors: {
    origin: "https://es-chit-chat-app.netlify.app",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
  });