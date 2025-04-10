const db = require("../config/database");
const TASK= require("../queries/taskQueries");

class Task {
  static async createTable() {
    try {
      await db.execute(TASK.CREATE_TABLE);
    } catch (error) {
      console.error("Error creating tasks table:", error);
      throw error;
    }
  }

}

module.exports = Task;
