// Dependencies
const express = require("express");
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

module.exports = pool; // pool.connect();

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
