const express = require('express');
const cors = require('cors');
const path = require('path');
const uploadRoutes = require('./routes/upload');
const adminQuestionsRoutes = require('./routes/adminQuestions');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Question generator API' });
});

app.use('/upload', uploadRoutes);
app.use('/admin/questions', adminQuestionsRoutes);

module.exports = app;
