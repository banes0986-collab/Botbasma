const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Panelden gelen bağlantıları açar
app.use(express.json());

let activeBot = null;
let antiBotInterval = null;

// 1. BOTU SUNUCUYA GÖNDERME
app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;
    if (!ip || !isim) return res.status(400).send("Hata: IP veya Isim eksik.");

    // Eğer zaten bir bot varsa, yenisini açmadan önce eskisini temizle
    if (activeBot) {
        activeBot.quit();
        clearInterval(antiBotInterval);
    }

    console.log(`[SIZMA] Hedef: ${ip} | Kimlik: ${isim}`);

    activeBot = mineflayer.createBot({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1", // İstediğin güncel sürüm
        hideErrors: true
    });

    // BOT SUNUCUYA GİRDİĞİNDE
    activeBot.on('spawn', () => {
        console.log(`${isim} basariyla sizdi!`);
        
        // OTOMATIK KAYIT SİSTEMİ (2 saniye gecikmeli - İnsansı tepki)
        setTimeout(() => {
            activeBot.chat('/register trigger123 trigger123');
            activeBot.chat('/login trigger123');
        }, 2000);

        // ANTI-BOT VE SONAR BYPASS (Rastgele hareket ve chat)
        antiBotInterval = setInterval(() => {
            if (!activeBot) return clearInterval(antiBotInterval);
            
            // Küçük bir zıplama hareketi
            activeBot.setControlState('jump', true);
            setTimeout(() => activeBot.setControlState('jump', false), 500);
            
            // Rastgele bir yöne bakış (Gözetleme simülasyonu)
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            activeBot.look(yaw, pitch);

            // Chat'e "." atarak AFK sistemini kandırır
            activeBot.chat('.');
        }, 20000); // Her 20 saniyede bir yapar
    });

    activeBot.on('error', (err) => console.log("Kritik Hata:", err.message));
    activeBot.on('kicked', (reason) => console.log("Atildi:", reason));

    res.send(`Operasyon Baslatildi: ${isim} su an ${ip} yolunda.`);
});

// 2. CHAT'E MESAJ GÖNDERME
app.get('/bot-mesaj', (req, res) => {
    const { mesaj } = req.query;
    if (activeBot && mesaj) {
        activeBot.chat(mesaj);
        res.send(`Mesaj Gonderildi: ${mesaj}`);
    } else {
        res.send("Hata: Bot aktif degil!");
    }
});

// 3. MANUEL ZIPLATMA
app.get('/bot-zipla', (req, res) => {
    if (activeBot) {
        activeBot.setControlState('jump', true);
        setTimeout(() => activeBot.setControlState('jump', false), 400);
        res.send("Bot ziplatildi.");
    } else {
        res.send("Sunucu Aktif (Beklemede)");
    }
});

// 4. BAĞLANTIYI KES
app.get('/bot-cikis', (req, res) => {
    if (activeBot) {
        activeBot.quit();
        activeBot = null;
        clearInterval(antiBotInterval);
        res.send("Bot sunucudan ayrildi.");
    } else {
        res.send("Aktif bot bulunamadi.");
    }
});

app.listen(port, () => {
    console.log(`Bot Motoru ${port} portunda devrede.`);
});
