const { faker } = require('@faker-js/faker');
const mysql = require('mysql2/promise');

const skillsPool = [
  "Waste Management","Lean Manufacturing","Safety Compliance",
  "Sustainability Strategy","Team Leadership","Crisis Handling"
];

async function run() {
  const conn = await mysql.createConnection({
    host:'localhost', user:'appuser', password:'app123', database:'recycling_system'
  });

  const sql = 'INSERT INTO candidates (name, experience_years, skills) VALUES (?, ?, ?)';

  for(let i=0;i<40;i++){
    const name = faker.person.fullName();
    const exp = faker.number.int({min:2,max:15});
    const skills = faker.helpers.arrayElements(skillsPool,3).join(', ');
    await conn.execute(sql,[name,exp,skills]);
  }

  console.log("40 candidates inserted");
  await conn.end();
}
run();
