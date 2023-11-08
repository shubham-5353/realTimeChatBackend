var express = require("express");
const app = express();
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
let os = require("os");
let dir_home = os.homedir();
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,X-Requested-With,Authorization,timeOffset",
  preflightContinue: true,
};
app.use(cors(corsOptions));
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  var params = socket.handshake.query;
  console.log("socket params", params.userId);
  if (params.userId) {
    let conntectedUserId = JSON.parse(params.userId);
    console.log(`User id ${conntectedUserId} is connected`);
  }

  /**
   * Get message send event from frontend.
   */
  socket.on("userTyping", async (data) => {
    socket.emit("roomUserTyping", { userId: data.userId });
  });
  socket.on("userTypingStart", async (data) => {
    console.log("userTyping", data);
    io.emit(`userTypingStart_${data.receiverUserId}`, {
      userId: data.userId,
    });
  });
  socket.on("userTypingEnd", async (data) => {
    console.log("userTyping end", data);
    io.emit(`userTypingEnd_${data.receiverUserId}`, {
      userId: data.userId,
    });
  });
  /**
   * Get socket disconnect event from frontend
   */

  socket.on("disconnect", (disconnect) => {
    var disParams = socket.handshake.query;
    if (disParams.userId) {
      let disconnectUserId = parseInt(disParams.userId);
      console.log(`User Id ${disconnectUserId} disconnected.`);
    }
  });
});
var auth = require("./routes/auth/auth");
var chat = require("./routes/chat/chat");
var message = require("./routes/message/message");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());
app.use(
  "/realTimeChatUploads",
  express.static(path.join(`${dir_home}/realTimeChatUploads`))
);
app.use((req, res, next) => {
  res.io = io;
  next();
});

app.use("/api", auth);
app.use("/api", chat);
app.use("/api", message);

server.listen(process.env.PORT, () => {
  console.log("Code is running in ", process.env.PORT);
});
