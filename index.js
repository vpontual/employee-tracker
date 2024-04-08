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
    choices: async (answers) => {
      const departments = await queries.getAllDepartments();
      return departments.map((department) => ({
        name: department.name,
        value: department.id,
      }));
    },
  },
  // {
  //   type: "input",
  //   name: "addemployee",
  //   when: (answers) => answers.welcome === "Add an employee",
  //   choices: ["Add an employee"],
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
      const { newRoleTitle, newRoleSalary } = answers;
      // Prompt for the department ID or name, and get the department ID
      const departmentId = await getDepartmentId(db);
      await db.addRole(newRoleTitle, newRoleSalary, departmentId);
      break;
    case "Quit":
      process.exit(0);
  }

  promptMenu();
}

promptMenu();
