# Employee Tracker

## The Task

This is a command-line application that manages a company's employee database, using Node.js, Inquirer, and PostgreSQL.

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

## Video

The following video shows the application in action:
https://youtu.be/Wg0o76w54j0

## Database Details

The schema contains the following three tables:

- `department`

  - `id`: `SERIAL PRIMARY KEY`

  - `name`: `VARCHAR(30) UNIQUE NOT NULL` to hold department name

- `role`

  - `id`: `SERIAL PRIMARY KEY`

  - `title`: `VARCHAR(30) UNIQUE NOT NULL` to hold role title

  - `salary`: `DECIMAL NOT NULL` to hold role salary

  - `department_id`: `INTEGER NOT NULL` to hold reference to department role belongs to

- `employee`

  - `id`: `SERIAL PRIMARY KEY`

  - `first_name`: `VARCHAR(30) NOT NULL` to hold employee first name

  - `last_name`: `VARCHAR(30) NOT NULL` to hold employee last name

  - `role_id`: `INTEGER NOT NULL` to hold reference to employee role

  - `manager_id`: `INTEGER` to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)

## Bonus

The app also supports the following bonus functionality:

- Update employee managers.

- View employees by manager.

- View employees by department.

- Delete departments, roles, and employees.

- View the total utilized budget of a department
