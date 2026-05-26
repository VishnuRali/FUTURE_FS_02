# LeadFlow CRM — Client Lead Management System
### Full Stack Web Development — Task 2 (2026)

A **Mini CRM** built for freelancers and agencies to manage client leads — track status, add follow-up notes, and measure conversions.

---

## 📁 Project Structure

```
leadflow-crm/
│
├── frontend/
│   ├── index.html       ← Main HTML (structure only)
│   ├── style.css        ← All styles
│   └── app.js           ← All JavaScript logic
│
├── backend/
│   ├── server.js        ← Express server entry point
│   ├── models/
│   │   └── Lead.js      ← MongoDB Lead schema
│   └── routes/
│       ├── leads.js     ← CRUD API routes for leads
│       └── auth.js      ← Login route
│
├── package.json
└── README.md
```

---

## 🚀 How to Run

### Option 1 — Frontend only (no backend needed)
1. Open `frontend/index.html` in any browser
2. Login: **admin / admin123**
3. Data saves in browser localStorage automatically

### Option 2 — Full Stack (with backend)

**Requirements:** Node.js, MongoDB

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB (if running locally)
mongod

# 3. Start the server
npm start
# or for development with auto-reload:
npm run dev

# 4. Open browser at:
http://localhost:5000
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Storage (offline) | Browser localStorage |

---

## ✅ Features

- 🔐 Admin login / logout
- ➕ Add new leads (name, email, phone, company, source)
- 📋 View all leads in a table with search & filters
- ✏️ Edit lead details and status
- 🗑️ Delete leads
- 🔄 Quick status update: New → Contacted → Converted
- 📝 Add follow-up notes to each lead
- 📊 Dashboard with stats + pipeline visualization
- ⬇️ Export all leads to CSV
- 📱 Responsive design (mobile friendly)

## 🌐 API Endpoints (Backend)

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Admin login |
| GET | /api/leads | Get all leads (supports ?status= & ?search=) |
| GET | /api/leads/:id | Get one lead |
| POST | /api/leads | Create a lead |
| PUT | /api/leads/:id | Update a lead |
| DELETE | /api/leads/:id | Delete a lead |
| POST | /api/leads/:id/notes | Add a note to a lead |

---

## 🌐 Deploy to GitHub Pages (Frontend only)

1. Create a GitHub repo
2. Upload the `frontend/` folder contents
3. Go to **Settings → Pages → Source: main branch**
4. Live at `https://yourusername.github.io/repo-name`

---

*Built for Full Stack Web Development — Task 2 (2026)*
