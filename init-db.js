import Database from 'better-sqlite3';

const db = new Database('sql_practice.db');

// Create tables with synthetic data
db.exec(`
  DROP TABLE IF EXISTS employees;
  DROP TABLE IF EXISTS departments;
  DROP TABLE IF EXISTS projects;
  DROP TABLE IF EXISTS employee_projects;
  DROP TABLE IF EXISTS salaries;

  CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL
  );

  CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    department_id INTEGER,
    hire_date TEXT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
  );

  CREATE TABLE salaries (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER,
    amount DECIMAL(10,2),
    effective_date TEXT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE projects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    budget DECIMAL(12,2),
    start_date TEXT NOT NULL,
    end_date TEXT
  );

  CREATE TABLE employee_projects (
    employee_id INTEGER,
    project_id INTEGER,
    role TEXT,
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
  );
`);

// Insert synthetic data
const insertDepts = db.prepare('INSERT INTO departments (id, name, location) VALUES (?, ?, ?)');
const departments = [
  [1, 'Engineering', 'San Francisco'],
  [2, 'Marketing', 'New York'],
  [3, 'Sales', 'Chicago'],
  [4, 'HR', 'Austin'],
  [5, 'Finance', 'Boston']
];
departments.forEach(dept => insertDepts.run(...dept));

const insertEmps = db.prepare('INSERT INTO employees (id, name, email, department_id, hire_date) VALUES (?, ?, ?, ?, ?)');
const employees = [
  [1, 'Alice Johnson', 'alice@company.com', 1, '2020-01-15'],
  [2, 'Bob Smith', 'bob@company.com', 1, '2019-03-22'],
  [3, 'Carol White', 'carol@company.com', 2, '2021-06-10'],
  [4, 'David Brown', 'david@company.com', 3, '2018-11-05'],
  [5, 'Eve Davis', 'eve@company.com', 1, '2022-02-28'],
  [6, 'Frank Miller', 'frank@company.com', 4, '2020-07-14'],
  [7, 'Grace Lee', 'grace@company.com', 2, '2019-09-30'],
  [8, 'Henry Wilson', 'henry@company.com', 5, '2021-04-18'],
  [9, 'Ivy Martinez', 'ivy@company.com', 3, '2020-12-01'],
  [10, 'Jack Taylor', 'jack@company.com', 1, '2023-01-10']
];
employees.forEach(emp => insertEmps.run(...emp));

const insertSalaries = db.prepare('INSERT INTO salaries (id, employee_id, amount, effective_date) VALUES (?, ?, ?, ?)');
const salaries = [
  [1, 1, 95000, '2020-01-15'],
  [2, 2, 110000, '2019-03-22'],
  [3, 3, 75000, '2021-06-10'],
  [4, 4, 85000, '2018-11-05'],
  [5, 5, 88000, '2022-02-28'],
  [6, 6, 72000, '2020-07-14'],
  [7, 7, 80000, '2019-09-30'],
  [8, 8, 92000, '2021-04-18'],
  [9, 9, 78000, '2020-12-01'],
  [10, 10, 90000, '2023-01-10']
];
salaries.forEach(sal => insertSalaries.run(...sal));

const insertProjects = db.prepare('INSERT INTO projects (id, name, budget, start_date, end_date) VALUES (?, ?, ?, ?, ?)');
const projects = [
  [1, 'Website Redesign', 150000, '2023-01-01', '2023-06-30'],
  [2, 'Mobile App', 300000, '2023-03-15', null],
  [3, 'Marketing Campaign', 50000, '2023-02-01', '2023-04-30'],
  [4, 'Data Migration', 200000, '2022-11-01', '2023-03-31']
];
projects.forEach(proj => insertProjects.run(...proj));

const insertEmpProj = db.prepare('INSERT INTO employee_projects (employee_id, project_id, role) VALUES (?, ?, ?)');
const empProjects = [
  [1, 1, 'Lead Developer'],
  [2, 1, 'Backend Developer'],
  [5, 2, 'Frontend Developer'],
  [10, 2, 'Mobile Developer'],
  [3, 3, 'Campaign Manager'],
  [7, 3, 'Content Creator'],
  [2, 4, 'Technical Lead'],
  [1, 4, 'Developer']
];
empProjects.forEach(ep => insertEmpProj.run(...ep));

console.log('Database initialized with synthetic data!');
db.close();
