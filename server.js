const net = require('net');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// --- SİSTEM AYARLARI ---
const MC_CONFIG = {
    IP: '127.0.0.1', // Buraya korumak istediğin sunucu IP'sini yaz
    PORT: 25565,
    SHIELD_PORT: 25577
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- VERİTABANI (Basit JSON Mantığı) ---
let users = [
    { mail: 'triggerbaba31@gmail.com', pass: 'trigger3163', role: 'KURUCU' }
];
let blackList = new Set();
let isShieldActive = true;

// --- API: KAYIT VE YETKİ ---
app.post('/api/register', (req, res) => {
    const { mail, pass } = req.body;
    if (users.find(u => u.mail === mail)) return res.json({ success: false, msg: "Bu mail zaten kayıtlı!" });
    
    users.push({ mail, pass, role: 'OYUNCU' });
    res.json({ success: true, msg: "Kayıt başarılı! Admin onayından sonra panel açılır." });
});

app.post('/api/login', (req, res) => {
    const { mail, pass } = req.body;
    const user = users.find(u => u.mail === mail && u.pass === pass);
    if (user) res.json({ success: true, user });
    else res.status(401).json({ success: false });
});

// Kurucuya özel: Tüm kullanıcıları görme
app.get('/api/admin/users', (req, res) => {
    const adminMail = req.headers['admin-mail'];
    const admin = users.find(u => u.mail === adminMail && u.role === 'KURUCU');
    if (admin) res.json(users);
    else res.status(403).send("Yetkin yok!");
});

// --- SHIELD KORUMA MOTORU ---
const shield = net.createServer((client) => {
    if (!isShieldActive || blackList.has(client.remoteAddress)) return client.destroy();

    const target = net.createConnection(MC_CONFIG.PORT, MC_CONFIG.IP, () => {
        
