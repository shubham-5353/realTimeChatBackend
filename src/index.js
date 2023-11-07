var express = require("express");
const app = express();
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
let os = require("os");
let dir_home = os.homedir();
const cors = require("cors");
const bodyParser = require("body-parser");

var auth = require("./routes/auth/auth");
var chat = require("./routes/chat/chat");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/imageUpload", express.static(path.join(`${dir_home}/imageUpload`)));

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,X-Requested-With,Authorization,timeOffset",
  preflightContinue: true,
};
app.use(cors(corsOptions));

app.use("/api", auth);
app.use("/api", chat);
app.listen(process.env.PORT, () => {
  console.log("Code is running in ", process.env.PORT);
});
