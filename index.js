// Including needed packages for this application
const inquirer = require("inquirer");

const server = require("./server");

// Array of questions for user input
const questions = [
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
];
// {
//   type: "input",
//   name: "viewalldepartments",
//   when: (answers) => answers.welcome === "View all departments",
// },
// {
//   type: "input",
//   name: "viewallroles",
//   when: (answers) => answers.welcome === "View all roles",
// },
// {
//   type: "input",
//   name: "viewallemployees",
//   when: (answers) => answers.welcome === "View all employees",
// },
// {
//   type: "input",
//   name: "adddepartment",
//   when: (answers) => answers.welcome === "Add a department",
// },
// {
//   type: "input",
//   name: "addrole",
//   when: (answers) => answers.welcome === "Add a role",
// },
// {
//   type: "input",
//   name: "addemployee",
//   when: (answers) => answers.welcome === "Add an employee",
// },
// {
//   type: "input",
//   name: "updateemployeerole",
//   when: (answers) => answers.welcome === "Update an employee's role",
// },
// {
//   type: "input",
//   name: "updateemployeemanager",
//   when: (answers) => answers.welcome === "Update an employee's manager",
// },
// {
//   type: "input",
//   name: "viewemployeesbymanager",
//   when: (answers) => answers.welcome === "View employees by manager",
// },
// {
//   type: "input",
//   name: "viewemployeesbydepartment",
//   when: (answers) => answers.welcome === "View employees by department",
// },
// {
//   type: "input",
//   name: "deletedepartmentsrolesandemployees",
//   when: (answers) =>
//     answers.welcome === "Delete departments, roles, and employees",
// },
// {
//   type: "input",
//   name: "viewtotalutilizedbudgetofdepartment",
//   when: (answers) =>
//     answers.welcome === "View the total utilized budget of a department",
// },
// {
//   type: "confirm",
//   name: "Are you sure you want to quit?",
//   default: false,
//   when: (answers) => answers.welcome === "Quit",
// },

async function promptMenu() {
  const { welcome } = await inquirer.prompt(questions);
  switch (welcome) {
    case "View all departments":
      const departments = await server.getAllDepartments();
      console.table(departments);
      break;
    case "View all roles":
      const roles = await server.getAllRoles();
      console.table(roles);
      break;
    case "View all employees":
      const employees = await server.getAllEmployees();
      console.table(employees);
      break;
    case "Add a department":
      const departmentName = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Enter the department name:",
        },
      ]);
      await server.addDepartment(departmentName.name);
      console.log(`Department "${departmentName.name}" added successfully!`);
      break;
    case "Quit":
      process.exit(0);
  }

  promptMenu();
}

promptMenu();
