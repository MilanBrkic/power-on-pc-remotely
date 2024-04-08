const express = require("express");
const { execSync } = require("child_process"); // Require execSync from child_process module
const app = express();
require("dotenv").config();
const port = 1337;

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.json());
app.use(logMiddleware);

app.post("/power-on", (req, res) => {
  const password = req.body?.password;

  if (!password) {
    res.status(404).send("Password not entered");
    console.error("Password not entered");
    return;
  }

  if (!isPasswordCorrect(password)) {
    res.status(404).send("Password is incorrect");
    console.error("Password incorrect");
    return;
  }

  powerOnPc(60);
  res.send("PC powered on");
});

function isPasswordCorrect(password) {
  return password === process.env.PASSWORD;
}

app.get("/health", (req, res) => {
  res.send("Cao");
});
// Start the server
app.listen(port, () => {
  console.log(`Frontend server is listening at http://localhost:${port}`);
});

function powerOnPc(angle) {
  try {
    execSync(`python servo.py ${angle}`);
    console.log("Script executed successfully");
  } catch (error) {
    console.error("SCRIPT ERROR: " + error);
  }
}

function logMiddleware(req, res, next) {
  const startTime = Date.now();
  console.log(
    `[${new Date().toISOString()}] Received ${req.method} request at ${req.url}`
  );

  // Override end() function to log completion time
  const oldEnd = res.end;
  res.end = function () {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(
      `[${new Date().toISOString()}] Request at ${
        req.url
      } completed in ${duration}ms`
    );
    oldEnd.apply(res, arguments);
  };

  next();
}
