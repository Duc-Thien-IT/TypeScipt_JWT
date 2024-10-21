const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const pool = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello');
});

app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRoutes);

app.listen(8000, () => {
  console.log("server is running !!!");
});
