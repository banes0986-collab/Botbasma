const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000; // Render portu 10000 sever

app.use(cors());

let activeBot = null;

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;
    if (activeBot) activeBot.quit();

    console.log(`[SIZMA] Deneniyor: ${isim}`);

    activeBot = mineflayer.createBot({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1",
        // SONAR BYPASS AYARLARI
        connectTimeout: 30000,
        keepAlive: true,
        hideErrors: true
    });

    activeBot.on('spawn', () => {
        console.log("Sizma Basarili!");
        // Hemen komut yazma, 5 saniye bekle (insan gibi)
        setTimeout(() => {
            activeBot.chat('/register trigger123 trigger123');
        }, 5000);
        
        // Rastgele zıpla
        setInterval(() => {
            if(activeBot) {
                activeBot.setControlState('jump', true);
                setTimeout(() => activeBot.setControlState('jump', false), 500);
            }
        }, 15000);
    });

    activeBot.on('kicked', (reason) => console.log("Atildi:", reason));
    activeBot.on('error', (err) => console.log("Hata:", err.message));

    res.send("Sinyal gonderildi, loglari izle.");
});

app.get('/bot-zipla', (req, res) => res.send("OK")); // Lamba yeşil yansın diye

app.listen(port, () => console.log(`Sunucu ${port} portunda aktif.`));
