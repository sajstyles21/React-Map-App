const express = require("express");
const router = require("express").Router();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/auth");
const pinRoute = require("./routes/pin");
const path = require("path");
dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("DB Connected");
});

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/pin", pinRoute);

router.get("/", (req, res) => {
  res.status(200).json("hello");
});

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log("listening to server");
});
