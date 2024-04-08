const queries = require("./queries");
// Including needed packages for this application
const inquirer = require("inquirer");

// Array of questions for user input
const questions = [
  // Welcome message
  {
    type: "list",
    name: "welcome",
    message: "Welcome to the employee tracker. What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee's role",
      "Update an employee's manager",
      "View employees by manager",
      "View employees by department",
      "Delete departments, roles, and employees",
      "View the total utilized budget of a department",
      "Quit",
    ],
  },
  // Add a department
  {
    type: "input",
    name: "adddepartment",
    when: (answers) => answers.welcome === "Add a department",
    message: "What is the name of the department?",
  },
  // Add a role
  {
    type: "input",
    name: "newRoleTitle",
    when: (answers) => answers.welcome === "Add a role",
    message: "What is the title of the new role?",
  },
  {
    type: "input",
    name: "newRoleSalary",
    when: (answers) => answers.welcome === "Add a role",
    message: "What is the salary for this role?",
    validate: (value) => {
      const valid = !isNaN(parseFloat(value));
      return valid || "Please enter a number for the salary";
    },
  },
  {
    type: "list",
    name: "departmentChoice",
    when: (answers) => answers.welcome === "Add a role",
    message: "Select the department for this role:",
    choices: async () => {
      const departments = await queries.getAllDepartments();
      return departments.map((department) => ({
        name: department.name,
        value: department.id,
      }));
    },
  },
  // Add an employee
  {
    type: "input",
    name: "firstName",
    when: (answers) => answers.welcome === "Add an employee",
    message: "What is the employee's first name?",
  },
  {
    type: "input",
    name: "lastName",
    when: (answers) => answers.welcome === "Add an employee",
    message: "What is the employee's last name?",
  },
  {
    type: "list",
    name: "roleChoice",
    when: (answers) => answers.welcome === "Add an employee",
    message: "Select the employee's role:",
    choices: async () => {
      const roles = await queries.getAllRoles();
      return roles.map((role) => ({
        name: `${role.title} (${role.department})`,
        value: role.id,
      }));
    },
  },
  {
    type: "list",
    name: "managerChoice",
    when: (answers) => answers.welcome === "Add an employee",
    message: "Select the employee's manager (leave blank for no manager):",
    choices: async () => {
      const employees = await queries.getAllEmployees();
      return [
        { name: "No Manager", value: null },
        ...employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      ];
    },
  },
  // Update an employee's role
  {
    type: "list",
    name: "employeeChoice",
    when: (answers) => answers.welcome === "Update an employee's role",
    message: "Select the employee whose role you want to update:",
    choices: async () => {
      const employees = await queries.getAllEmployees();
      return employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name} (${employee.title})`,
        value: employee.id,
      }));
    },
  },
  {
    type: "list",
    name: "newRoleChoice",
    when: (answers) => answers.welcome === "Update an employee's role",
    message: "Select the new role for the employee:",
    choices: async () => {
      const roles = await queries.getAllRoles();
      return roles.map((role) => ({
        name: `${role.title} (${role.department})`,
        value: role.id,
      }));
    },
  },
  // Update an employee's manager
  {
    type: "list",
    name: "employeeChoice",
    when: (answers) => answers.welcome === "Update an employee's manager",
    message: "Select the employee whose manager you want to update:",
    choices: async () => {
      const employees = await queries.getAllEmployees();
      return employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name} (${employee.title})`,
        value: employee.id,
      }));
    },
  },
  {
    type: "list",
    name: "newManagerChoice",
    when: (answers) => answers.welcome === "Update an employee's manager",
    message: "Select the new manager for the employee:",
    choices: async () => {
      const employees = await queries.getAllEmployees();
      const managersWithoutEmployee = employees.filter(
        (employee) => employee.manager === null
      );
      return [
        { name: "No Manager", value: null },
        ...managersWithoutEmployee.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name} (${employee.title})`,
          value: employee.id,
        })),
      ];
    },
  },
  // Delete departments, roles, and employees
  {
    type: "list",
    name: "deleteChoice",
    when: (answers) =>
      answers.welcome === "Delete departments, roles, and employees",
    message: "What would you like to delete?",
    choices: ["Department", "Role", "Employee"],
  },
  {
    type: "list",
    name: "departmentToDelete",
    when: (answers) => answers.deleteChoice === "Department",
    message: "Select the department to delete:",
    choices: async () => {
      const departments = await queries.getAllDepartments();
      const employees = await queries.getAllEmployeesWithRolesAndDepartments();
      return departments
        .filter(
          (department) =>
            !employees.some(
              (employee) => employee.department === department.name
            )
        )
        .map((department) => ({
          name: department.name,
          value: department.id,
        }));
    },
  },
  {
    type: "list",
    name: "roleToDelete",
    when: (answers) => answers.deleteChoice === "Role",
    message: "Select the role to delete:",
    choices: async () => {
      const roles = await queries.getAllRoles();
      const employees = await queries.getAllEmployeesWithRolesAndDepartments();
      return roles
        .filter(
          (role) => !employees.some((employee) => employee.title === role.title)
        )
        .map((role) => ({
          name: `${role.title} (${role.department})`,
          value: role.id,
        }));
    },
  },
  {
    type: "list",
    name: "employeeToDelete",
    when: (answers) => answers.deleteChoice === "Employee",
    message: "Select the employee to delete:",
    choices: async () => {
      const employees = await queries.getAllEmployees();
      return employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name} (${employee.title})`,
        value: employee.id,
      }));
    },
  },
  // {
  //   type: "input",
  //   name: "viewtotalutilizedbudgetofdepartment",
  //   when: (answers) =>
  //     answers.welcome === "View the total utilized budget of a department",
  // },
  {
    type: "confirm",
    name: "confirmQuit",
    when: (answers) => answers.welcome === "Quit",
    message: "Are you sure you want to quit?",
    default: false,
  },
];

async function promptMenu() {
  const answer = await inquirer.prompt(questions);

  switch (answer.welcome) {
    case "View all departments":
      await queries.getAllDepartments();
      break;
    case "View all roles":
      await queries.getAllRoles();
      break;
    case "View all employees":
      await queries.getAllEmployees();
      break;
    case "Add a department":
      await queries.addDepartment(answer.adddepartment);
      break;
    case "Add a role":
      const { newRoleTitle, newRoleSalary, departmentChoice } = answer;
      await queries.addRole(newRoleTitle, newRoleSalary, departmentChoice);
      break;
    case "Add an employee":
      const { firstName, lastName, roleChoice, managerChoice } = answer;
      await queries.addEmployee(firstName, lastName, roleChoice, managerChoice);
      break;
    case "Update an employee's role":
      const { employeeChoice, newRoleChoice } = answer;
      await queries.updateEmployeeRole(employeeChoice, newRoleChoice);
      break;
    case "Quit":
      if (answer.confirmQuit) {
        process.exit(0);
      } else {
        promptMenu();
      }
      break;
    case "Update an employee's manager":
      const { employeeChoice, newManagerChoice } = answer;
      await queries.updateEmployeeManager(employeeChoice, newManagerChoice);
      break;
    case "Delete departments, roles, and employees":
      const {
        deleteChoice,
        departmentToDelete,
        roleToDelete,
        employeeToDelete,
      } = answer;
      if (deleteChoice === "Department") {
        await queries.deleteDepartment(departmentToDelete);
      } else if (deleteChoice === "Role") {
        await queries.deleteRole(roleToDelete);
      } else if (deleteChoice === "Employee") {
        await queries.deleteEmployee(employeeToDelete);
      }
      break;
  }

  promptMenu();
}

promptMenu();
