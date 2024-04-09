// Dependencies
const { Pool } = require("pg");

// Connect to database
const pool = new Pool({
  user: "postgres",
  password: "",
  host: "localhost",
  database: "employees_db",
});

module.exports = pool;
