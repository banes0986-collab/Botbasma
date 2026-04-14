const net = require('net');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Bellekte tutulan veriler (Geliştirmek için veritabanına bağlanabilir)
let users = [{ email: 'triggerbaba31@gmail.com', pass: 'trigger3163', rank: 'KURUCU' }];
let protectedServers = [];
let shieldActive = false;

// --- AUTH SİSTEMİ ---
app.post('/api/register', (req, res) => {
    const { email, pass } = req.body;
    users.push({ email, pass, rank: 'OYUNCU' });
    res.json({ success: true, msg: "Kayıt başarılı!" });
});

app.post('/api/login', (req, res) => {
    const { email, pass } = req.body;
    const user = users.find(u => u.email === email && u.pass === pass);
    if (user) res.json({ success: true, user });
    else res.status(401).json({ success: false });
});

// --- SUNUCU YÖNETİMİ ---
app.post('/api/add-server', (req, res) => {
    const { ip, port, name } = req.body;
    protectedServers.push({ id: Date.now(), ip, port, name, status: 'Güvende' });
    res.json({ success: true });
});

app.get('/api/admin/users', (req, res) => {
    res.json(users); // Sadece Kurucu görebilir (Panelde kontrol ediliyor)
});

// --- GERÇEK TCP KORUMA MOTORU ---
let activeProxy = null;
app.post('/api/shield/toggle', (req, res) => {
    const { targetIp, targetPort, active } = req.body;
    
    if (active && !activeProxy) {
        activeProxy = net.createServer((client) => {
            const server = net.createConnection(targetPort, targetIp, () => {
                client.pipe(server);
                server.pipe(client);
            });
            server.on('
                      
