const API_BASE = 'http://localhost:3010/api';

let problems = [];
let currentProblem = null;
let currentFilter = 'all';
let editor = null;
let currentSchema = {};

// Load problems on startup
async function loadProblems() {
  try {
    const response = await fetch(`${API_BASE}/problems`);
    problems = await response.json();
    renderProblems();
  } catch (error) {
    console.error('Failed to load problems:', error);
  }
}

// Load and display schema
async function loadSchema(type = 'basic') {
  try {
    const response = await fetch(`${API_BASE}/schema?type=${type}`);
    const schema = await response.json();
    currentSchema = schema;
    displaySchema(schema, type);
    updateEditorHints(schema);
  } catch (error) {
    console.error('Failed to load schema:', error);
  }
}

function displaySchema(schema, type) {
  const schemaInfo = document.getElementById('schemaInfo');
  const dbTitle = type === 'expert' ? 'Expert Database (E-commerce)' : 'Basic Database (Company)';
  let html = `<h3>${dbTitle}</h3>`;
  
  for (const [tableName, tableData] of Object.entries(schema)) {
    html += `<div class="schema-table">`;
    html += `<h4>${tableName}</h4>`;
    html += `<ul>`;
    tableData.columns.forEach(col => {
      html += `<li>${col.name} (${col.type})</li>`;
    });
    html += `</ul></div>`;
  }
  
  schemaInfo.innerHTML = html;
}

function renderProblems() {
  const problemList = document.getElementById('problemList');
  const filtered = currentFilter === 'all' 
    ? problems 
    : problems.filter(p => p.difficulty === currentFilter);
  
  problemList.innerHTML = filtered.map(problem => `
    <div class="problem-item" data-id="${problem.id}">
      <h3>${problem.title}</h3>
      <span class="badge ${problem.difficulty}">${problem.difficulty}</span>
    </div>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.problem-item').forEach(item => {
    item.addEventListener('click', () => loadProblem(parseInt(item.dataset.id)));
  });
}

async function loadProblem(id) {
  try {
    const response = await fetch(`${API_BASE}/problems/${id}`);
    currentProblem = await response.json();
    displayProblem();
    
    // Load appropriate schema based on problem
    const schemaType = id >= 101 ? 'expert' : 'basic';
    loadSchema(schemaType);
  } catch (error) {
    console.error('Failed to load problem:', error);
  }
}

function displayProblem() {
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('problemScreen').style.display = 'block';
  
  document.getElementById('problemTitle').textContent = currentProblem.title;
  document.getElementById('problemDifficulty').textContent = currentProblem.difficulty;
  document.getElementById('problemDifficulty').className = `badge ${currentProblem.difficulty}`;
  document.getElementById('problemDescription').textContent = currentProblem.description;
  
  if (editor) {
    editor.setValue('');
  }
  
  document.getElementById('resultSection').style.display = 'none';
  document.getElementById('hintSection').style.display = 'none';
  document.getElementById('explanationSection').style.display = 'none';
  
  // Show/hide hint button based on availability
  const showHintBtn = document.getElementById('showHintBtn');
  if (currentProblem.hint) {
    showHintBtn.style.display = 'inline-block';
  } else {
    showHintBtn.style.display = 'none';
  }
  
  // Update active state
  document.querySelectorAll('.problem-item').forEach(item => {
    item.classList.toggle('active', parseInt(item.dataset.id) === currentProblem.id);
  });
}

async function executeQuery() {
  const query = editor ? editor.getValue().trim() : '';
  
  if (!query) {
    alert('Please enter a SQL query');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query, 
        problemId: currentProblem?.id 
      })
    });
    
    const data = await response.json();
    displayResults(data);
  } catch (error) {
    displayResults({ 
      success: false, 
      error: 'Failed to execute query' 
    });
  }
}

function displayResults(data) {
  const resultSection = document.getElementById('resultSection');
  const resultTable = document.getElementById('resultTable');
  const resultMessage = document.getElementById('resultMessage');
  
  resultSection.style.display = 'block';
  
  if (!data.success) {
    resultMessage.textContent = `Error: ${data.error}`;
    resultMessage.className = 'error';
    resultTable.innerHTML = `<div class="error-message">${data.error}</div>`;
    return;
  }
  
  if (currentProblem) {
    if (data.isCorrect) {
      resultMessage.textContent = '✓ ' + data.message;
      resultMessage.className = 'correct';
    } else {
      resultMessage.textContent = '✗ ' + data.message;
      resultMessage.className = 'incorrect';
    }
  } else {
    resultMessage.textContent = '';
  }
  
  if (data.results.length === 0) {
    resultTable.innerHTML = '<p>No results returned</p>';
    return;
  }
  
  const columns = Object.keys(data.results[0]);
  let html = '<table><thead><tr>';
  columns.forEach(col => {
    html += `<th>${col}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  data.results.forEach(row => {
    html += '<tr>';
    columns.forEach(col => {
      html += `<td>${row[col] ?? 'NULL'}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  resultTable.innerHTML = html;
}

function showHint() {
  if (currentProblem && currentProblem.hint) {
    document.getElementById('hintText').textContent = currentProblem.hint;
    document.getElementById('hintSection').style.display = 'block';
  }
}

function showSolution() {
  if (currentProblem && currentProblem.solution) {
    if (editor) {
      editor.setValue(currentProblem.solution);
    }
    if (currentProblem.explanation) {
      document.getElementById('explanationText').textContent = currentProblem.explanation;
      document.getElementById('explanationSection').style.display = 'block';
    }
  }
}

// Initialize CodeMirror editor
function initEditor() {
  const container = document.getElementById('sqlEditorContainer');
  if (!container) {
    console.error('Editor container not found');
    return;
  }
  
  if (typeof CodeMirror === 'undefined') {
    console.error('CodeMirror not loaded');
    return;
  }
  
  try {
    editor = CodeMirror(container, {
      mode: 'text/x-sql',
      theme: 'material',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: false,
      placeholder: 'Write your SQL query here...',
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Cmd-Space': 'autocomplete'
      },
      hintOptions: {
        tables: {}
      }
    });
    
    console.log('CodeMirror editor initialized successfully');
  } catch (error) {
    console.error('Failed to initialize CodeMirror:', error);
  }
}

// Update editor hints with current schema
function updateEditorHints(schema) {
  if (!editor) return;
  
  const tables = {};
  for (const [tableName, tableData] of Object.entries(schema)) {
    tables[tableName] = tableData.columns.map(col => col.name);
  }
  
  editor.setOption('hintOptions', { tables });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize CodeMirror
  initEditor();
  
  // Event listeners
  document.getElementById('runBtn').addEventListener('click', executeQuery);
  document.getElementById('showHintBtn').addEventListener('click', showHint);
  document.getElementById('showSolutionBtn').addEventListener('click', showSolution);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProblems();
    });
  });

  // Load initial data
  loadProblems();
  loadSchema();
});
