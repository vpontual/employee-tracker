const pool = require("./server.js");

class queries {
  constructor(pool) {
    this.pool = pool;
  }
  // Get all employees
  async getAllEmployees() {
    const client = await this.pool.connect();
    try {
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
      return result.rows;
    } catch (err) {
      console.error("Error getting employees:", err);
      return []; // Return an empty array if there's an error
    } finally {
      client.release();
    }
  }

  // Get all departments
  async getAllDepartments() {
    const client = await this.pool.connect();
    try {
      const result = await client.query("SELECT * FROM department");
      return result.rows;
    } catch (err) {
      console.error("Error getting departments:", err);
      throw err;
    } finally {
      client.release();
    }
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
    try {
      const result = await client.query(
        `INSERT INTO department (name) VALUES ($1) RETURNING id;`,
        [name]
      );
      return result.rows[0];
    } catch (err) {
      console.error("Error adding department:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  // Add a role
  async addRole(title, salary, departmentId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING id;`,
        [title, salary, departmentId]
      );
      return result.rows[0].id;
    } catch (err) {
      console.error("Error adding role:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  // Add an employee
  async addEmployee(firstName, lastName, roleId, roleSalary, managerId) {
    const client = await this.pool.connect();
    try {
      await client.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id, salary) VALUES ($1, $2, $3, $4, $5)",
        [firstName, lastName, roleId, managerId || null, roleSalary]
      );
    } catch (err) {
      console.error("Error adding employee:", err);
      throw err;
    } finally {
      client.release();
    }
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

  // Get all employees by department
  async getDepartmentIdByRoleTitle(roleTitle) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `SELECT department_id FROM role WHERE title = $1`,
        [roleTitle]
      );
      if (result.rows.length === 0) {
        console.log(
          `No department found for role ${roleTitle}. Please add a department first.`
        );
        return null;
      }
      return result.rows[0].department_id;
    } catch (err) {
      console.error("Error getting department ID by role title:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  // Get all employees by manager
  async getRoleIdByTitle(roleTitle) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `SELECT id FROM role WHERE title = $1`,
        [roleTitle]
      );
      if (result.rows.length === 0) {
        console.log(
          `No role found with title ${roleTitle}. Creating a new role.`
        );
        return null;
      }
      return result.rows[0].id;
    } catch (err) {
      console.error("Error getting role ID by title:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  // Delete a department, employee, or role
  async getAllEmployeesWithRolesAndDepartments() {
    const client = await this.pool.connect();
    const result = await client.query(`
      SELECT
        e.id, e.first_name, e.last_name, r.title, d.name AS department
      FROM
        employee e
      JOIN
        role r ON e.role_id = r.id
      JOIN
        department d ON r.department_id = d.id;
    `);
    client.release();
    return result.rows;
  }

  // Get all employees by department
  async getSalaryByRoleTitle(roleTitle) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `SELECT salary FROM role WHERE title = $1`,
        [roleTitle]
      );
      if (result.rows.length === 0) {
        console.error(`No role found with title ${roleTitle}`);
        return null;
      }
      return result.rows[0].salary;
    } catch (err) {
      console.error("Error getting salary by role title:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  // Delete a department
  async deleteDepartment(departmentId) {
    const client = await this.pool.connect();
    await client.query("DELETE FROM department WHERE id = $1", [departmentId]);
    client.release();
  }

  // Delete a role
  async deleteRole(roleId) {
    const client = await this.pool.connect();
    await client.query("DELETE FROM role WHERE id = $1", [roleId]);
    client.release();
  }

  // Delete an employee
  async deleteEmployee(employeeId) {
    const client = await this.pool.connect();
    await client.query("DELETE FROM employee WHERE id = $1", [employeeId]);
    client.release();
  }

  // View the total utilized budget of a department
  async getTotalUtilizedBudgetByDepartment() {
    const client = await this.pool.connect();
    const result = await client.query(`
      SELECT
        d.name AS department,
        SUM(r.salary) AS total_budget
      FROM
        employee e
      JOIN
        role r ON e.role_id = r.id
      JOIN
        department d ON r.department_id = d.id
      GROUP BY
        d.name;
    `);
    client.release();
    return result.rows;
  }
}

module.exports = new queries(pool);
