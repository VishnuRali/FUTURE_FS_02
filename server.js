// =============================================
//  LeadFlow CRM - server.js (Express Backend)
// =============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const leadsRouter = require('./routes/leads');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── DATABASE CONNECTION ──────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/leadflow_crm';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── ROUTES ───────────────────────────────────
app.use('/api/leads', leadsRouter);
app.use('/api/auth', authRouter);

// ─── ROOT ─────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── START SERVER ─────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 LeadFlow CRM running at http://localhost:${PORT}`);
});
