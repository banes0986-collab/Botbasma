const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;

    if (!ip || !isim) {
        return res.status(400).send("Hata: Veriler eksik.");
    }

    console.log(`Baglanti istegi: ${isim} -> ${ip}`);

    const bot = mineflayer.createBot({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1" 
    });

    bot.on('spawn', () => console.log(`${isim} oyuna girdi!`));
    bot.on('error', (err) => console.log("Hata:", err.message));
    bot.on('kicked', (reason) => console.log("Atildi:", reason));

    res.send(`Sinyal firlatildi! ${isim} su an sızıyor...`);
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda aktif.`);
});
