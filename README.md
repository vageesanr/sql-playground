# 🎯 SQL Practice Platform

A HackerRank-like interactive platform for practicing and mastering SQL queries. Features real-time query execution, automatic validation, and a comprehensive set of challenges ranging from beginner to advanced levels.

![SQL Practice Platform](https://img.shields.io/badge/SQL-Practice-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **9 Curated SQL Problems** - Organized by difficulty (Easy, Medium, Hard)
- **Pre-loaded Database** - Realistic synthetic data across 5 related tables
- **Interactive SQL Editor** - Write and test queries in real-time
- **Instant Validation** - Automatic checking of query results
- **Clean Modern UI** - Intuitive interface with problem filtering
- **Database Schema Viewer** - Quick reference to table structures
- **Cross-platform** - Works on Windows, macOS, and Linux

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

### Check Your Installation

```bash
node --version
npm --version
```

If you don't have Node.js installed:
- **Windows/macOS**: Download from [nodejs.org](https://nodejs.org/)
- **macOS (Homebrew)**: `brew install node`
- **Linux**: `sudo apt install nodejs npm` or equivalent for your distro

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sql-practice-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   ```
   
   This creates a SQLite database (`sql_practice.db`) with sample data.

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to: `http://localhost:3010`

## 💻 Platform-Specific Instructions

### Windows

```cmd
# Using Command Prompt or PowerShell
git clone <repository-url>
cd sql-practice-platform
npm install
npm run init-db
npm run dev
```

Then open your browser to `http://localhost:3010`

### macOS

```bash
# Using Terminal
git clone <repository-url>
cd sql-practice-platform
npm install
npm run init-db
npm run dev
```

Then open your browser to `http://localhost:3010`

### Linux

```bash
# Using Terminal
git clone <repository-url>
cd sql-practice-platform
npm install
npm run init-db
npm run dev
```

Then open your browser to `http://localhost:3010`

## 📊 Database Schema

The platform uses a relational database with the following tables:

### **departments**
- `id` (INTEGER) - Primary key
- `name` (TEXT) - Department name
- `location` (TEXT) - Office location

### **employees**
- `id` (INTEGER) - Primary key
- `name` (TEXT) - Employee name
- `email` (TEXT) - Email address
- `department_id` (INTEGER) - Foreign key to departments
- `hire_date` (TEXT) - Date of hire (YYYY-MM-DD)

### **salaries**
- `id` (INTEGER) - Primary key
- `employee_id` (INTEGER) - Foreign key to employees
- `amount` (DECIMAL) - Salary amount
- `effective_date` (TEXT) - Date salary became effective

### **projects**
- `id` (INTEGER) - Primary key
- `name` (TEXT) - Project name
- `budget` (DECIMAL) - Project budget
- `start_date` (TEXT) - Project start date
- `end_date` (TEXT) - Project end date (NULL if ongoing)

### **employee_projects**
- `employee_id` (INTEGER) - Foreign key to employees
- `project_id` (INTEGER) - Foreign key to projects
- `role` (TEXT) - Employee's role on the project

## 🎮 How to Use

1. **Browse Problems** - Use the sidebar to view all available SQL challenges
2. **Filter by Difficulty** - Click Easy, Medium, or Hard to filter problems
3. **Select a Problem** - Click on any problem to view its description
4. **Write Your Query** - Use the SQL editor to write your solution
5. **Run & Validate** - Click "Run Query" to execute and check your answer
6. **View Results** - See query results and validation feedback instantly

## 📝 Problem Categories

### Easy (3 problems)
- Basic SELECT statements
- Simple WHERE clauses
- Aggregate functions (COUNT)

### Medium (3 problems)
- JOIN operations
- GROUP BY with aggregations
- Date filtering

### Hard (3 problems)
- Complex multi-table JOINs
- Subqueries and HAVING clauses
- Advanced aggregations

## 🛠️ Project Structure

```
sql-practice-platform/
├── public/
│   ├── index.html      # Main HTML file
│   ├── app.js          # Frontend JavaScript
│   └── style.css       # Styling
├── init-db.js          # Database initialization script
├── server.js           # Express server
├── problems.js         # Problem definitions
├── package.json        # Dependencies
└── README.md           # This file
```

## 🔧 Configuration

### Change Port

Edit `server.js` and `public/app.js`:

```javascript
// server.js
const PORT = 3010; // Change to your preferred port

// public/app.js
const API_BASE = 'http://localhost:3010/api'; // Update port here too
```

### Add New Problems

Edit `problems.js` and add new problem objects:

```javascript
{
  id: 10,
  title: "Your Problem Title",
  difficulty: "easy", // or "medium" or "hard"
  description: "Problem description here",
  expectedColumns: ["column1", "column2"],
  solution: "SELECT column1, column2 FROM table_name"
}
```

### Reset Database

To reset the database with fresh data:

```bash
npm run init-db
```

This will drop all existing tables and recreate them with sample data.

## 🐛 Troubleshooting

### Port Already in Use

If port 3010 is already in use:
1. Change the port in `server.js` and `public/app.js`
2. Or stop the process using port 3010

**Windows:**
```cmd
netstat -ano | findstr :3010
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:3010 | xargs kill -9
```

### Database Locked Error

If you get a "database is locked" error:
1. Stop the server
2. Delete `sql_practice.db`
3. Run `npm run init-db` again

### Module Not Found

If you get module errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-problem`)
3. Commit your changes (`git commit -am 'Add new SQL problem'`)
4. Push to the branch (`git push origin feature/new-problem`)
5. Open a Pull Request

### Ideas for Contributions
- Add more SQL problems
- Implement user authentication
- Add progress tracking
- Create difficulty hints
- Add query execution time metrics
- Support for other SQL databases (PostgreSQL, MySQL)

## 📄 License

This project is licensed under the MIT License - feel free to use it for learning and teaching!

## 🙏 Acknowledgments

- Built with Express.js and better-sqlite3
- Inspired by HackerRank and LeetCode
- Designed for SQL learners and educators

## 📧 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the database schema and sample queries

---

**Happy SQL Learning! 🚀**
