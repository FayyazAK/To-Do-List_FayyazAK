require('dotenv').config();

module.exports = {

    // NODE ENV
    NODE_ENV: process.env.NODE_ENV || 'development',

    // SERVER CONFIG    
    PORT: process.env.PORT || 8000,

    // JWT CONFIG
    JWT_SECRET: process.env.JWT_SECRET || 'todo-list@fayyaz-ak',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    COOKIE_EXPIRES_IN: Number(process.env.COOKIE_EXPIRES_IN) || 86400000,  

    // DATABASE CONFIG
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'todo_list',

    // ADMIN CREDENTIALS
    ADMIN_FIRST_NAME: process.env.ADMIN_FIRST_NAME || 'Admin',
    ADMIN_LAST_NAME: process.env.ADMIN_LAST_NAME || 'User',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
};

