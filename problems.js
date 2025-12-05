export const problems = [
  // EASY - Basic SELECT and WHERE
  {
    id: 1,
    title: "List All Employees",
    difficulty: "easy",
    description: "Write a query to select all employees with their names and emails.",
    expectedColumns: ["name", "email"],
    solution: "SELECT name, email FROM employees"
  },
  {
    id: 2,
    title: "Count Employees",
    difficulty: "easy",
    description: "Write a query to count the total number of employees.",
    expectedColumns: ["count"],
    solution: "SELECT COUNT(*) as count FROM employees"
  },
  {
    id: 3,
    title: "Departments in New York",
    difficulty: "easy",
    description: "Find all departments located in New York.",
    expectedColumns: ["name", "location"],
    solution: "SELECT name, location FROM departments WHERE location = 'New York'"
  },
  {
    id: 4,
    title: "High Earners",
    difficulty: "easy",
    description: "Find all employees with a salary greater than 90000. Show name and salary amount, ordered by salary descending.",
    expectedColumns: ["name", "salary"],
    solution: `SELECT e.name, s.amount as salary
               FROM employees e
               JOIN salaries s ON e.id = s.employee_id
               WHERE s.amount > 90000
               ORDER BY salary DESC`
  },
  {
    id: 5,
    title: "Engineering Department",
    difficulty: "easy",
    description: "List all employees in the Engineering department. Show employee name and email.",
    expectedColumns: ["name", "email"],
    solution: `SELECT e.name, e.email
               FROM employees e
               JOIN departments d ON e.department_id = d.id
               WHERE d.name = 'Engineering'`
  },
  
  // MEDIUM - JOINs, GROUP BY, Aggregations
  {
    id: 6,
    title: "Employees with Departments",
    difficulty: "medium",
    description: "List all employees with their department names. Include employee name, email, and department name.",
    expectedColumns: ["name", "email", "department_name"],
    solution: `SELECT e.name, e.email, d.name as department_name 
               FROM employees e 
               JOIN departments d ON e.department_id = d.id`
  },
  {
    id: 7,
    title: "Average Salary by Department",
    difficulty: "medium",
    description: "Calculate the average salary for each department. Show department name and average salary, ordered by average salary descending.",
    expectedColumns: ["department_name", "avg_salary"],
    solution: `SELECT d.name as department_name, AVG(s.amount) as avg_salary
               FROM departments d
               JOIN employees e ON d.id = e.department_id
               JOIN salaries s ON e.id = s.employee_id
               GROUP BY d.name
               ORDER BY avg_salary DESC`
  },
  {
    id: 8,
    title: "Employees Hired in 2020",
    difficulty: "medium",
    description: "Find all employees hired in 2020 with their current salary.",
    expectedColumns: ["name", "hire_date", "salary"],
    solution: `SELECT e.name, e.hire_date, s.amount as salary
               FROM employees e
               JOIN salaries s ON e.id = s.employee_id
               WHERE e.hire_date LIKE '2020%'`
  },
  {
    id: 9,
    title: "Department Employee Count",
    difficulty: "medium",
    description: "Count the number of employees in each department. Show department name and employee count, ordered by count descending.",
    expectedColumns: ["department_name", "employee_count"],
    solution: `SELECT d.name as department_name, COUNT(e.id) as employee_count
               FROM departments d
               LEFT JOIN employees e ON d.id = e.department_id
               GROUP BY d.name
               ORDER BY employee_count DESC`
  },
  {
    id: 10,
    title: "Projects with Team Size",
    difficulty: "medium",
    description: "List all projects with the number of employees assigned to each. Show project name and team size.",
    expectedColumns: ["project_name", "team_size"],
    solution: `SELECT p.name as project_name, COUNT(ep.employee_id) as team_size
               FROM projects p
               LEFT JOIN employee_projects ep ON p.id = ep.project_id
               GROUP BY p.name`
  },
  {
    id: 11,
    title: "Salary Range by Location",
    difficulty: "medium",
    description: "Find the minimum and maximum salary for each office location. Show location, min_salary, and max_salary.",
    expectedColumns: ["location", "min_salary", "max_salary"],
    solution: `SELECT d.location, MIN(s.amount) as min_salary, MAX(s.amount) as max_salary
               FROM departments d
               JOIN employees e ON d.id = e.department_id
               JOIN salaries s ON e.id = s.employee_id
               GROUP BY d.location`
  },
  
  // HARD - Complex JOINs, Subqueries, HAVING, Window Functions
  {
    id: 12,
    title: "Top Earning Department",
    difficulty: "hard",
    description: "Find the department with the highest total salary expenditure. Show department name and total salary.",
    expectedColumns: ["department_name", "total_salary"],
    solution: `SELECT d.name as department_name, SUM(s.amount) as total_salary
               FROM departments d
               JOIN employees e ON d.id = e.department_id
               JOIN salaries s ON e.id = s.employee_id
               GROUP BY d.name
               ORDER BY total_salary DESC
               LIMIT 1`
  },
  {
    id: 13,
    title: "Employees on Multiple Projects",
    difficulty: "hard",
    description: "Find employees working on more than one project. Show employee name and project count, ordered by project count descending.",
    expectedColumns: ["name", "project_count"],
    solution: `SELECT e.name, COUNT(ep.project_id) as project_count
               FROM employees e
               JOIN employee_projects ep ON e.id = ep.employee_id
               GROUP BY e.id, e.name
               HAVING COUNT(ep.project_id) > 1
               ORDER BY project_count DESC`
  },
  {
    id: 14,
    title: "Project Budget Analysis",
    difficulty: "hard",
    description: "For each active project (no end_date), show project name, budget, number of employees, and average employee salary on that project.",
    expectedColumns: ["project_name", "budget", "employee_count", "avg_employee_salary"],
    solution: `SELECT p.name as project_name, p.budget, 
               COUNT(DISTINCT ep.employee_id) as employee_count,
               AVG(s.amount) as avg_employee_salary
               FROM projects p
               JOIN employee_projects ep ON p.id = ep.project_id
               JOIN salaries s ON ep.employee_id = s.employee_id
               WHERE p.end_date IS NULL
               GROUP BY p.id, p.name, p.budget`
  },
  {
    id: 15,
    title: "Employees Without Projects",
    difficulty: "hard",
    description: "Find all employees who are not assigned to any project. Show employee name, department name, and salary.",
    expectedColumns: ["name", "department_name", "salary"],
    solution: `SELECT e.name, d.name as department_name, s.amount as salary
               FROM employees e
               JOIN departments d ON e.department_id = d.id
               JOIN salaries s ON e.id = s.employee_id
               LEFT JOIN employee_projects ep ON e.id = ep.employee_id
               WHERE ep.employee_id IS NULL`
  },
  {
    id: 16,
    title: "Above Average Earners",
    difficulty: "hard",
    description: "Find employees earning more than the average salary across all employees. Show name, salary, and how much above average (difference).",
    expectedColumns: ["name", "salary", "above_average"],
    solution: `SELECT e.name, s.amount as salary, 
               (s.amount - (SELECT AVG(amount) FROM salaries)) as above_average
               FROM employees e
               JOIN salaries s ON e.id = s.employee_id
               WHERE s.amount > (SELECT AVG(amount) FROM salaries)
               ORDER BY above_average DESC`
  },
  {
    id: 17,
    title: "Department Budget Efficiency",
    difficulty: "hard",
    description: "Calculate the total project budget managed by each department and compare it to their salary costs. Show department name, total_project_budget, total_salaries, and budget_to_salary_ratio (budget/salaries).",
    expectedColumns: ["department_name", "total_project_budget", "total_salaries", "budget_to_salary_ratio"],
    solution: `SELECT d.name as department_name,
               COALESCE(SUM(DISTINCT p.budget), 0) as total_project_budget,
               SUM(DISTINCT s.amount) as total_salaries,
               CASE 
                 WHEN SUM(DISTINCT s.amount) > 0 THEN COALESCE(SUM(DISTINCT p.budget), 0) * 1.0 / SUM(DISTINCT s.amount)
                 ELSE 0
               END as budget_to_salary_ratio
               FROM departments d
               JOIN employees e ON d.id = e.department_id
               JOIN salaries s ON e.id = s.employee_id
               LEFT JOIN employee_projects ep ON e.id = ep.employee_id
               LEFT JOIN projects p ON ep.project_id = p.id
               GROUP BY d.name`
  },
  {
    id: 18,
    title: "Senior Employees by Department",
    difficulty: "hard",
    description: "For each department, find the employee with the earliest hire date (most senior). Show department name, employee name, and hire date.",
    expectedColumns: ["department_name", "employee_name", "hire_date"],
    solution: `SELECT d.name as department_name, e.name as employee_name, e.hire_date
               FROM employees e
               JOIN departments d ON e.department_id = d.id
               WHERE e.hire_date = (
                 SELECT MIN(e2.hire_date)
                 FROM employees e2
                 WHERE e2.department_id = e.department_id
               )
               ORDER BY e.hire_date`
  }
];
