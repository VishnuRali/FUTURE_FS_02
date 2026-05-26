// =============================================
//  LeadFlow CRM - app.js
// =============================================

// ─── STATE ───────────────────────────────────
let leads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
let currentFilter = 'all';
let editingId = null;

// ─── HELPERS ─────────────────────────────────
function save() {
  localStorage.setItem('crm_leads', JSON.stringify(leads));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── SEED DEMO DATA ───────────────────────────
if (!leads.length) {
  leads = [
    {
      id: uid(), name: 'Aisha Sharma', email: 'aisha@techcorp.com',
      phone: '+91 9876543210', source: 'Website', status: 'new',
      company: 'TechCorp',
      notes: [{ text: 'Interested in web development services', date: new Date().toLocaleDateString() }],
      date: '2026-05-21'
    },
    {
      id: uid(), name: 'Rohan Mehta', email: 'rohan@startup.io',
      phone: '+91 8765432109', source: 'LinkedIn', status: 'contacted',
      company: 'Startup.io',
      notes: [{ text: 'Had a call, sending proposal', date: new Date().toLocaleDateString() }],
      date: '2026-05-22'
    },
    {
      id: uid(), name: 'Priya Nair', email: 'priya@business.com',
      phone: '+91 7654321098', source: 'Referral', status: 'converted',
      company: 'Business Ltd',
      notes: [{ text: 'Signed contract for ₹50,000 project', date: new Date().toLocaleDateString() }],
      date: '2026-05-23'
    },
    {
      id: uid(), name: 'Karan Singh', email: 'karan@agency.com',
      phone: '+91 6543210987', source: 'Cold Outreach', status: 'new',
      company: 'Agency Co', notes: [], date: '2026-05-24'
    },
  ];
  save();
}

// ─── AUTH ─────────────────────────────────────
function doLogin() {
  const username = document.getElementById('l-user').value.trim();
  const password = document.getElementById('l-pass').value.trim();

  if (username === 'admin' && password === 'admin123') {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.add('visible');
    renderAll();
  } else {
    document.getElementById('login-err').style.display = 'block';
  }
}

function doLogout() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app').classList.remove('visible');
  document.getElementById('l-user').value = '';
  document.getElementById('l-pass').value = '';
}

// Allow Enter key on password field
document.getElementById('l-pass').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') doLogin();
});

// ─── NAVIGATION ───────────────────────────────
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  btn.classList.add('active');
  renderAll();
}

// ─── RENDER ALL ───────────────────────────────
function renderAll() {
  renderDashboard();
  renderTable();
  renderStatusPage('new', 'new-tbody');
  renderStatusPage('contacted', 'contacted-tbody');
  renderStatusPage('converted', 'converted-tbody');
}

