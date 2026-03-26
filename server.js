const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;

    if (!ip || !isim) {
        return res.send("Hata: IP veya Isim eksik!");
    }

    console.log(`Baglanti istegi geldi: ${isim} -> ${ip}`);

    const bot = mineflayer.createBot({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1" // İSTEDİĞİN SÜRÜMÜ BURAYA YAZDIK!
    });

    bot.on('spawn', () => {
        console.log(`${isim} basariyla 1.20.1 surumuyle girdi!`);
    });

    bot.on('error', (err) => {
        console.log("Bot hatasi oluştu:", err.message);
    });

    bot.on('kicked', (reason) => {
        console.log("Bot sunucudan atildi:", reason);
    });

    res.send(`Sinyal firlatildi! ${isim} su an ${ip} (1.20.1) adresine siziyor...`);
});

app.listen(port, () => {
    console.log(`Bot Motoru ${port} portunda aktif.`);
});
