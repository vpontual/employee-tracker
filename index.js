// Including needed packages for this application
const inquirer = require("inquirer");
const image = require;
("./assets/image.js");
const queries = require("./queries");

function displayImage() {
  console.log(image);
}

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
      " Add a department",
      " Add a role",
      " Add an employee",
      " Update an employee's role",
      " Update an employee's manager",
      " View employees by manager",
      " View employees by department",
      " Delete departments, roles, and employees",
      " View the total utilized budget of a department",
      " Quit",
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
      const departmentChoices = departments.rows.map((department) => ({
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
    type: "input",
    name: "roleTitle",
    when: (answers) => answers.welcome === "Add an employee",
    message: "Enter the title of the employee's role:",
  },
  {
    type: "list",
    name: "managerChoice",
    when: (answers) => answers.welcome === "Add an employee",
    message: "Select the employee's manager (leave blank for no manager):",
    choices: async () => {
      const employees = await queries.getAllEmployees();
      if (employees.length === 0) {
        return [{ name: "No employees available", value: null }];
      }
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
    name: "managerEmployeeChoice",
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

  // View total utilized budget by department
  {
    type: "list",
    name: "departmentChoice",
    when: (answers) =>
      answers.welcome === "View the total utilized budget by department",
    message: "Select the department to view the total utilized budget:",
    choices: async () => {
      const departments = await Queries.getAllDepartments();
      return departments.map((department) => ({
        name: department.name,
        value: department.name,
      }));
    },
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

// Function to prompt the user with the questions array
async function promptMenu() {
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

    // case "Add a department":
    // Call the addDepartment method from the queries object
    //   await queries.addDepartment(answer.adddepartment);
    //   break;

    // case "Add a role":
    // Call the addRole method from the queries object
    //   const { newRoleTitle, newRoleSalary, departmentChoice } = answer;
    //   await queries.addRole(newRoleTitle, newRoleSalary, departmentChoice);
    //   break;

    // case "Add an employee":
    //   // Call the addEmployee method from the queries object
    //   const { firstName, lastName, roleTitle, managerChoice } = answer;
    //   let newDepartmentChoice, roleChoice, roleSalary;
    //   roleChoice = await queries.getRoleIdByTitle(roleTitle);
    //   if (!roleChoice) {
    //     const { departmentId, salary } = await inquirer.prompt([
    //       {
    //         type: "list",
    //         name: "departmentId",
    //         message: `No department found for role "${roleTitle}". Please select a department:`,
    //         choices: async () => {
    //           const departments = await queries.getAllDepartments();
    //           return departments.map((department) => ({
    //             name: department.name,
    //             value: department.id,
    //           }));
    //         },
    //       },
    //       {
    //         type: "input",
    //         name: "salary",
    //         message: "Please enter the salary for this role:",
    //         validate: (value) => {
    //           const valid = !isNaN(parseFloat(value));
    //           return valid || "Please enter a number for the salary";
    //         },
    //       },
    //     ]);
    //     newDepartmentChoice = departmentId;
    //     roleSalary = parseFloat(salary);
    //     roleChoice = await queries.addRole(
    //       roleTitle,
    //       roleSalary,
    //       newDepartmentChoice
    //     );
    //   } else {
    //     newDepartmentChoice = await queries.getDepartmentIdByRoleTitle(
    //       roleTitle
    //     );
    //     roleSalary = await queries.getSalaryByRoleTitle(roleTitle);
    //   }
    //   await queries.addEmployee(
    //     firstName,
    //     lastName,
    //     roleChoice,
    //     roleSalary,
    //     managerChoice
    //   );
    //   break;

    // case "Update an employee's role":
    //   // Call the updateEmployeeRole method from the queries object
    //   const { employeeChoice, newRoleChoice } = answer;
    //   await queries.updateEmployeeRole(employeeChoice, newRoleChoice);
    //   break;

    // Quit the application
    // case "Quit":
    //   if (answer.confirmQuit) {
    //     process.exit(0);
    //   } else {
    //     promptMenu();
    //   }
    //   break;

    // case "Update an employee's manager":
    //   // Call the updateEmployeeManager method from the queries object
    //   const { managerEmployeeChoice, newManagerChoice } = answer;
    //   await queries.updateEmployeeManager(
    //     managerEmployeeChoice,
    //     newManagerChoice
    //   );
    //   break;

    // case "Delete departments, roles, and employees":
    //   // Call the deleteDepartment, deleteRole, or deleteEmployee method from the queries object
    //   const {
    //     deleteChoice,
    //     departmentToDelete,
    //     roleToDelete,
    //     employeeToDelete,
    //   } = answer;
    //   if (deleteChoice === "Department") {
    //     await queries.deleteDepartment(departmentToDelete);
    //   } else if (deleteChoice === "Role") {
    //     await queries.deleteRole(roleToDelete);
    //   } else if (deleteChoice === "Employee") {
    //     await queries.deleteEmployee(employeeToDelete);
    //   }
    //   break;

    // case "View the total utilized budget by department":
    //   // Call the getTotalUtilizedBudgetByDepartment method from the queries object
    //   const budgets = await queries.getTotalUtilizedBudgetByDepartment();
    //   console.log("Total Utilized Budget by Department:");
    //   budgets.forEach((budget) => {
    //     console.log(`${budget.department}: $${budget.total_budget}`);
    //   });
    //   break;
  }

  promptMenu();
}

function init() {
  displayImage();
  promptMenu();
}

init();
