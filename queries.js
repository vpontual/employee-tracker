class queries {
  // Get all departments
  getAllDepartments() {
    return this.query("SELECT * FROM department");
  }
  // Get all roles
  getAllRoles() {
    return this.query("SELECT * FROM role");
  }
  // Get all employees
  getAllEmployees() {
    return this.query("SELECT * FROM employee");
  }
  // Add a department
  addDepartment(department) {
    return this.query("INSERT INTO department SET ?", department);
  }
  // Add a role
  addRole(role) {
    return this.query("INSERT INTO role SET ?", role);
  }
  // Add an employee
  addEmployee(employee) {
    return this.connection.query("INSERT INTO employee SET ?", employee);
  }
  // Update an employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.query("UPDATE employee SET role_id = ? WHERE id = ?", [
      roleId,
      employeeId,
    ]);
  }
}
