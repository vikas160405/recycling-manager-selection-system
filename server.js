const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'app123';
const DB_NAME = process.env.DB_NAME || 'recycling_system';
const PORT = process.env.PORT || 5000;

// ✅ Pool (fixes crash & scalability)
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

function randomScore() {
  return parseFloat((Math.random() * 5 + 5).toFixed(2));
}

// ✅ Evaluate safely (no duplicates)
app.get('/evaluate', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [candidates] = await conn.query("SELECT id FROM candidates");

    if (candidates.length === 0) {
      return res.send("No candidates found");
    }

    for (const c of candidates) {
      await conn.query(`
        INSERT INTO evaluations
        (candidate_id, crisis_management_score, sustainability_score, team_motivation_score)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          crisis_management_score = VALUES(crisis_management_score),
          sustainability_score = VALUES(sustainability_score),
          team_motivation_score = VALUES(team_motivation_score)
      `, [c.id, randomScore(), randomScore(), randomScore()]);
    }

    await conn.commit();
    res.send("Evaluation completed successfully!");
  } catch (err) {
    if (conn) await conn.rollback();
    console.error(err);
    res.status(500).send("Evaluation failed");
  } finally {
    if (conn) conn.release();
  }
});

// Leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT c.name, r.total_score
      FROM rankings r
      JOIN candidates c ON c.id = r.candidate_id
      ORDER BY r.total_score DESC
      LIMIT 10
    `);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

app.listen(PORT, () => console.log("Server running on port", PORT));
