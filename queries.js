const pool = require("./server.js");

class queries {
  // Generic function to execute the sql queries
  static async executeQuery(sql, params = []) {
    const client = await pool.connect();
    try {
      const res = await client.query(sql, params);
      return res.rows;
    } catch (err) {
      console.error("Error executing query:", err);
      return -1;
    } finally {
      client.release();
    }
  }

  // Get all employees
  async getAllEmployees() {
    return this.executeQuery(`
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
  }

  // Get all departments
  async getAllDepartments() {
    return this.executeQuery(`
      SELECT 
        * 
      FROM 
        department`);
  }

  // Get all roles
  async getAllRoles() {
    return this.executeQuery(`
      SELECT
        role.id,
        role.title,
        department.name AS department,
        role.salary
      FROM
        role
        JOIN department ON role.department_id = department.id;
    `);
  }

  // Get all employees by manager
  async getEmployeesByManager() {
    return this.executeQuery(`
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
          LEFT JOIN employee as manager ON employee.manager_id = manager.id
        ORDER BY manager;`);
  }

  // Get all employees by department
  async getEmployeesByDepartment() {
    return this.executeQuery(`
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
          LEFT JOIN employee as manager ON employee.manager_id = manager.id
        ORDER BY department;`);
  }

  // Add a department
  async addDepartment(name) {
    return this.executeQuery(
      `
    INSERT INTO
      department (name) 
    VALUES 
      ($1);`,
      [name]
    );
  }

  // Add a role
  async addRole(title, salary, department) {
    departmentId = await this.executeQuery(
      "SELECT id FROM department WHERE name = $1;",
      [department]
    );
    return this.executeQuery(
      "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);",
      [title, salary, departmentId]
    );
  }

  // TODO RP
  // updateEmployeeManager
  // updateEmployeeRole
  // addEmployee
  // addRole
  // deleteRole
  // deleteDepartment

  // Add an employee
  // async addEmployee(firstName, lastName, roleId, roleSalary, managerId) {
  //   const client = await this.pool.connect();
  //   try {
  //     await client.query(
  //       "INSERT INTO employee (first_name, last_name, role_id, manager_id, salary) VALUES ($1, $2, $3, $4, $5)",
  //       [firstName, lastName, roleId, managerId || null, roleSalary]
  //     );
  //   } catch (err) {
  //     console.error("Error adding employee:", err);
  //     throw err;
  //   } finally {
  //     client.release();
  //   }
  // }

  // Update an employee's role
  // async updateEmployeeRole(employeeId, roleId) {
  //   const client = await this.pool.connect();
  //   await client.query("UPDATE employee SET role_id = $1 WHERE id = $2", [
  //     roleId,
  //     employeeId,
  //   ]);
  //   client.release();
  // }

  // Update an employee's manager
  // async updateEmployeeManager(employeeId, managerId) {
  //   const client = await this.pool.connect();
  //   await client.query("UPDATE employee SET manager_id = $1 WHERE id = $2", [
  //     managerId,
  //     employeeId,
  //   ]);
  //   client.release();
  // }


  // Delete a department
  // async deleteDepartment(departmentId) {
  //   const client = await this.pool.connect();
  //   await client.query("DELETE FROM department WHERE id = $1", [departmentId]);
  //   client.release();
  }

  // Delete a role
  // async deleteRole(roleId) {
  //   const client = await this.pool.connect();
  //   await client.query("DELETE FROM role WHERE id = $1", [roleId]);
  //   client.release();
  // }

  // Delete an employee
  async deleteEmployee(employee) {
    const [firstName, lastName] = employee.split(" ");
    return this.executeQuery(
      "DELETE FROM employee WHERE first_name = $1 AND last_name = $2",
      [firstName, lastName]
    );
  }

  // View the total utilized budget of a department
  async getDepartmentBudget(name) {
    return this.executeQuery(
      `
      SELECT
        department.name,
        SUM(role.salary) AS budget
      FROM
        employee
      JOIN
        role ON employee.role_id = role.id
      JOIN
        department ON role.department_id = department.id
      WHERE 
        department.name = ($1)
      GROUP BY 
        department.name`,
      [name]
    );
  }
}

module.exports = new queries();
