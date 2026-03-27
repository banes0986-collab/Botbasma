const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

let activeBot = null;
let antiBotInterval = null;

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;
    if (!ip || !isim) return res.status(400).send("Veri eksik.");

    if (activeBot) {
        activeBot.quit();
        clearInterval(antiBotInterval);
    }

    // SONAR BYPASS: Bağlantı ayarlarını optimize ettik
    activeBot = mineflayer.createBot({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1",
        hideErrors: true,
        checkTimeoutInterval: 60000, // Zaman aşımını artırdık
        viewDistance: "tiny" // Sunucuya yük bindirmemesi için (insansı ayar)
    });

    activeBot.on('spawn', () => {
        console.log(`${isim} korumaları deldi!`);
        
        // 1. ADIM: İnsansı Gecikme ile Kayıt
        // Sunucuya girer girmez yazmak bot olduğunu belli eder. 4 saniye bekle.
        setTimeout(() => {
            activeBot.chat('/register trigger123 trigger123');
            activeBot.chat('/login trigger123');
        }, 4000);

        // 2. ADIM: Karmaşık Hareket Döngüsü (Sonar'ı kandırır)
        antiBotInterval = setInterval(() => {
            if (!activeBot) return clearInterval(antiBotInterval);
            
            // Sadece zıplama yetmez, biraz sağa sola bakmalı
            const yaw = (Math.random() * 360) * (Math.PI / 180);
            const pitch = ((Math.random() * 40) - 20) * (Math.PI / 180);
            activeBot.look(yaw, pitch);

            // Rastgele bir yöne 1 saniye yürü
            activeBot.setControlState('forward', true);
            setTimeout(() => activeBot.setControlState('forward', false), 1000);

            // Rastgele chat (".", "sa", "as" gibi kısa şeyler)
            const msgs = [".", "sa", "as", "..", " "];
            activeBot.chat(msgs[Math.floor(Math.random() * msgs.length)]);
            
        }, 15000); // Her 15 saniyede bir insansı hareket
    });

    // SONAR Engeli Varsa Logda Görelim
    activeBot.on('kicked', (reason) => {
        console.log("Sunucu bizi reddetti:", reason);
    });

    activeBot.on('error', (err) => console.log("Hata:", err.message));

    res.send(`Sizma girisimi baslatildi: ${isim}`);
});

// Diğer komutlar (mesaj, zipla, cikis) aynı kalsın...
app.listen(port, () => console.log(`Bypass Ünitesi Aktif.`));
                       
