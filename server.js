const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'appuser',
  password: 'app123',
  database: 'recycling_system'
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

function randomScore() {
  return (Math.random() * 5 + 5).toFixed(2); // Scores between 5–10
}

// Evaluate candidates
app.get('/evaluate', (req, res) => {
  db.query("SELECT id FROM candidates", (err, results) => {
    if (err) return res.status(500).send("DB Error");

    let completed = 0;

    results.forEach(c => {
      db.query(
        "INSERT INTO evaluations (candidate_id, crisis_management_score, sustainability_score, team_motivation_score) VALUES (?, ?, ?, ?)",
        [c.id, randomScore(), randomScore(), randomScore()],
        (err) => {
          if (err) console.log(err);
          completed++;

          // When all inserts finish
          if (completed === results.length) {
            res.send("Evaluation completed!");
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
    if (err) throw err;
    res.json(results);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
