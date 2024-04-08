// Dependencies
const { Pool } = require("pg");

// Connect to database
const pool = new Pool(
  {
    user: "postgres",
    password: "",
    host: "localhost",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

module.exports = pool;
