const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use("/api", routes);

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(process.env.PORT, () => {
  console.log("Backend is running.");
});
