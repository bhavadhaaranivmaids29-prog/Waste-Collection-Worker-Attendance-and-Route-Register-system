const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data', 'database.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function nextId(collection) {
  const data = readDB();
  const items = data[collection];
  if (!items.length) return '1';
  const nums = items.map(i => parseInt(i.id.replace(/[A-Z]+/g, '')));
  const max = Math.max(...nums);
  return String(max + 1).padStart(3, '0');
}

// ── DASHBOARD ──────────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  const data = readDB();
  const today = new Date().toISOString().slice(0, 10);
  const { date } = req.query;
  const queryDate = date || today;

  const todayAttendance = data.attendance.filter(a => a.date === queryDate);
  const todayCoverage = data.routeCoverage.filter(c => c.date === queryDate);
  const activeWorkers = data.workers.filter(w => w.status === 'active');

  const present = todayAttendance.filter(a => a.status === 'present').length;
  const absent = todayAttendance.filter(a => a.status === 'absent').length;
  const onLeave = todayAttendance.filter(a => a.status === 'leave').length;

  const covered = todayCoverage.filter(c => c.status === 'covered').length;
  const partial = todayCoverage.filter(c => c.status === 'partial').length;
  const notCovered = todayCoverage.filter(c => c.status === 'not_covered').length;

  res.json({
    date: queryDate,
    totalWorkers: activeWorkers.length,
    attendance: { present, absent, onLeave, total: todayAttendance.length },
    routeCoverage: { covered, partial, notCovered, total: todayCoverage.length, totalRoutes: data.routes.length }
  });
});

// ── WORKERS CRUD ───────────────────────────────────────────
app.get('/api/workers', (req, res) => {
  res.json(readDB().workers);
});

app.get('/api/workers/:id', (req, res) => {
  const worker = readDB().workers.find(w => w.id === req.params.id);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });
  res.json(worker);
});

app.post('/api/workers', (req, res) => {
  const data = readDB();
  const id = 'W' + nextId('workers');
  const worker = { id, ...req.body, status: req.body.status || 'active' };
  data.workers.push(worker);
  writeDB(data);
  res.status(201).json(worker);
});

