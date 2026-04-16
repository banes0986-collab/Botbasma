const net = require('net');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIG ---
const API_PORT = 3000;
const SHIELD_PORT = 25707; // Oyuncuların gireceği port
let TARGET_MC_IP = '127.0.0.1';
let TARGET_MC_PORT = 25565;

// --- SHIELD ENGINE ---
const shield = net.createServer((client) => {
    // Basit TCP Flood Koruması
    client.on('error', () => client.destroy());

    const target = net.createConnection(TARGET_MC_PORT, TARGET_MC_IP, () => {
        client.pipe(target);
        target.pipe(client);
    });

    target.on('error', () => client.destroy());
    client.on('timeout', () => client.destroy());
});

// --- API ENDPOINTS ---
app.post('/api/shield/config', (req, res) => {
    const { ip, port } = req.body;
    TARGET_MC_IP = ip;
    TARGET_MC_PORT = port;
    console.log(`[SHIELD] Yeni Hedef: ${ip}:${port}`);
    res.json({ success: true });
});

shield.listen(SHIELD_PORT, () => console.log(`[SHIELD] Korumalı Port Aktif: ${SHIELD_PORT}`));
app.listen(API_PORT, () => console.log(`[CRM-API] Dashboard API Aktif: ${API_PORT}`));
