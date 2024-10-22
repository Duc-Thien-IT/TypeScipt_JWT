const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const pool = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const path = require("path");
const middlewareController = require("./controllers/middlewareController"); 

dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve the login page
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

// Serve the register page
app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'register.html'));
});

// Serve the home page with authentication middleware
app.get('/index.html', middlewareController.verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/', (req, res) => {
  res.send('Hello');
});

//api routes
app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRoutes);

app.listen(8000, () => {
  console.log("server is running !!!");
});
