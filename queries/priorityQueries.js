/**
 * SQL Queries for Priority model
 */

module.exports = {
  // Table creation query
  CREATE_TABLE: `
    CREATE TABLE IF NOT EXISTS priorities (
      priority_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(20) NOT NULL,
      level INT NOT NULL UNIQUE
    )
  `,
  
  // Initialize priorities
  INITIALIZE_PRIORITIES: `
    INSERT IGNORE INTO priorities (name, level) VALUES 
    ('Low', 1),
    ('Medium', 2),
    ('High', 3),
    ('Urgent', 4)
  `,

};
