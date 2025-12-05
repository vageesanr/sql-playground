import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { problems } from './problems.js';
import { expertProblems } from './problems-expert.js';

const app = express();
const PORT = 3010;

// Combine all problems
const allProblems = [...problems, ...expertProblems];

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Get all problems
app.get('/api/problems', (req, res) => {
  const problemList = allProblems.map(({ id, title, difficulty, description }) => ({
    id, title, difficulty, description
  }));
  res.json(problemList);
});

// Get specific problem
app.get('/api/problems/:id', (req, res) => {
  const problem = allProblems.find(p => p.id === parseInt(req.params.id));
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }
  const { solution, ...problemData } = problem;
  res.json(problemData);
});

// Execute SQL query
app.post('/api/execute', (req, res) => {
  const { query, problemId } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Determine which database to use based on problem ID
  const isExpertProblem = problemId >= 101;
  const dbPath = isExpertProblem ? 'sql_practice_expert.db' : 'sql_practice.db';
  const db = new Database(dbPath, { readonly: true });
  
  try {
    const stmt = db.prepare(query);
    const results = stmt.all();
    
    let isCorrect = false;
    let message = '';
    
    if (problemId) {
      const problem = allProblems.find(p => p.id === problemId);
      if (problem) {
        const expectedStmt = db.prepare(problem.solution);
        const expectedResults = expectedStmt.all();
        
        isCorrect = JSON.stringify(results) === JSON.stringify(expectedResults);
        message = isCorrect ? 'Correct! Well done!' : 'Not quite right. Try again!';
      }
    }
    
    res.json({ 
      success: true, 
      results,
      isCorrect,
      message
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    db.close();
  }
});

// Get database schema
app.get('/api/schema', (req, res) => {
  const dbType = req.query.type || 'basic';
  const dbPath = dbType === 'expert' ? 'sql_practice_expert.db' : 'sql_practice.db';
  const db = new Database(dbPath, { readonly: true });
  
  try {
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `).all();
    
    const schema = {};
    tables.forEach(({ name }) => {
      const columns = db.prepare(`PRAGMA table_info(${name})`).all();
      const sampleData = db.prepare(`SELECT * FROM ${name} LIMIT 3`).all();
      schema[name] = { columns, sampleData };
    });
    
    res.json(schema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    db.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
