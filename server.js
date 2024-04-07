// Dependencies
const express = require("express");
const { Pool } = require("pg");

// App/Port
const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool(
  {
    user: "postgres",
    password: "",
    host: "localhost",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`),
);

pool.connect();

//GET request to the /api/departments route renders a list of all departments.

app.get("/api/department", (req, res) => {
  pool.query("SELECT * FROM department", function (err, { rows }) {
    console.log(rows);
    res.json(rows);
  });
});

//GET request to the /api/roles route renders a list of all roles.

app.get("/api/role", (req, res) => {
  pool.query("SELECT * FROM role", function (err, { rows }) {
    console.log(rows);
    res.json(rows);
  });
});

//GET request to the /api/employees route renders a list of all employees.

app.get("/api/employee", (req, res) => {
  pool.query("SELECT * FROM employee", function (err, { rows }) {
    console.log(rows);
    res.json(rows);
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Initialization
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
