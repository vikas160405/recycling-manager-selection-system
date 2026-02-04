const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'appuser',
  password: 'app123',
  database: 'recycling_system'
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Function to generate random AI scores
function randomScore() {
  return (Math.random() * 5 + 5).toFixed(2); // Range 5–10
}

//////////////////////////////////////////////////////////
// 🧠 AI EVALUATION ROUTE
//////////////////////////////////////////////////////////
app.get('/evaluate', (req, res) => {

  db.query("DELETE FROM evaluations", (err) => {
    if (err) return res.status(500).send("Error clearing evaluations");

    db.query("DELETE FROM rankings", (err) => {
      if (err) return res.status(500).send("Error clearing rankings");

      db.query("SELECT id FROM candidates", (err, results) => {
        if (err) return res.status(500).send("Error reading candidates");

        if (results.length === 0) {
          return res.send("No candidates found.");
        }

        let completed = 0;

        results.forEach(c => {
          db.query(
            "INSERT INTO evaluations (candidate_id, crisis_management_score, sustainability_score, team_motivation_score) VALUES (?, ?, ?, ?)",
            [c.id, randomScore(), randomScore(), randomScore()],
            (err) => {
              if (err) return res.status(500).send("Insert error");

              completed++;

              if (completed === results.length) {
                res.send("Evaluation completed!");
              }
            }
          );
        });
      });
    });
  });

});

//////////////////////////////////////////////////////////
// 🏆 LEADERBOARD ROUTE
//////////////////////////////////////////////////////////
app.get('/leaderboard', (req, res) => {
  db.query(`
    SELECT c.name, r.total_score
    FROM rankings r
    JOIN candidates c ON c.id = r.candidate_id
    ORDER BY r.total_score DESC
    LIMIT 10
  `, (err, results) => {
    if (err) return res.status(500).send("Leaderboard error");
    res.json(results);
  });
});

//////////////////////////////////////////////////////////
// 🚀 START SERVER
//////////////////////////////////////////////////////////
app.listen(5000, () => console.log("Server running on port 5000"));