app.put('/api/workers/:id', (req, res) => {
  const data = readDB();
  const idx = data.workers.findIndex(w => w.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Worker not found' });
  data.workers[idx] = { ...data.workers[idx], ...req.body };
  writeDB(data);
  res.json(data.workers[idx]);
});

app.delete('/api/workers/:id', (req, res) => {
  const data = readDB();
  data.workers = data.workers.filter(w => w.id !== req.params.id);
  writeDB(data);
  res.json({ message: 'Deleted' });
});

// ── ROUTES CRUD ────────────────────────────────────────────
app.get('/api/routes', (req, res) => {
  const data = readDB();
  const routes = data.routes.map(r => ({
    ...r,
    worker: data.workers.find(w => w.id === r.assignedWorkerId) || null
  }));
  res.json(routes);
});

app.get('/api/routes/:id', (req, res) => {
  const data = readDB();
  const route = data.routes.find(r => r.id === req.params.id);
  if (!route) return res.status(404).json({ error: 'Route not found' });
  res.json({ ...route, worker: data.workers.find(w => w.id === route.assignedWorkerId) || null });
});

app.post('/api/routes', (req, res) => {
  const data = readDB();
  const id = 'R' + nextId('routes');
  const route = { id, ...req.body };
  data.routes.push(route);
  writeDB(data);
  res.status(201).json(route);
});

app.put('/api/routes/:id', (req, res) => {
  const data = readDB();
  const idx = data.routes.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Route not found' });
  data.routes[idx] = { ...data.routes[idx], ...req.body };
  writeDB(data);
  res.json(data.routes[idx]);
});

app.delete('/api/routes/:id', (req, res) => {
  const data = readDB();
  data.routes = data.routes.filter(r => r.id !== req.params.id);
  writeDB(data);
  res.json({ message: 'Deleted' });
});

// ── ATTENDANCE CRUD ────────────────────────────────────────
app.get('/api/attendance', (req, res) => {
  const data = readDB();
  const { date, workerId } = req.query;
  let records = data.attendance;
  if (date) records = records.filter(a => a.date === date);
  if (workerId) records = records.filter(a => a.workerId === workerId);
  const enriched = records.map(a => ({
    ...a,
    workerName: (data.workers.find(w => w.id === a.workerId) || {}).name || '',
    worker: data.workers.find(w => w.id === a.workerId) || null
  }));
  res.json(enriched);
});

app.post('/api/attendance', (req, res) => {
  const data = readDB();
  const { workerId, workerName, date, status } = req.body;
  if (!workerId || !workerId.trim()) {
    return res.status(400).json({ error: 'Worker ID is required' });
  }
  if (!workerName || !workerName.trim()) {
    return res.status(400).json({ error: 'Worker Name is required and cannot be empty' });
  }
  const worker = data.workers.find(w => w.id === workerId);
  if (!worker) {
    return res.status(400).json({ error: 'Invalid Worker Name — no worker found with this ID' });
  }
  if (worker.name.trim() !== workerName.trim()) {
    return res.status(400).json({ error: 'Worker Name does not match the registered worker name' });
  }
  const existing = data.attendance.find(a => a.workerId === workerId && a.date === date);
  if (existing) {
    existing.status = status;
    writeDB(data);
    return res.json(existing);
  }
  const id = 'A' + nextId('attendance');
  const record = { id, workerId, workerName, date, status };
  data.attendance.push(record);
  writeDB(data);
  res.status(201).json(record);
});

app.put('/api/attendance/:id', (req, res) => {
  const data = readDB();
  const idx = data.attendance.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Record not found' });
  data.attendance[idx] = { ...data.attendance[idx], ...req.body };
  writeDB(data);
  res.json(data.attendance[idx]);
});

app.delete('/api/attendance/:id', (req, res) => {
  const data = readDB();
  data.attendance = data.attendance.filter(a => a.id !== req.params.id);
  writeDB(data);
  res.json({ message: 'Deleted' });
});

// ── ROUTE COVERAGE CRUD ────────────────────────────────────
app.get('/api/coverage', (req, res) => {
  const data = readDB();
  const { date, routeId } = req.query;
  let records = data.routeCoverage;
  if (date) records = records.filter(c => c.date === date);
  if (routeId) records = records.filter(c => c.routeId === routeId);
  const enriched = records.map(c => ({
    ...c,
    route: data.routes.find(r => r.id === c.routeId) || null,
    worker: (() => {
      const route = data.routes.find(r => r.id === c.routeId);
      return route ? data.workers.find(w => w.id === route.assignedWorkerId) || null : null;
    })()
  }));
  res.json(enriched);
});

app.post('/api/coverage', (req, res) => {
  const data = readDB();
  const { routeId, date, status, notes } = req.body;
  const existing = data.routeCoverage.find(c => c.routeId === routeId && c.date === date);
  if (existing) {
    existing.status = status;
    existing.notes = notes || existing.notes;
    writeDB(data);
    return res.json(existing);
  }
  const id = 'C' + nextId('routeCoverage');
  const record = { id, routeId, date, status, notes: notes || '' };
  data.routeCoverage.push(record);
  writeDB(data);
  res.status(201).json(record);
});

app.put('/api/coverage/:id', (req, res) => {
  const data = readDB();
  const idx = data.routeCoverage.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Record not found' });
  data.routeCoverage[idx] = { ...data.routeCoverage[idx], ...req.body };
  writeDB(data);
  res.json(data.routeCoverage[idx]);
});

app.delete('/api/coverage/:id', (req, res) => {
  const data = readDB();
  data.routeCoverage = data.routeCoverage.filter(c => c.id !== req.params.id);
  writeDB(data);
  res.json({ message: 'Deleted' });
});

// ── HISTORY (date range) ───────────────────────────────────
app.get('/api/history', (req, res) => {
  const data = readDB();
  const { from, to } = req.query;
  const startDate = from || '2000-01-01';
  const endDate = to || '2099-12-31';

  const dates = [...new Set([
    ...data.attendance.map(a => a.date),
    ...data.routeCoverage.map(c => c.date)
  ])].filter(d => d >= startDate && d <= endDate).sort().reverse();

  const history = dates.map(date => {
    const dayAtt = data.attendance.filter(a => a.date === date);
    const dayCov = data.routeCoverage.filter(c => c.date === date);
    return {
      date,
      attendance: {
        present: dayAtt.filter(a => a.status === 'present').length,
        absent: dayAtt.filter(a => a.status === 'absent').length,
        onLeave: dayAtt.filter(a => a.status === 'leave').length,
        total: dayAtt.length
      },
      coverage: {
        covered: dayCov.filter(c => c.status === 'covered').length,
        partial: dayCov.filter(c => c.status === 'partial').length,
        notCovered: dayCov.filter(c => c.status === 'not_covered').length,
        total: dayCov.length
      }
    };
  });

  res.json(history);
});

// ── START ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Waste Collection Monitor running at http://localhost:${PORT}`);
});