// ─── STATUS BADGE ─────────────────────────────
function statusBadge(status) {
  const classMap = {
    new: 'badge-new',
    contacted: 'badge-contacted',
    converted: 'badge-converted'
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return `<span class="badge ${classMap[status]}">${label}</span>`;
}

// ─── DASHBOARD ────────────────────────────────
function renderDashboard() {
  const total = leads.length;
  const newCount = leads.filter(l => l.status === 'new').length;
  const contactedCount = leads.filter(l => l.status === 'contacted').length;
  const convertedCount = leads.filter(l => l.status === 'converted').length;
  const rate = total ? Math.round((convertedCount / total) * 100) : 0;

  // Stats cards
  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card">
      <div class="stat-label-sm">Total Leads</div>
      <div class="stat-num">${total}</div>
      <div class="stat-sub">All time</div>
    </div>
    <div class="stat-card">
      <div class="stat-label-sm">New</div>
      <div class="stat-num" style="color:var(--new)">${newCount}</div>
      <div class="stat-sub">Awaiting contact</div>
    </div>
    <div class="stat-card">
      <div class="stat-label-sm">Contacted</div>
      <div class="stat-num" style="color:var(--contacted)">${contactedCount}</div>
      <div class="stat-sub">In progress</div>
    </div>
    <div class="stat-card">
      <div class="stat-label-sm">Conversion Rate</div>
      <div class="stat-num" style="color:var(--converted)">${rate}%</div>
      <div class="stat-sub">${convertedCount} converted</div>
    </div>
  `;

  // Pipeline bar
  const newPct = total ? (newCount / total * 100) : 33;
  const coPct = total ? (contactedCount / total * 100) : 33;
  const cvPct = total ? (convertedCount / total * 100) : 34;

  document.getElementById('pipeline-bar').innerHTML = `
    <div class="pipeline-seg" style="flex:${newPct};background:var(--new)"></div>
    <div class="pipeline-seg" style="flex:${coPct};background:var(--contacted)"></div>
    <div class="pipeline-seg" style="flex:${cvPct};background:var(--converted)"></div>
  `;

  document.getElementById('pipeline-legend').innerHTML = `
    <div class="legend-item">
      <span><span class="legend-dot" style="background:var(--new)"></span>New</span>
      <strong>${newCount}</strong>
    </div>
    <div class="legend-item">
      <span><span class="legend-dot" style="background:var(--contacted)"></span>Contacted</span>
      <strong>${contactedCount}</strong>
    </div>
    <div class="legend-item">
      <span><span class="legend-dot" style="background:var(--converted)"></span>Converted</span>
      <strong>${convertedCount}</strong>
    </div>
  `;

  // Recent leads (last 5)
  const recent = [...leads].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);
  document.getElementById('recent-leads').innerHTML = recent.length
    ? recent.map(l => `
        <div class="recent-lead">
          <div>
            <div style="font-weight:600;font-size:0.88rem">${l.name}</div>
            <div style="font-size:0.78rem;color:var(--muted)">${l.email}</div>
          </div>
          ${statusBadge(l.status)}
        </div>
      `).join('')
    : '<div style="color:var(--muted);font-size:0.85rem">No leads yet</div>';
}

// ─── LEADS TABLE ──────────────────────────────
function renderTable() {
  const query = (document.getElementById('search-box')?.value || '').toLowerCase();

  const filtered = leads.filter(l => {
    if (currentFilter !== 'all' && l.status !== currentFilter) return false;
    if (query) {
      const match =
        l.name.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query) ||
        (l.company || '').toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  const tbody = document.getElementById('leads-tbody');
  if (!tbody) return;

  tbody.innerHTML = filtered.length
    ? filtered.map(l => `
        <tr>
          <td>
            <div class="lead-name">${l.name}</div>
            <div class="lead-email">${l.email}${l.company ? ' · ' + l.company : ''}</div>
          </td>
          <td>${l.source}</td>
          <td>${statusBadge(l.status)}</td>
          <td style="color:var(--muted)">${l.date}</td>
          <td>
            <div class="action-btns">
              <button class="action-btn" onclick="openEdit('${l.id}')">Edit</button>
              <button class="action-btn" onclick="quickStatus('${l.id}')">Update Status</button>
              <button class="action-btn danger" onclick="deleteLead('${l.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `).join('')
    : `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📭</div>No leads found</div></td></tr>`;
}

// ─── STATUS PAGES ─────────────────────────────
function renderStatusPage(status, tbodyId) {
  const filtered = leads.filter(l => l.status === status);
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.innerHTML = filtered.length
    ? filtered.map(l => `
        <tr>
          <td>
            <div class="lead-name">${l.name}</div>
            <div class="lead-email">${l.email}</div>
          </td>
          <td>${l.source}</td>
          <td style="color:var(--muted)">${l.date}</td>
          <td>
            <div class="action-btns">
              <button class="action-btn" onclick="openEdit('${l.id}')">View/Edit</button>
              <button class="action-btn danger" onclick="deleteLead('${l.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `).join('')
    : `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">📭</div>No ${status} leads</div></td></tr>`;
}

// ─── FILTER ───────────────────────────────────
function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTable();
}

// ─── MODAL: ADD ───────────────────────────────
function openModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Add New Lead';
  document.getElementById('f-name').value = '';
  document.getElementById('f-email').value = '';
  document.getElementById('f-phone').value = '';
  document.getElementById('f-company').value = '';
  document.getElementById('f-source').value = 'Website';
  document.getElementById('f-status').value = 'new';
  document.getElementById('f-note').value = '';
  document.getElementById('notes-section').style.display = 'none';
  document.getElementById('modal-overlay').classList.add('open');
}

