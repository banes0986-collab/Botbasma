const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let activeBot = null;

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;
    if (activeBot) activeBot.quit();

    console.log(`[SIZMA] Protokol Başlatıldı: ${isim}`);

    activeBot = mineflayer.createBot({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1",
        // SONAR BYPASS AYARLARI
        hideErrors: true,
        plugins: {}, 
        checkTimeoutInterval: 90000,
        // Sunucuya 'ben gerçek bir oyuncuyum' demesi için:
        auth: 'offline'
    });

    activeBot.on('spawn', () => {
        console.log("Korumalar Delindi! İçerideyiz.");
        
        // 6 saniye bekle (Sonar'ın ilk taramasını atlatmak için)
        setTimeout(() => {
            activeBot.chat('/register trigger123 trigger123');
            activeBot.chat('/login trigger123');
        }, 6000);
    });

    activeBot.on('kicked', (reason) => {
        console.log("Sunucu Reddi:", reason);
    });

    activeBot.on('error', (err) => console.log("Bağlantı Hatası:", err.message));

    res.send("Sızma komutu iletildi. Logları izle.");
});

app.get('/bot-zipla', (req, res) => res.send("Sistem Aktif"));

app.listen(port, () => console.log(`Bypass Ünitesi ${port} portunda hazır.`));
