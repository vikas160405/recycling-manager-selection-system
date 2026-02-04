CREATE DATABASE IF NOT EXISTS recycling_system;
USE recycling_system;

CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    experience_years INT,
    skills TEXT
);

CREATE TABLE evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT UNIQUE,  -- 🔥 prevents duplicates
    crisis_management_score FLOAT,
    sustainability_score FLOAT,
    team_motivation_score FLOAT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE TABLE rankings (
    candidate_id INT PRIMARY KEY,
    total_score FLOAT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
