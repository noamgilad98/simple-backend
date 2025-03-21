require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

pool.connect()
  .then(() => console.log("PostgreSQL Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]);
    res.status(201).send("User registered");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
    if (result.rows.length > 0) {
      res.send("Login successful");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

app.listen(5001, () => console.log("Server running on port 5001"));
