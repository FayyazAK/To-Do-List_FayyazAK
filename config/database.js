const mysql = require('mysql2');
const config = require('./env');

// MYSQL DATABASE CONNECTION POOL
const pool = mysql.createPool({
    host: config.DB_HOST || 'localhost',
    user: config.DB_USER || 'root',
    password: config.DB_PASSWORD || '',
    database: config.DB_NAME || 'todo_list',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// MYSQL DATABASE CONNECTION POOL PROMISE
const promisePool = pool.promise();

// TEST THE DATABASE CONNECTION
promisePool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database!');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

module.exports = promisePool;
