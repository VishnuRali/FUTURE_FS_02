// routes/auth.js

const express = require('express');
const router = express.Router();

// Simple admin login (hardcoded for demo)
// In production: use bcrypt + JWT
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
