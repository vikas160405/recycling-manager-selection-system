const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'app123';
const DB_NAME = process.env.DB_NAME || 'recycling_system';
const PORT = process.env.PORT || 5000;

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
    // Exit so the process doesn't run in a broken state
    process.exit(1);
  }
  console.log("Connected to MySQL");
});

function randomScore() {
  // return a number between 5.00 and 10.00 with 2 decimal places
  return parseFloat((Math.random() * 5 + 5).toFixed(2));
}

// Evaluate candidates
app.get('/evaluate', (req, res) => {
  db.query("SELECT id FROM candidates", (err, results) => {
    if (err) {
      console.error('DB SELECT error:', err);
      return res.status(500).send("DB Error");
    }

    if (!results || results.length === 0) {
      return res.status(200).send("No candidates found");
    }

    let completed = 0;
    let hadInsertError = false;

    results.forEach(c => {
      db.query(
        "INSERT INTO evaluations (candidate_id, crisis_management_score, sustainability_score, team_motivation_score) VALUES (?, ?, ?, ?)",
        [c.id, randomScore(), randomScore(), randomScore()],
        (err) => {
          if (err) {
            hadInsertError = true;
            console.error('DB INSERT error for candidate', c.id, err);
          }
          completed++;

          // When all inserts finish
          if (completed === results.length) {
            if (hadInsertError) {
              return res.status(500).send("Some evaluations failed to insert (check server logs).");
            }
            return res.send("Evaluation completed!");
          }
        }
      );
    });
  });
});

// Leaderboard
app.get('/leaderboard', (req, res) => {
  db.query(`
    SELECT c.name, r.total_score
    FROM rankings r
    JOIN candidates c ON c.id = r.candidate_id
    ORDER BY r.total_score DESC
    LIMIT 10
  `, (err, results) => {
    if (err) {
      console.error('DB leaderboard error:', err);
      return res.status(500).send("DB Error");
    }
    res.json(results);
  });
});

app.listen(PORT, () => console.log("Server running on port", PORT));
