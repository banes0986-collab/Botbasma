const express = require('express');
const path = require('path');
const botManager = require('./bot.js');

const app = express();
const PORT = 6000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let logs = [];

function addLog(msg) {
  const timestamp = new Date().toLocaleTimeString();
  const entry = `[${timestamp}] ${msg}`;
  logs.unshift(entry);
  if (logs.length > 50) logs.pop();
}

// API Endpoints
app.get('/api/status', (req, res) => {
  const status = botManager.getStatus();
  res.json({ ...status, logs });
});

app.post('/api/start', (req, res) => {
  const { host, port, botCount } = req.body;
  if (!host) {
    return res.status(400).json({ error: 'Sunucu IP adresi gerekli!' });
  }

  logs = [];
  botManager.startTest(host, port, botCount, addLog);
  res.json({ success: true, message: 'Test başlatıldı.' });
});

app.post('/api/stop', (req, res) => {
  botManager.stopTest();
  addLog('[SİSTEM] Test durduruldu ve tüm botlar temizlendi.');
  res.json({ success: true, message: 'Test durduruldu.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Dashboard] Dark Red Panel http://localhost:${PORT} adresinde aktif!`);
});
