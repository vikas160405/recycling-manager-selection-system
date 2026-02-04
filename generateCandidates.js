// Improved: uses mysql2/promise and proper async/await + error handling
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2/promise');

const skillsPool = [
  "Waste Management",
  "Lean Manufacturing",
  "Safety Compliance",
  "Sustainability Strategy",
  "Team Leadership",
  "Crisis Handling"
];

async function run() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'appuser',
      password: 'app123',
      database: 'recycling_system'
    });
    console.log('Connected to MySQL (promise)');

    const insertSql = 'INSERT INTO candidates (name, experience_years, skills) VALUES (?, ?, ?)';
    for (let i = 0; i < 40; i++) {
      const name = faker.person ? faker.person.fullName() : `${faker.name.firstName()} ${faker.name.lastName()}`;
      const exp = faker.number ? faker.number.int({ min: 2, max: 15 }) : Math.floor(Math.random() * 14) + 2;
      const skills = faker.helpers.arrayElements(skillsPool, 3).join(', ');

      await conn.execute(insertSql, [name, exp, skills]);
    }

    console.log('40 candidates inserted');
  } catch (err) {
    console.error('Error inserting candidates:', err);
    process.exitCode = 1;
  } finally {
    if (conn) {
      await conn.end();
      console.log('MySQL connection closed');
    }
  }
}

run();
