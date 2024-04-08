const pool = require("./server.js");

class queries {
  constructor(pool) {
    this.pool = pool;
  }
  // Get all employees
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
    return result.rows;
    client.release();
  }

  // Get all roles
  async getAllRoles() {
    const client = await this.pool.connect();
    const result = await client.query(`
      SELECT
        role.id,
        role.title,
        department.name AS department,
        role.salary
      FROM
        role
        JOIN department ON role.department_id = department.id;
    `);
    console.table(result.rows);
    client.release();
  }
  // Add a department
  async addDepartment(name) {
    const client = await this.pool.connect();
    await client.query(`INSERT INTO department (name) VALUES ($1);`, [name]);
    client.release();
  }
  // Add a role
  async addRole(title, salary, departmentId) {
    const client = await this.pool.connect();
    await client.query(
      `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);`,
      [title, salary, departmentId]
    );
    client.release();
  }
  // Add an employee
  async addEmployee(firstName, lastName, roleId, managerId) {
    const client = await this.pool.connect();
    await client.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
      [firstName, lastName, roleId, managerId || null]
    );
    client.release();
  }
  // Update an employee's role
  async updateEmployeeRole(employeeId, roleId) {
    const client = await this.pool.connect();
    await client.query("UPDATE employee SET role_id = $1 WHERE id = $2", [
      roleId,
      employeeId,
    ]);
    client.release();
  }
  async updateEmployeeManager(employeeId, managerId) {
    const client = await this.pool.connect();
    await client.query("UPDATE employee SET manager_id = $1 WHERE id = $2", [
      managerId,
      employeeId,
    ]);
    client.release();
  }
}

module.exports = new queries(pool);
