const User = require("../models/User");
const List = require("../models/List");
const Priority = require("../models/Priority");
const Task = require("../models/Task");

async function initializeDatabase() {
  try {
    // Create tables in the correct order to handle foreign key dependencies
    await User.createTable();
    await Priority.createTable();
    await List.createTable();
    await Task.createTable();

    // Initialize admin user
    await User.initializeAdmin();

    // Initialize priority levels
    await Priority.initializePriorities();

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

module.exports = initializeDatabase;
