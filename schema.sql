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

DELIMITER $$

CREATE TRIGGER update_ranking
AFTER INSERT ON evaluations
FOR EACH ROW
BEGIN
  REPLACE INTO rankings (candidate_id, total_score)
  VALUES (NEW.candidate_id,
          NEW.crisis_management_score +
          NEW.sustainability_score +
          NEW.team_motivation_score);
END$$

CREATE TRIGGER update_ranking_update
AFTER UPDATE ON evaluations
FOR EACH ROW
BEGIN
  REPLACE INTO rankings (candidate_id, total_score)
  VALUES (NEW.candidate_id,
          NEW.crisis_management_score +
          NEW.sustainability_score +
          NEW.team_motivation_score);
END$$

DELIMITER ;

CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'app123';
GRANT ALL PRIVILEGES ON recycling_system.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;

