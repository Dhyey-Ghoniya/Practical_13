require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./src/routes/aiRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

let tasks = [
  { id: 1, title: 'Set up GitHub Actions Pipeline', description: 'Configure .github/workflows/ci.yml with Node 18/20 testing matrix.', priority: 'High', aiGenerated: true },
  { id: 2, title: 'Build Docker Container Images', description: 'Multi-stage build for frontend and Node.js Alpine container for backend.', priority: 'Critical', aiGenerated: true }
];

app.get('/api/tasks', (req, res) => res.json({ success: true, tasks }));
app.post('/api/tasks', (req, res) => {
  const { title, description, priority, aiGenerated } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
  const newTask = {
    id: Date.now(),
    title,
    description: description || 'No description provided.',
    priority: priority || 'Medium',
    aiGenerated: Boolean(aiGenerated),
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  res.status(201).json({ success: true, message: 'Task saved successfully', task: newTask });
});

app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(` Practical 13 AI Integration Server running on port ${PORT}`);
  console.log(' Student: Ghoniya Dhyey (24CS024) | ITUE301 AWDF');
  console.log(' Secure AI Pipeline: Backend Key Only (.env) & Graceful Fallback');
  console.log('====================================================');
});