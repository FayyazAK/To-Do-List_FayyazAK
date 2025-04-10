const db = require("../config/database");
const config = require("../config/env");
const { hashPassword } = require("../utils/userUtils");
const USER = require("../queries/userQueries");

class User {
  static async createTable() {
    try {
      await db.execute(USER.CREATE_TABLE);
    } catch (error) {
      console.error("Error creating users table:", error);
      throw error;
    }
  }

  static async initializeAdmin() {
    try {
      const hashedPassword = await hashPassword(config.ADMIN_PASSWORD);
      const [result] = await db.execute(
        USER.CREATE_ADMIN,
        [config.ADMIN_FIRST_NAME, config.ADMIN_LAST_NAME, config.ADMIN_USERNAME, config.ADMIN_EMAIL, hashedPassword, "admin"]
      );  
    } catch (error) {
      console.error("Error initializing admin user:", error);
      throw error;
    }
  }
  
  static async create({ firstName, lastName, username, email, password }) {
    const [result] = await db.execute(
      USER.CREATE_USER,
      [firstName, lastName || null, username, email, password]
    );
    return result.insertId;
  }

  static async find() {
    const [rows] = await db.execute(USER.FIND_ALL_USERS);
    return rows;
  }

  static async findByUsername(username) {
    const [rows] = await db.execute(USER.FIND_BY_USERNAME, [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(USER.FIND_BY_EMAIL, [email]);
    return rows[0];
  }

  static async findById(userId) {
    const [rows] = await db.execute(USER.FIND_BY_ID, [userId]);
    return rows[0];
  }

  static async update(userId, { firstName, lastName, username, email, password }) {
    await db.execute(
      USER.UPDATE_USER,
      [firstName, lastName, username, email, password, userId]
    );
  }

  static async delete(userId) {
    await db.execute(USER.DELETE_USER, [userId]);
  }
}

module.exports = User;
