const net = require('net');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let activeShields = {}; // Aktif portları burada tutacağız

// --- ÇOKLU PORT KORUMA FONKSİYONU ---
function createShield(shieldPort, targetIp, targetPort) {
    if (activeShields[shieldPort]) {
        activeShields[shieldPort].server.close();
    }

    const server = net.createServer((client) => {
        // TCP Flood Koruması & Hata Yönetimi
        client.on('error', () => client.destroy());

        const target = net.createConnection(targetPort, targetIp, () => {
            client.pipe(target);
            target.pipe(client);
        });

        target.on('error', () => client.destroy());
        target.setTimeout(5000, () => target.destroy());
    });

    server.listen(shieldPort, () => {
        console.log(`[CRM SHIELD] Port ${shieldPort} -> ${targetIp}:${targetPort} AKTİF`);
    });

    activeShields[shieldPort] = {
        server: server,
        target: `${targetIp}:${targetPort}`,
        status: 'Online'
    };
}

// --- API: YENİ PORT EKLE ---
app.post('/api/shield/add', (req, res) => {
    const { shieldPort, targetIp, targetPort } = req.body;
    try {
        createShield(parseInt(shieldPort), targetIp, parseInt(targetPort));
        res.json({ success: true, msg: `${shieldPort} portu korumaya alındı!` });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
});

// --- API: AKTİF KORUMALARI LİSTELE ---
app.get('/api/shield/list', (req, res) => {
    res.json(Object.keys(activeShields).map(port => ({
        port: port,
        target: activeShields[port].target,
        status: activeShields[port].status
    })));
});

app.listen(3000, () => console.log("CRM Security API: 3000 portunda!"));
