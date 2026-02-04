const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'appuser',
  password: 'app123',
  database: 'recycling_system'
});

const skillsPool = [
  "Waste Management",
  "Lean Manufacturing",
  "Safety Compliance",
  "Sustainability Strategy",
  "Team Leadership",
  "Crisis Handling"
];

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL");

  for (let i = 0; i < 40; i++) {
    const name = faker.person.fullName();
    const exp = faker.number.int({ min: 2, max: 15 });
    const skills = faker.helpers.arrayElements(skillsPool, 3).join(", ");

    db.query(
      "INSERT INTO candidates (name, experience_years, skills) VALUES (?, ?, ?)",
      [name, exp, skills]
    );
  }

  console.log("40 Candidates Inserted!");
  db.end();
});
