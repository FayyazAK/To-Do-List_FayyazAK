const db = require("../config/database");
const PRIORITY = require("../queries/priorityQueries");

class Priority {
  static async createTable() {
    try {
      await db.execute(PRIORITY.CREATE_TABLE);
    } catch (error) {
      console.error("Error creating priorities table:", error);
      throw error;
    }
  }

  static async initializePriorities() {
    try {
      await db.execute(PRIORITY.INITIALIZE_PRIORITIES);
      console.log("Priority levels initialized successfully");
    } catch (error) {
      console.error("Error initializing priority levels:", error);
      throw error;
    }
  }

}

module.exports = Priority;
