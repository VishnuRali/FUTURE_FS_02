// routes/leads.js

const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET all leads
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { email:   { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create lead
router.post('/', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update lead
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add note to lead
router.post('/:id/notes', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    lead.notes.push({ text: req.body.text });
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
