const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

const port = process.env.PORT || 5000;
const url = process.env.ATLAS_URL;

app.listen(port, (res, req) => {
  console.log(`server runing on port : ${port}`);
});

mongoose
  .connect(url)
  .then(() => console.log("Connected!"))
  .catch((error) => {
    console.log("Not Connected!", error.message);
  });
