const express = require("express");
var cors = require("cors");
const app = express();
const connect_DB = require("./config/db").connect_DB;
const dotenv = require("dotenv").config;
dotenv();

const user_rt = require("./routes/userRoutes");
const ques_rt = require("./routes/questionRoutes");
const ans_rt = require("./routes/answerRoutes");
const tag_rt = require("./routes/tagRoutes");
const com_rt = require("./routes/commentRoutes")
const vote_rt = require("./routes/voteRoutes")

// connect to the database. Placed in other file for modularity
connect_DB();

console.log(process.env.ORIGIN)
const cors_options = {
  credentials: true,
  origin: process.env.ORIGIN,
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(cors_options));
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Posted")
});

app.use("/api/user", user_rt);
app.use("/api/questions", ques_rt);
app.use("/api/tags", tag_rt);
app.use("/api/answers", ans_rt);
app.use("/api/comments", com_rt);
app.use("/api/vote", vote_rt);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
