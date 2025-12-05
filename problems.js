export const problems = [
  // EASY - Basic SELECT and WHERE
  {
    id: 1,
    title: "List All Employees",
    difficulty: "easy",
    description: "Write a query to select all employees with their names and emails.",
    hint: "Use SELECT to choose specific columns from the employees table.",
    expectedColumns: ["name", "email"],
    solution: "SELECT name, email FROM employees",
    explanation: "This is a basic SELECT query. We specify the columns we want (name, email) and the table to get them from (employees)."
  },
  {
    id: 2,
    title: "Count Employees",
    difficulty: "easy",
    description: "Write a query to count the total number of employees.",
    hint: "Use the COUNT(*) aggregate function and alias it as 'count'.",
    expectedColumns: ["count"],
    solution: "SELECT COUNT(*) as count FROM employees",
    explanation: "COUNT(*) counts all rows in the table. We use 'as count' to name the result column."
  },
  {
    id: 3,
    title: "Departments in New York",
    difficulty: "easy",
    description: "Find all departments located in New York.",
    hint: "Use WHERE clause to filter rows where location equals 'New York'.",
    expectedColumns: ["name", "location"],
    solution: "SELECT name, location FROM departments WHERE location = 'New York'",
    explanation: "The WHERE clause filters rows based on a condition. Here we filter for departments where location is exactly 'New York'."
  },
  {
    id: 4,
    title: "High Earners",
    difficulty: "easy",
    description: "Find all employees with a salary greater than 90000. Show name and salary amount, ordered by salary descending.",
    hint: "JOIN employees with salaries, filter with WHERE, and use ORDER BY DESC.",
    expectedColumns: ["name", "salary"],
    solution: `SELECT e.name, s.amount as salary
               FROM employees e
               JOIN salaries s ON e.id = s.employee_id
               WHERE s.amount > 90000
               ORDER BY salary DESC`,
    explanation: "We JOIN two tables to combine employee names with their salaries, filter for high earners using WHERE, and sort results with ORDER BY DESC (descending)."
  },
  {
    id: 5,
    title: "Engineering Department",
    difficulty: "easy",
    description: "List all employees in the Engineering department. Show employee name and email.",
    hint: "JOIN employees with departments and filter by department name.",
    expectedColumns: ["name", "email"],
    solution: `SELECT e.name, e.email
               FROM employees e
               JOIN departments d ON e.department_id = d.id
               WHERE d.name = 'Engineering'`,
    explanation: "We JOIN employees with departments using the foreign key relationship, then filter for only the Engineering department."
  },
  
  // MEDIUM - JOINs, GROUP BY, Aggregations
  {
    id: 6,
    title: "Employees with Departments",
    difficulty: "medium",
    description: "List all employees with their department names. Include employee name, email, and department name.",
    hint: "Use INNER JOIN to combine employees and departments tables.",
    expectedColumns: ["name", "email", "department_name"],
    solution: `SELECT e.name, e.email, d.name as department_name 
               FROM employees e 
               JOIN departments d ON e.department_id = d.id`,
    explanation: "INNER JOIN combines rows from two tables based on a related column. Here we match employees to their departments using department_id."
  },
  {
    id: 7,
    title: "Average Salary by Department",
    difficulty: "medium",
    description: "Calculate the average salary for each department. Show department name and average salary, ordered by average salary descending.",
    hint: "Use AVG() with GROUP BY to calculate averages per department.",
    expectedColumns: ["department_name", "avg_salary"],
    solution: `SELECT d.name as department_name, AVG(s.amount) as avg_salary
               FROM departments d
               JOIN employees e ON d.id = e.department_id
               JOIN salaries s ON e.id = s.employee_id
               GROUP BY d.name
               ORDER BY avg_salary DESC`,
    explanation: "GROUP BY groups rows with the same department together. AVG() then calculates the average salary for each group. We need to JOIN three tables to connect departments to salaries."
  },
  {
    id: 8,
    title: "Employees Hired in 2020",
    difficulty: "medium",
    description: "Find all employees hired in 2020 with their current salary.",
    hint: "Use LIKE '2020%' to match dates starting with 2020.",
    expectedColumns: ["name", "hire_date", "salary"],
    solution: `SELECT e.name, e.hire_date, s.amount as salary
               FROM employees e
               JOIN salaries s ON e.id = s.employee_id
               WHERE e.hire_date LIKE '2020%'`,
    explanation: "LIKE with wildcards (%) allows pattern matching. '2020%' matches any date starting with 2020, regardless of month or day."
  },
  {
    id: 9,
    title: "Department Employee Count",
    difficulty: "medium",
    description: "Count the number of employees in each department. Show department name and employee count, ordered by count descending.",
    hint: "Use COUNT() with GROUP BY. Consider LEFT JOIN to include departments with no employees.",
    expectedColumns: ["department_name", "employee_count"],
    solution: `SELECT d.name as department_name, COUNT(e.id) as employee_count
               FROM departments d
               LEFT JOIN employees e ON d.id = e.department_id
               GROUP BY d.name
               ORDER BY employee_count DESC`,
    explanation: "LEFT JOIN includes all departments even if they have no employees. COUNT(e.id) counts employees per department, returning 0 for departments with no matches."
  },
  {
    id: 10,
    title: "Projects with Team Size",
    difficulty: "medium",
    description: "List all projects with the number of employees assigned to each. Show project name and team size.",
    hint: "Use COUNT() with GROUP BY on the projects table.",
    expectedColumns: ["project_name", "team_size"],
    solution: `SELECT p.name as project_name, COUNT(ep.employee_id) as team_size
               FROM projects p
               LEFT JOIN employee_projects ep ON p.id = ep.project_id
               GROUP BY p.name`,
    explanation: "Similar to counting employees per department, we count employees per project using the junction table employee_projects."
  },
  {
    id: 11,
    title: "Salary Range by Location",
    difficulty: "medium",
    description: "Find the minimum and maximum salary for each office location. Show location, min_salary, and max_salary.",
    hint: "Use MIN() and MAX() aggregate functions with GROUP BY location.",
    expectedColumns: ["location", "min_salary", "max_salary"],
    solution: `SELECT d.location, MIN(s.amount) as min_salary, MAX(s.amount) as max_salary
               FROM departments d
               JOIN employees e ON d.id = e.department_id
               JOIN salaries s ON e.id = s.employee_id
               GROUP BY d.location`,
    explanation: "MIN() and MAX() find the smallest and largest values in each group. We group by location to get salary ranges for each office."
  },
  
  // HARD - Complex JOINs, Subqueries, HAVING, Window Functions
  {
    id: 12,
    title: "Top Earning Department",
    difficulty: "hard",
    description: "Find the department with the highest total salary expenditure. Show department name and total salary.",
    hint: "Use SUM() with GROUP BY, then ORDER BY and LIMIT 1 to get the top result.",
    expectedColumns: ["department_name", "total_salary"],
    solution: `SELECT d.name as department_name, SUM(s.amount) as total_salary
               FROM departments d
               JOIN employees e ON d.id = e.department_id
               JOIN salaries s ON e.id = s.employee_id
               GROUP BY d.name
               ORDER BY total_salary DESC
               LIMIT 1`,
    explanation: "We calculate total salaries per department using SUM() and GROUP BY, then sort descending and use LIMIT 1 to get only the top department."
  },
  {
    id: 13,
    title: "Employees on Multiple Projects",
    difficulty: "hard",
    description: "Find employees working on more than one project. Show employee name and project count, ordered by project count descending.",
    hint: "Use HAVING clause to filter groups after aggregation.",
    expectedColumns: ["name", "project_count"],
    solution: `SELECT e.name, COUNT(ep.project_id) as project_count
               FROM employees e
               JOIN employee_projects ep ON e.id = ep.employee_id
               GROUP BY e.id, e.name
               HAVING COUNT(ep.project_id) > 1
               ORDER BY project_count DESC`,
    explanation: "HAVING filters groups after GROUP BY, unlike WHERE which filters before grouping. We use it to find employees with more than 1 project."
  },
  {
    id: 14,
    title: "Project Budget Analysis",
    difficulty: "hard",
    description: "For each active project (no end_date), show project name, budget, number of employees, and average employee salary on that project.",
    hint: "Filter for NULL end_date, use COUNT(DISTINCT) and AVG() with multiple JOINs.",
    expectedColumns: ["project_name", "budget", "employee_count", "avg_employee_salary"],
    solution: `SELECT p.name as project_name, p.budget, 
               COUNT(DISTINCT ep.employee_id) as employee_count,
               AVG(s.amount) as avg_employee_salary
               FROM projects p
               JOIN employee_projects ep ON p.id = ep.project_id
               JOIN salaries s ON ep.employee_id = s.employee_id
               WHERE p.end_date IS NULL
               GROUP BY p.id, p.name, p.budget`,
    explanation: "We filter for active projects (end_date IS NULL), then aggregate employee counts and average salaries. COUNT(DISTINCT) ensures we don't double-count employees."
  },
  {
    id: 15,
    title: "Employees Without Projects",
    difficulty: "hard",
    description: "Find all employees who are not assigned to any project. Show employee name, department name, and salary.",
    hint: "Use LEFT JOIN and filter for NULL values to find unmatched rows.",
    expectedColumns: ["name", "department_name", "salary"],
    solution: `SELECT e.name, d.name as department_name, s.amount as salary
               FROM employees e
               JOIN departments d ON e.department_id = d.id
               JOIN salaries s ON e.id = s.employee_id
               LEFT JOIN employee_projects ep ON e.id = ep.employee_id
               WHERE ep.employee_id IS NULL`,
    explanation: "LEFT JOIN includes all employees even if they have no projects. WHERE ep.employee_id IS NULL filters for employees with no matching project assignments."
  },
  {
    id: 16,
    title: "Above Average Earners",
    difficulty: "hard",
    description: "Find employees earning more than the average salary across all employees. Show name, salary, and how much above average (difference).",
    hint: "Use a subquery to calculate the average, then compare and calculate difference.",
    expectedColumns: ["name", "salary", "above_average"],
    solution: `SELECT e.name, s.amount as salary, 
               (s.amount - (SELECT AVG(amount) FROM salaries)) as above_average
               FROM employees e
               JOIN salaries s ON e.id = s.employee_id
               WHERE s.amount > (SELECT AVG(amount) FROM salaries)
               ORDER BY above_average DESC`,
    explanation: "Subqueries (SELECT within SELECT) let us use calculated values. We calculate the average salary once and use it for both filtering and calculating the difference."
  },
  {
    id: 17,
    title: "Department Budget Efficiency",
    difficulty: "hard",
    description: "Calculate the total project budget managed by each department and compare it to their salary costs. Show department name, total_project_budget, total_salaries, and budget_to_salary_ratio (budget/salaries).",
    hint: "Use COALESCE for NULL handling, CASE for conditional logic, and DISTINCT to avoid double-counting.",
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
               GROUP BY d.name`,
    explanation: "COALESCE handles NULL values by providing defaults. CASE allows conditional logic (if-then-else). DISTINCT prevents double-counting when multiple JOINs create duplicate rows."
  },
  {
    id: 18,
    title: "Senior Employees by Department",
    difficulty: "hard",
    description: "For each department, find the employee with the earliest hire date (most senior). Show department name, employee name, and hire date.",
    hint: "Use a correlated subquery to find the minimum hire date for each department.",
    expectedColumns: ["department_name", "employee_name", "hire_date"],
    solution: `SELECT d.name as department_name, e.name as employee_name, e.hire_date
               FROM employees e
               JOIN departments d ON e.department_id = d.id
               WHERE e.hire_date = (
                 SELECT MIN(e2.hire_date)
                 FROM employees e2
                 WHERE e2.department_id = e.department_id
               )
               ORDER BY e.hire_date`,
    explanation: "A correlated subquery references the outer query (e.department_id). For each employee, it finds the earliest hire date in their department and only returns employees matching that date."
  }
];