// ─── MODAL: EDIT ──────────────────────────────
function openEdit(id) {
  const lead = leads.find(x => x.id === id);
  if (!lead) return;

  editingId = id;
  document.getElementById('modal-title').textContent = 'Edit Lead';
  document.getElementById('f-name').value = lead.name;
  document.getElementById('f-email').value = lead.email;
  document.getElementById('f-phone').value = lead.phone || '';
  document.getElementById('f-company').value = lead.company || '';
  document.getElementById('f-source').value = lead.source;
  document.getElementById('f-status').value = lead.status;
  document.getElementById('f-note').value = '';
  document.getElementById('notes-section').style.display = 'block';
  renderNotes(lead.notes || []);
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ─── NOTES ────────────────────────────────────
function renderNotes(notes) {
  document.getElementById('notes-list').innerHTML = notes.length
    ? notes.map(n => `
        <div class="note-item">
          ${n.text}
          <div class="note-date">${n.date}</div>
        </div>
      `).join('')
    : '<div style="color:var(--muted);font-size:0.82rem">No notes yet</div>';
}

function addNote() {
  const input = document.getElementById('note-input');
  const text = input.value.trim();
  if (!text || !editingId) return;

  const lead = leads.find(x => x.id === editingId);
  if (!lead) return;

  lead.notes = lead.notes || [];
  lead.notes.push({ text, date: new Date().toLocaleDateString() });
  input.value = '';
  save();
  renderNotes(lead.notes);
  showToast('Note added!');
}

// ─── SAVE LEAD ────────────────────────────────
function saveLead() {
  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();

  if (!name || !email) {
    showToast('Name and email are required!');
    return;
  }

  const noteText = document.getElementById('f-note').value.trim();
  const initialNotes = noteText
    ? [{ text: noteText, date: new Date().toLocaleDateString() }]
    : [];

  if (editingId) {
    // UPDATE existing lead
    const lead = leads.find(x => x.id === editingId);
    Object.assign(lead, {
      name,
      email,
      phone: document.getElementById('f-phone').value.trim(),
      company: document.getElementById('f-company').value.trim(),
      source: document.getElementById('f-source').value,
      status: document.getElementById('f-status').value,
    });
    if (noteText) lead.notes.push(...initialNotes);
    showToast('Lead updated!');
  } else {
    // CREATE new lead
    leads.unshift({
      id: uid(),
      name,
      email,
      phone: document.getElementById('f-phone').value.trim(),
      company: document.getElementById('f-company').value.trim(),
      source: document.getElementById('f-source').value,
      status: document.getElementById('f-status').value,
      notes: initialNotes,
      date: new Date().toLocaleDateString()
    });
    showToast('Lead added!');
  }

  save();
  closeModal();
  renderAll();
}

// ─── QUICK STATUS CYCLE ───────────────────────
function quickStatus(id) {
  const lead = leads.find(x => x.id === id);
  if (!lead) return;

  const cycle = { new: 'contacted', contacted: 'converted', converted: 'new' };
  lead.status = cycle[lead.status];
  save();
  renderAll();
  showToast(`Status → ${lead.status}`);
}

// ─── DELETE ───────────────────────────────────
function deleteLead(id) {
  if (!confirm('Delete this lead? This cannot be undone.')) return;
  leads = leads.filter(x => x.id !== id);
  save();
  renderAll();
  showToast('Lead deleted');
}

// ─── EXPORT CSV ───────────────────────────────
function exportCSV() {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Date Added', 'Notes'];
  const rows = leads.map(l => [
    l.name,
    l.email,
    l.phone || '',
    l.company || '',
    l.source,
    l.status,
    l.date,
    (l.notes || []).map(n => n.text).join(' | ')
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  link.download = 'leads_export_' + new Date().toISOString().slice(0, 10) + '.csv';
  link.click();
  showToast('Leads exported to CSV!');
}

// ─── TOAST ────────────────────────────────────
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
