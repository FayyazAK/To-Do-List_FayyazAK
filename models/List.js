const db = require("../config/database");
const LIST = require("../queries/listQueries");

class List {
  static async createTable() {
    try {
      await db.execute(LIST.CREATE_TABLE);
    } catch (error) {
      console.error("Error creating lists table:", error);
      throw error;
    }
  }


}

module.exports = List;
