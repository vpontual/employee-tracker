const pool = require("./server.js");

class queries {
  constructor(pool) {
    this.pool = pool;
  }

  async getAllEmployees() {
    const client = await this.pool.connect();
    const result = await client.query(`
      SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        role.salary AS salary,
        department.name AS department,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM
        employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee as manager ON employee.manager_id = manager.id;`);
    console.table(result.rows);
    client.release();
  }

  // Get all departments
  async getAllDepartments() {
    const client = await this.pool.connect();
    const result = await client.query("SELECT id, name FROM department");
    console.table(result.rows);
    client.release();
  }

  // Get all roles
  // getAllRoles() {
  //   console.log(pool.query("SELECT * FROM role"));
  // }
  // Get all employees

  // Add a department
  // addDepartment(department) {
  // return this.query("INSERT INTO department SET ?", department);

  // }
  // Add a role
  // addRole(role) {
  //   return this.query("INSERT INTO role SET ?", role);
  // }
  // Add an employee
  // addEmployee(employee) {
  //   return this.connection.query("INSERT INTO employee SET ?", employee);
  // }
  // Update an employee's role
  // updateEmployeeRole(employeeId, roleId) {
  //   return this.query("UPDATE employee SET role_id = ? WHERE id = ?", [
  //     roleId,
  //     employeeId,
  //   ]);
}

module.exports = new queries(pool);
