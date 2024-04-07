INSERT INTO department (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),
       ('Salesperson', 80000, 2),
       ('Lead Engineer', 150000, 3),
       ('Software Engineer', 120000, 4),
       ('Account Manager', 160000 , 5),
       ('Accountant', 125000, 6),
       ('Legal Team Lead', 250000, 7),
       ('Lawyer', 190000, 8);

INSERT INTO employee (first_name, last_name, department_id, employee_id)
VALUES ('John', 'Doe', 1),
        ('Mike', 'Chan', 2, 1),
        ('Ashley', 'Rodriguez', 3),
        ('Kevin', 'Tupik', 4, 3),
        ('Kunal', 'Singh', 5),
        ('Malia', 'Brown', 6, 5),
        ('Sarah', 'Lourd', 7),
        ('Tom', 'Allen', 8, 7);
