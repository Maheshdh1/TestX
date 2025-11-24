const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const { parseDocxText, removeDuplicates } = require('../utils/parseDocx');
const Question = require('../models/Question');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /upload/multiple
router.post('/multiple', upload.array('files'), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    let allQuestions = [];

    for (const file of files) {
      const result = await mammoth.extractRawText({ path: file.path });
      const text = result.value || '';
      const parsed = parseDocxText(text, file.originalname);
      allQuestions = allQuestions.concat(parsed);
    }

    const merged = removeDuplicates(allQuestions);

    try {
      await Question.insertMany(merged, { ordered: false });
    } catch (e) {
      console.log('InsertMany encountered duplicates, continuing...');
    }

    const topics = [...new Set(merged.map(q => q.topic))];

    res.json({ questions: merged, topics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to parse and save documents' });
  }
});

module.exports = router;
