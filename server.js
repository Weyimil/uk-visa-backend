const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/visas', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'visas.json');
  if (!fs.existsSync(dataPath)) {
    return res.status(404).json({ error: 'Data not found. Run scraper.' });
  }
  const visas = JSON.parse(fs.readFileSync(dataPath));
  res.json(visas);
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
