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
  console.log(`Connected to the employees_db database.`)
);

pool.connect();

// const getAllDepartments = async () => {
//   const { rows } = await pool.query("SELECT id, name FROM department");
//   return rows;
// };

// const getAllRoles = async () => {
//   const { rows } = await pool.query(
//     "SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id"
//   );
//   return rows;
// };

// const getAllEmployees = async () => {
//   const { rows } = await pool.query(
//     'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id'
//   );
//   return rows;
// };

// const addDepartment = async (name) => {
//   await pool.query("INSERT INTO department (name) VALUES ($1)", [name]);
// };

// const addRole = async (title, salary, departmentId) => {
//   await pool.query(
//     "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
//     [title, salary, departmentId]
//   );
// };

// const addEmployee = async (firstName, lastName, roleId, managerId) => {
//   await pool.query(
//     "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
//     [firstName, lastName, roleId, managerId || null]
//   );
// };

// const updateEmployeeRole = async (employeeId, roleId) => {
//   await pool.query("UPDATE employee SET role_id = $1 WHERE id = $2", [
//     roleId,
//     employeeId,
//   ]);
// };

// Initialization
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
