const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Enable JSON request parsing
app.use(express.json());

app.post("/run-script", (req, res) => {
  const { south, west, north, east } = req.body;

  // Construct the absolute path to the Python script
  const scriptPath = path.join(
    __dirname,
    "..",
    "..",
    "backend",
    "Data_request.py"
  );

  // Construct the command to activate the virtual environment and run the Python script
  // const command = `cd KnowYourHoodEnv\\Scripts && .\\activate && cd - && python "${scriptPath}" ${south} ${west} ${north} ${east}`;
  const command = "dir";
  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send({ error: stderr });
      return;
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
