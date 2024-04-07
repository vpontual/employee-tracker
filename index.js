const queries = require("./queries");
// Including needed packages for this application
const inquirer = require("inquirer");

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
  {
    type: "input",
    name: "adddepartment",
    when: (answers) => answers.welcome === "Add a department",
    message: "What is the name of the department?",
  },
  {
    type: "input",
    name: "addrole",
    when: (answers) => answers.welcome === "Add a role",
    choices: ["Add a role"],
  },
  {
    type: "input",
    name: "addemployee",
    when: (answers) => answers.welcome === "Add an employee",
    choices: ["Add an employee"],
  },
  {
    type: "input",
    name: "updateemployeerole",
    when: (answers) => answers.welcome === "Update an employee's role",
  },
  {
    type: "input",
    name: "updateemployeemanager",
    when: (answers) => answers.welcome === "Update an employee's manager",
  },
  {
    type: "input",
    name: "deletedepartmentsrolesandemployees",
    when: (answers) =>
      answers.welcome === "Delete departments, roles, and employees",
  },
  {
    type: "input",
    name: "viewtotalutilizedbudgetofdepartment",
    when: (answers) =>
      answers.welcome === "View the total utilized budget of a department",
  },
  {
    type: "confirm",
    name: "Are you sure you want to quit?",
    default: false,
    when: (answers) => answers.welcome === "Quit",
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
    case "Quit":
      process.exit(0);
  }

  promptMenu();
}

promptMenu();
