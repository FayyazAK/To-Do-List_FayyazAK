/**
 * SQL Queries for Task model
 */

module.exports = {
  // Table creation query
  CREATE_TABLE: `
    CREATE TABLE IF NOT EXISTS tasks (
      task_id INT AUTO_INCREMENT PRIMARY KEY,
      list_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      priority_id INT,
      due_date DATETIME,
      is_completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (list_id) REFERENCES lists(list_id) ON DELETE CASCADE,
      FOREIGN KEY (priority_id) REFERENCES priorities(priority_id) ON DELETE SET NULL
    )
  `,
  
 
};
