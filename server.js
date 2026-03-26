const express = require('express');
const mineflayer = require('mineflayer');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Tarayıcıdan gelen isteği yakalayan kısım
app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;

    if (!ip || !isim) {
        return res.send("Hata: IP veya İsim eksik!");
    }

    // Minecraft Botunu Oluştur
    const bot = mineflayer.createBot({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.8.9" // Sunucu sürümüne göre değiştirebilirsin
    });

    bot.on('spawn', () => {
        console.log(`${isim} sunucuya girdi!`);
    });

    bot.on('error', (err) => {
        console.log("Bot hatası:", err);
    });

    res.send(`Bot ${isim} ismiyle ${ip} adresine yönlendirildi!`);
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda aktif.`);
});
