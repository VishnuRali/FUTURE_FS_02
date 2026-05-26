// models/Lead.js

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString() }
});

const leadSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String, default: '' },
  company: { type: String, default: '' },
  source:  {
    type: String,
    enum: ['Website', 'LinkedIn', 'Referral', 'Cold Outreach', 'Social Media', 'Other'],
    default: 'Website'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted'],
    default: 'new'
  },
  notes: [noteSchema]
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
