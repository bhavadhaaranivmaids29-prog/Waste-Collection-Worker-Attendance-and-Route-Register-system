const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

const API = '';

function today() { return new Date().toISOString().slice(0, 10); }

// ── Toast Context ──────────────────────────────────────────
const ToastCtx = createContext();
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, err) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, err }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.err ? 'error' : ''}`}>{t.msg}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function useToast() { return useContext(ToastCtx); }

// ── Animated Number ────────────────────────────────────────
function AnimNum({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    }
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);
  return <span>{display}</span>;
}

// ── Donut Chart ────────────────────────────────────────────
function Donut({ segments, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const o = offset;
        offset += pct;
        return (
          <circle
            key={i}
            cx={size / 2} cy={size / 2} r={r}
            className="donut-ring"
            stroke={seg.color}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-o * circ}
            strokeLinecap="round"
            style={{ transition: `stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1) ${i * .15}s` }}
          />
        );
      })}
    </svg>
  );
}

// ── Bar Chart ──────────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-row" style={{ animationDelay: `${i * .1}s` }}>
          <span className="bar-label">{d.label}</span>
          <div className="bar-track">
            <div
              className={`bar-fill ${d.cls}`}
              style={{ width: `${(d.value / max) * 100}%`, animationDelay: `${i * .15}s` }}
            />
          </div>
          <span className="bar-value">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Page Titles ────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard: ['Dashboard', 'Overview of today\'s operations'],
  workers: ['Workers', 'Manage collection workers'],
  attendance: ['Attendance', 'Track daily attendance'],
  routes: ['Routes', 'Manage collection routes'],
  coverage: ['Route Coverage', 'Monitor route completion status'],
  history: ['History', 'View past days\' reports'],
};

// ── THEME ──────────────────────────────────────────────────
const ThemeCtx = createContext();
function useTheme() { return useContext(ThemeCtx); }

// ── APP ────────────────────────────────────────────────────
function App() {
  const [page, setPage] = useState('dashboard');
  const [date, setDate] = useState(today());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('wt-theme') || 'light');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('wt-theme', next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const titles = PAGE_TITLES[page];

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme }}>
    <ToastProvider>
      <div className="app-container">
        <Sidebar page={page} setPage={p => { setPage(p); setSidebarOpen(false); }} open={sidebarOpen} />
        {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}
        <main className="main-content">
          <header className="topbar">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="page-title-area">
              <h1 className="page-title">{titles[0]}</h1>
              <span className="page-subtitle">{titles[1]}</span>
            </div>
            <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              )}
            </button>
            <div className="date-picker-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </header>
          <div className="page-content" key={page + date}>
            {page === 'dashboard' && <DashboardPage date={date} />}
            {page === 'workers' && <WorkersPage />}
            {page === 'attendance' && <AttendancePage date={date} />}
            {page === 'routes' && <RoutesPage />}
            {page === 'coverage' && <CoveragePage date={date} />}
            {page === 'history' && <HistoryPage />}
          </div>
        </main>
      </div>
    </ToastProvider>
    </ThemeCtx.Provider>
  );
}

// ── SIDEBAR ────────────────────────────────────────────────
function Sidebar({ page, setPage, open }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { id: 'workers', label: 'Workers', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    { id: 'attendance', label: 'Attendance', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
    { id: 'routes', label: 'Routes', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg> },
    { id: 'coverage', label: 'Route Coverage', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
    { id: 'history', label: 'History', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  ];
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <span className="logo-text">WasteTrack</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {items.map(item => (
          <a
            key={item.id}
            className={`nav-item ${page === item.id ? 'active' : ''}`}
            onClick={e => { e.preventDefault(); setPage(item.id); }}
            href="#"
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="supervisor-badge">
          <div className="avatar">S</div>
          <div>
            <span className="supervisor-name">Supervisor</span>
            <span className="supervisor-role">Admin Access</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── DASHBOARD PAGE ─────────────────────────────────────────
function DashboardPage({ date }) {
  const [dash, setDash] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const toast = useToast();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/dashboard?date=${date}`).then(r => r.json()),
      fetch(`${API}/api/workers`).then(r => r.json()),
      fetch(`${API}/api/attendance?date=${date}`).then(r => r.json()),
    ]).then(([d, w, a]) => { setDash(d); setWorkers(w); setAttendance(a); })
      .catch(() => toast('Failed to load dashboard', true));
  }, [date]);

  if (!dash) return <div className="empty-state"><p>Loading...</p></div>;

  const att = dash.attendance;
  const cov = dash.routeCoverage;
  const maxAtt = Math.max(att.present, att.absent, att.onLeave, 1);

  const attStatusMap = {};
  attendance.forEach(a => { attStatusMap[a.workerId] = a.status; });

  return (
    <div>
      <div className="stats-grid">
        <StatCard cls="stat-present" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>} value={att.present} label="Present Today" barCls="bar-green" delay={0} />
        <StatCard cls="stat-absent" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>} value={att.absent} label="Absent Today" barCls="bar-red" delay={1} />
        <StatCard cls="stat-leave" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} value={att.onLeave} label="On Leave" barCls="bar-amber" delay={2} />
        <StatCard cls="stat-routes" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>} value={`${cov.covered}/${cov.totalRoutes}`} label="Routes Covered" barCls="bar-teal" delay={3} />
      </div>

      <div className="dashboard-grid">
        <div className="card animate-in animate-delay-1">
          <div className="card-header">
            <h2>Attendance Breakdown</h2>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot dot-green" />Present</span>
              <span className="legend-item"><span className="dot dot-red" />Absent</span>
              <span className="legend-item"><span className="dot dot-amber" />Leave</span>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-area">
              <BarChart data={[
                { label: 'Present', value: att.present, cls: 'bar-fill-green' },
                { label: 'Absent', value: att.absent, cls: 'bar-fill-red' },
                { label: 'Leave', value: att.onLeave, cls: 'bar-fill-amber' },
              ]} />
              <div className="donut-wrapper">
                <Donut segments={[
                  { value: att.present, color: '#a855f7' },
                  { value: att.absent, color: '#ef4444' },
                  { value: att.onLeave, color: '#f59e0b' },
                ]} />
                <div className="donut-center">
                  <span className="donut-number"><AnimNum value={att.present} /></span>
                  <span className="donut-label">present</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card animate-in animate-delay-2">
          <div className="card-header">
            <h2>Route Coverage</h2>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot dot-teal" />Covered</span>
              <span className="legend-item"><span className="dot dot-amber" />Partial</span>
              <span className="legend-item"><span className="dot dot-red" />Not Covered</span>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-area">
              <BarChart data={[
                { label: 'Covered', value: cov.covered, cls: 'bar-fill-teal' },
                { label: 'Partial', value: cov.partial, cls: 'bar-fill-amber' },
                { label: 'Uncovered', value: cov.notCovered, cls: 'bar-fill-red' },
              ]} />
              <div className="donut-wrapper">
                <Donut segments={[
                  { value: cov.covered, color: '#a855f7' },
                  { value: cov.partial, color: '#f59e0b' },
                  { value: cov.notCovered, color: '#ef4444' },
                ]} />
                <div className="donut-center">
                  <span className="donut-number"><AnimNum value={cov.covered} /></span>
                  <span className="donut-label">covered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card animate-in animate-delay-3">
        <div className="card-header"><h2>Quick Status</h2></div>
        <div className="card-body">
          <div className="quick-status-grid">
            {workers.filter(w => w.status === 'active').map((w, i) => {
              const st = attStatusMap[w.id] || 'notmarked';
              const initials = w.name.split(' ').map(n => n[0]).join('').slice(0, 2);
              const colors = { present: '#a855f7', absent: '#ef4444', leave: '#f59e0b', notmarked: '#94a3b8' };
              return (
                <div key={w.id} className="worker-status-pill" style={{ animationDelay: `${i * .06}s` }}>
                  <div className="pill-avatar" style={{ background: colors[st] }}>{initials}</div>
                  <div className="pill-info">
                    <span className="pill-name">{w.name}</span>
                    <span className="pill-route">{w.id}</span>
                  </div>
                  <span className={`pill-badge badge-${st}`}>{st === 'notmarked' ? 'Not Marked' : st}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ cls, icon, value, label, barCls, delay }) {
  return (
    <div className={`stat-card ${cls} animate-in`} style={{ animationDelay: `${delay * .1}s` }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <span className="stat-number">
          {typeof value === 'string' ? value : <AnimNum value={value} />}
        </span>
        <span className="stat-label">{label}</span>
      </div>
      <div className={`stat-bar ${barCls}`} />
    </div>
  );
}

// ── WORKERS PAGE ───────────────────────────────────────────
function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [modal, setModal] = useState({ open: false, worker: null });
  const toast = useToast();

  const load = () => fetch(`${API}/api/workers`).then(r => r.json()).then(setWorkers);
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm('Delete this worker?')) return;
    await fetch(`${API}/api/workers/${id}`, { method: 'DELETE' });
    toast('Worker deleted');
    load();
  };

  return (
    <div>
      <div className="page-actions animate-in">
        <button className="btn btn-primary" onClick={() => setModal({ open: true, worker: null })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Worker
        </button>
      </div>
      <div className="card animate-in animate-delay-1">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <tr key={w.id} style={{ animationDelay: `${i * .04}s` }}>
                  <td><strong>{w.id}</strong></td>
                  <td>{w.name}</td>
                  <td>{w.phone}</td>
                  <td><span className={`status-chip chip-${w.status}`}><span className="chip-dot" />{w.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" title="Edit" onClick={() => setModal({ open: true, worker: w })}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="action-btn delete" title="Delete" onClick={() => del(w.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!workers.length && <tr><td colSpan="5" className="empty-state"><p>No workers yet</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {modal.open && <WorkerModal worker={modal.worker} onClose={() => setModal({ open: false })} onSaved={() => { setModal({ open: false }); load(); toast('Worker saved'); }} />}
    </div>
  );
}

function WorkerModal({ worker, onClose, onSaved }) {
  const [form, setForm] = useState(worker || { name: '', phone: '', status: 'active' });
  const save = async () => {
    const url = worker ? `${API}/api/workers/${worker.id}` : `${API}/api/workers`;
    await fetch(url, { method: worker ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    onSaved();
  };
  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{worker ? 'Edit Worker' : 'Add Worker'}</h2>
          <button className="modal-close" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Worker name" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>{worker ? 'Update' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}

// ── ATTENDANCE PAGE ────────────────────────────────────────
function AttendancePage({ date }) {
  const [records, setRecords] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [modal, setModal] = useState(false);
  const toast = useToast();

  const load = () => {
    fetch(`${API}/api/attendance?date=${date}`).then(r => r.json()).then(setRecords);
    fetch(`${API}/api/workers`).then(r => r.json()).then(setWorkers);
  };
  useEffect(() => { load(); }, [date]);

  const del = async (id) => {
    await fetch(`${API}/api/attendance/${id}`, { method: 'DELETE' });
    toast('Record deleted');
    load();
  };

  return (
    <div>
      <div className="page-actions animate-in">
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Mark Attendance
        </button>
      </div>
      <div className="card animate-in animate-delay-1">
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Worker</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id} style={{ animationDelay: `${i * .04}s` }}>
                  <td><strong>{r.worker ? r.worker.name : r.workerId}</strong></td>
                  <td>{r.date}</td>
                  <td><span className={`status-chip chip-${r.status}`}><span className="chip-dot" />{r.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn delete" onClick={() => del(r.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!records.length && <tr><td colSpan="4" className="empty-state"><p>No attendance records for this date</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {modal && <AttendanceModal date={date} workers={workers} onClose={() => setModal(false)} onSaved={() => { setModal(false); load(); toast('Attendance marked'); }} />}
    </div>
  );
}

function AttendanceModal({ date, workers, onClose, onSaved }) {
  const [entries, setEntries] = useState(() => workers.map(w => ({ workerId: w.id, name: w.name, status: 'present' })));
  const set = (i, v) => setEntries(e => e.map((x, j) => j === i ? { ...x, status: v } : x));
  const save = async () => {
    for (const e of entries) {
      await fetch(`${API}/api/attendance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workerId: e.workerId, date, status: e.status }) });
    }
    onSaved();
  };
  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <h2>Mark Attendance — {date}</h2>
          <button className="modal-close" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          {entries.map((e, i) => (
            <div key={e.workerId} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '8px 12px', borderRadius: 10, background: 'var(--slate-100)' }}>
              <span style={{ flex: 1, fontWeight: 600, fontSize: '.9rem', color: 'var(--text)' }}>{e.name}</span>
              {['present', 'absent', 'leave'].map(s => (
                <button
                  key={s}
                  className={`btn btn-sm ${e.status === s ? 'btn-primary' : 'btn-ghost'}`}
                  style={e.status !== s ? {} : { background: s === 'present' ? '#a855f7' : s === 'absent' ? '#ef4444' : '#f59e0b', boxShadow: 'none' }}
                  onClick={() => set(i, s)}
                >{s}</button>
              ))}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save All</button>
        </div>
      </div>
    </div>
  );
}

// ── ROUTES PAGE ────────────────────────────────────────────
function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [modal, setModal] = useState({ open: false, route: null });
  const toast = useToast();

  const load = () => fetch(`${API}/api/routes`).then(r => r.json()).then(setRoutes);
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm('Delete this route?')) return;
    await fetch(`${API}/api/routes/${id}`, { method: 'DELETE' });
    toast('Route deleted');
    load();
  };

  return (
    <div>
      <div className="page-actions animate-in">
        <button className="btn btn-primary" onClick={() => setModal({ open: true, route: null })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Route
        </button>
      </div>
      <div className="card animate-in animate-delay-1">
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Route Name</th><th>Assigned Worker</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {routes.map((r, i) => (
                <tr key={r.id} style={{ animationDelay: `${i * .04}s` }}>
                  <td><strong>{r.id}</strong></td>
                  <td>{r.name}</td>
                  <td>{r.worker ? r.worker.name : r.assignedWorkerId}</td>
                  <td style={{ maxWidth: 250 }}>{r.description}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" onClick={() => setModal({ open: true, route: r })}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="action-btn delete" onClick={() => del(r.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!routes.length && <tr><td colSpan="5" className="empty-state"><p>No routes yet</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {modal.open && <RouteModal route={modal.route} onClose={() => setModal({ open: false })} onSaved={() => { setModal({ open: false }); load(); toast('Route saved'); }} />}
    </div>
  );
}

function RouteModal({ route, onClose, onSaved }) {
  const [workers, setWorkers] = useState([]);
  useEffect(() => { fetch(`${API}/api/workers`).then(r => r.json()).then(setWorkers); }, []);
  const [form, setForm] = useState(route ? { name: route.name, assignedWorkerId: route.assignedWorkerId, description: route.description } : { name: '', assignedWorkerId: '', description: '' });
  const save = async () => {
    const url = route ? `${API}/api/routes/${route.id}` : `${API}/api/routes`;
    await fetch(url, { method: route ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    onSaved();
  };
  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{route ? 'Edit Route' : 'Add Route'}</h2>
          <button className="modal-close" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Route Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Route F - Downtown" />
          </div>
          <div className="form-group">
            <label>Assigned Worker</label>
            <select className="form-select" value={form.assignedWorkerId} onChange={e => setForm({ ...form, assignedWorkerId: e.target.value })}>
              <option value="">Select worker</option>
              {workers.map(w => <option key={w.id} value={w.id}>{w.name} ({w.id})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Areas covered by this route" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>{route ? 'Update' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}

// ── COVERAGE PAGE ──────────────────────────────────────────
function CoveragePage({ date }) {
  const [records, setRecords] = useState([]);
  const [modal, setModal] = useState(false);
  const toast = useToast();

  const load = () => fetch(`${API}/api/coverage?date=${date}`).then(r => r.json()).then(setRecords);
  useEffect(() => { load(); }, [date]);

  const del = async (id) => {
    await fetch(`${API}/api/coverage/${id}`, { method: 'DELETE' });
    toast('Record deleted');
    load();
  };

  return (
    <div>
      <div className="page-actions animate-in">
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Update Coverage
        </button>
      </div>
      <div className="card animate-in animate-delay-1">
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Route</th><th>Worker</th><th>Date</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id} style={{ animationDelay: `${i * .04}s` }}>
                  <td><strong>{r.route ? r.route.name : r.routeId}</strong></td>
                  <td>{r.worker ? r.worker.name : '-'}</td>
                  <td>{r.date}</td>
                  <td><span className={`status-chip chip-${r.status}`}><span className="chip-dot" />{r.status.replace('_', ' ')}</span></td>
                  <td style={{ maxWidth: 200, color: 'var(--text-muted)' }}>{r.notes}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn delete" onClick={() => del(r.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!records.length && <tr><td colSpan="6" className="empty-state"><p>No coverage records for this date</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {modal && <CoverageModal date={date} onClose={() => setModal(false)} onSaved={() => { setModal(false); load(); toast('Coverage updated'); }} />}
    </div>
  );
}

function CoverageModal({ date, onClose, onSaved }) {
  const [routes, setRoutes] = useState([]);
  useEffect(() => { fetch(`${API}/api/routes`).then(r => r.json()).then(setRoutes); }, []);
  const [form, setForm] = useState({ routeId: '', status: 'covered', notes: '' });
  const save = async () => {
    await fetch(`${API}/api/coverage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, date }) });
    onSaved();
  };
  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Coverage</h2>
          <button className="modal-close" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Route</label>
            <select className="form-select" value={form.routeId} onChange={e => setForm({ ...form, routeId: e.target.value })}>
              <option value="">Select route</option>
              {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="covered">Covered</option>
              <option value="partial">Partial</option>
              <option value="not_covered">Not Covered</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <input className="form-input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any notes..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── HISTORY PAGE ───────────────────────────────────────────
function HistoryPage() {
  const [data, setData] = useState([]);
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(today());

  const load = () => {
    fetch(`${API}/api/history?from=${from}&to=${to}`).then(r => r.json()).then(setData);
  };
  useEffect(() => { load(); }, [from, to]);

  return (
    <div>
      <div className="page-actions animate-in">
        <div className="date-range-picker">
          <label>From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          <label>To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </div>
      <div className="history-timeline">
        {data.map((day, i) => {
          const totalRoutes = day.coverage.covered + day.coverage.partial + day.coverage.notCovered || 1;
          const totalWorkers = day.attendance.present + day.attendance.absent + day.attendance.onLeave || 1;
          return (
            <div key={day.date} className="history-day animate-in" style={{ animationDelay: `${i * .08}s` }}>
              <div className="history-day-header">
                <h3>{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <span style={{ fontSize: '.8rem', color: 'var(--text-dim)' }}>
                  {day.attendance.present + day.attendance.absent + day.attendance.onLeave} workers
                </span>
              </div>
              <div className="history-day-stats">
                <div className="history-stat">
                  <span className="dot dot-green" />
                  <span className="history-stat-label">Present:</span>
                  <span className="history-stat-value">{day.attendance.present}</span>
                </div>
                <div className="history-stat">
                  <span className="dot dot-red" />
                  <span className="history-stat-label">Absent:</span>
                  <span className="history-stat-value">{day.attendance.absent}</span>
                </div>
                <div className="history-stat">
                  <span className="dot dot-amber" />
                  <span className="history-stat-label">Leave:</span>
                  <span className="history-stat-value">{day.attendance.onLeave}</span>
                </div>
                <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
                <div className="history-stat">
                  <span className="dot dot-teal" />
                  <span className="history-stat-label">Routes Covered:</span>
                  <span className="history-stat-value">{day.coverage.covered}/{totalRoutes}</span>
                </div>
                <div className="history-stat">
                  <span className="dot dot-amber" />
                  <span className="history-stat-label">Partial:</span>
                  <span className="history-stat-value">{day.coverage.partial}</span>
                </div>
                <div className="history-stat">
                  <span className="dot dot-red" />
                  <span className="history-stat-label">Uncovered:</span>
                  <span className="history-stat-value">{day.coverage.notCovered}</span>
                </div>
              </div>
              <div style={{ padding: '0 24px 16px' }}>
                <div className="history-bar">
                  <div className="history-bar-fill" style={{ width: `${(day.attendance.present / totalWorkers) * 100}%`, background: '#a855f7' }} />
                  <div className="history-bar-fill" style={{ width: `${(day.attendance.absent / totalWorkers) * 100}%`, background: '#ef4444' }} />
                  <div className="history-bar-fill" style={{ width: `${(day.attendance.onLeave / totalWorkers) * 100}%`, background: '#f59e0b' }} />
                </div>
              </div>
            </div>
          );
        })}
        {!data.length && <div className="empty-state animate-in"><p>No history data in this range</p></div>}
      </div>
    </div>
  );
}

// ── MOUNT ──────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
