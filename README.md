Recycling Production Line Manager Selection System
📌 Project Overview

This project is a minimal AI-assisted system designed to rank candidates for a recycling production line manager role.

The system:

Stores candidate profiles in a database

Uses AI-style evaluation prompts to score candidates

Automatically calculates rankings

Displays top candidates in a dashboard

🧠 Features

Candidate database storage

AI-based scoring (Crisis Management, Sustainability, Team Motivation)

Automatic ranking calculation

Leaderboard dashboard

🛠️ Technologies Used

MySQL — Database

Node.js — Backend

Express.js — API server

Faker.js — Fake candidate data

HTML, CSS, JavaScript — Frontend

🤖 AI Evaluation Logic

Each candidate is scored on:

Skill	Description
Crisis Management	Handling industrial emergencies
Sustainability	Knowledge of recycling and eco-practices
Team Motivation	Leadership and team management

Scores are generated (mock AI) and stored in the database. Rankings update automatically.

🗄️ Database Design

Tables:

candidates

evaluations

rankings

A database trigger automatically calculates total score after evaluation.

▶️ How to Run the Project
1️⃣ Setup Database

Run schema.sql in MySQL.

2️⃣ Insert Candidates
node generateCandidates.js

3️⃣ Start Server
node server.js

4️⃣ Open Dashboard

Open index.html in browser.

Click Run AI Evaluation → then Show Leaderboard

📊 Output

The system displays Top 10 ranked candidates based on AI scoring.

🎯 Project Goal

To demonstrate:

Database design

Backend development

AI prompt engineering

Dashboard creation

👨‍💻 Author

Vikas Relangi