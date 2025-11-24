const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

// GET /admin/questions
router.get('/', async (req, res) => {
  const { topic, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (topic) filter.topic = topic;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Question.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    Question.countDocuments(filter)
  ]);

  res.json({ items, total });
});

// PUT /admin/questions/:id
router.put('/:id', async (req, res) => {
  const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(q);
});

// DELETE /admin/questions/:id
router.delete('/:id', async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
