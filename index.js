// Including needed packages for this application
const inquirer = require("inquirer");
const image = require("./assets/image.js");
const queries = require("./queries");

function displayImage() {
  console.log(image);
}

async function getMenuChoices() {
  const departments = await queries.getAllDepartments();
  const roles = await queries.getAllRoles();
  const employees = await queries.getAllEmployees();
  return {
    departmentList: departments.map((department) => department.name),
    roleList: roles.map((role) => role.title),
    employeeList: employees.map(
      (employee) => `${employee.first_name} ${employee.last_name}`
    ),
  };
}

// Function to prompt the user with the questions array
async function promptMenu() {
  menuChoices = await getMenuChoices();

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
        "View all employees by manager",
        "View all employees by department",
        "View the total budget for a department",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee's role",
        "Update an employee's manager",
        "Delete a department",
        "Delete a role",
        "Delete an employee",
        "Quit",
      ],
    },

    // View a department's budget
    {
      when: (answers) =>
        answers.welcome === "View the total budget for a department",
      type: "list",
      name: "departmentName",
      message: "Select the department to calculate the budget:",
      choices: menuChoices.departmentList,
    },

    // Add Department
    {
      when: (answers) => answers.welcome === "Add a department",
      type: "input",
      name: "departmentName",
      message: "What is the name of the department?",
    },

    // Add Role
    {
      when: (answers) => answers.welcome === "Add a role",
      type: "input",
      name: "roleTitle",
      message: "What is the role title?",
    },
    {
      when: (answers) => answers.welcome === "Add a role",
      type: "input",
      name: "roleSalary",
      message: "What is the role salary?",
    },
    {
      when: (answers) => answers.welcome === "Add a role",
      type: "list",
      name: "roleDepartment",
      message: "Select the department that this role belongs to",
      choices: menuChoices.departmentList,
    },

    // Add Employee
    {
      when: (answers) => answers.welcome === "Add an employee",
      type: "input",
      name: "employeeFirstName",
      message: "What is the first name of the employee?",
    },
    {
      when: (answers) => answers.welcome === "Add an employee",
      type: "input",
      name: "employeeLastName",
      message: "What is the last name of the employee?",
    },
    {
      when: (answers) => answers.welcome === "Add an employee",
      type: "list",
      name: "employeeTitle",
      message: "Select the role of this employee",
      choices: menuChoices.roleList,
    },
    {
      when: (answers) => answers.welcome === "Add an employee",
      type: "list",
      name: "employeeManager",
      message: "Select the manager of this employee",
      choices: menuChoices.employeeList,
    },

    // Update an employee's role
    {
      when: (answers) => answers.welcome === "Update an employee's role",
      type: "list",
      name: "employee",
      message: "Select the employee to update the role",
      choices: menuChoices.employeeList,
    },
    {
      when: (answers) => answers.welcome === "Update an employee's role",
      type: "list",
      name: "title",
      message: "Select the new role",
      choices: menuChoices.roleList,
    },

    // Update an employee's manager
    {
      when: (answers) => answers.welcome === "Update an employee's manager",
      type: "list",
      name: "employee",
      message: "Select the employee to update the manager",
      choices: menuChoices.employeeList,
    },
    {
      when: (answers) => answers.welcome === "Update an employee's manager",
      type: "list",
      name: "manager",
      message: "Select the new manager",
      choices: menuChoices.employeeList,
    },

    // Delete a department
    {
      when: (answers) => answers.welcome === "Delete a department",
      type: "list",
      name: "departmentName",
      message: "Select the department to be deleted",
      choices: menuChoices.departmentList,
    },

    // Delete Role
    {
      when: (answers) => answers.welcome === "Delete a role",
      type: "list",
      name: "roleTitle",
      message: "Select the role to be deleted",
      choices: menuChoices.roleList,
    },

    // Delete Employee
    {
      when: (answers) => answers.welcome === "Delete an employee",
      type: "list",
      name: "employee",
      message: "Select the employee to be deleted",
      choices: menuChoices.employeeList,
    },

    // Quit
    {
      type: "confirm",
      name: "confirmQuit",
      when: (answers) => answers.welcome === "Quit",
      message: "Are you sure you want to quit?",
      default: false,
    },
  ];

  const answer = await inquirer.prompt(questions);

  switch (answer.welcome) {
    // Switch statement to call the appropriate method from the queries object based on the user's choice

    case "View all departments":
      // Call the getAllDepartments method from the queries object
      const allDepartments = await queries.getAllDepartments();
      console.table(allDepartments);
      break;

    case "View all roles":
      // Call the getAllRoles method from the queries object
      const allRoles = await queries.getAllRoles();
      console.table(allRoles);
      break;

    case "View all employees":
      // Call the getAllEmployees method from the queries object
      const allEmployees = await queries.getAllEmployees();
      console.table(allEmployees);
      break;

    case "View all employees by manager":
      // Call the getAllEmployees method from the queries object
      const allEmployeesByManager = await queries.getEmployeesByManager();
      console.table(allEmployeesByManager);
      break;

    case "View all employees by department":
      // Call the getAllEmployees method from the queries object
      const allEmployeesByDepartment = await queries.getEmployeesByDepartment();
      console.table(allEmployeesByDepartment);
      break;

    case "View the total budget for a department":
      // Call the getAllEmployees method from the queries object
      const budgetForDepartment = await queries.getDepartmentBudget(
        answer.departmentName
      );
      console.log(
        `The ${answer.departmentName} department budget is $${budgetForDepartment[0].budget}.\n`
      );
      break;

    case "Add a department":
      await queries.addDepartment(answer.departmentName);
      console.log(`${answer.departmentName} added successfully.\n`);
      break;

    case "Add a role":
      await queries.addRole(
        answer.roleTitle,
        answer.roleSalary,
        answer.roleDepartment
      );
      console.log(`${answer.roleTitle} added successfully.\n`);
      break;

    case "Add an employee":
      await queries.addEmployee(
        answer.employeeFirstName,
        answer.employeeLastName,
        answer.employeeTitle,
        answer.employeeManager
      );
      console.log(
        `${answer.employeeFirstName} ${answer.employeeLastName} added successfully.\n`
      );
      break;

    case "Update an employee's role":
      await queries.updateEmployeeRole(answer.employee, answer.title);
      console.log(`${answer.employee}'s role updated successfully.\n`);
      break;

    case "Update an employee's manager":
      await queries.updateEmployeeManager(answer.employee, answer.manager);
      console.log(`${answer.employee}'s manager updated successfully.\n`);
      break;

    case "Delete a department":
      await queries.deleteDepartment(answer.departmentName);
      console.log(`${answer.departmentName} deleted successfully.\n`);
      break;

    case "Delete a role":
      await queries.deleteRole(answer.roleTitle);
      console.log(`${answer.roleTitle} deleted successfully.\n`);
      break;

    case "Delete an employee":
      await queries.deleteEmployee(answer.employee);
      console.log(`${answer.employee} deleted successfully.\n`);
      break;

    case "Quit":
      if (answer.confirmQuit) {
        console.log("Goodbye!");
        process.exit(0);
      }
      break;
  }
  promptMenu();
}

function init() {
  displayImage();
  promptMenu();
}

init();
