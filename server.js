const express = require('express');
const path = require('path');
const { startBot } = require('./bot');

const app = express();
const PORT = process.env.PORT || 3000;

// Ön yüzden gönderilen JSON verilerini okumak için zorunlu
app.use(express.json());
// CSS ve statik dosyaları dışarı açar
app.use(express.static(path.join(__dirname)));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Butona basıldığında tetiklenecek olan bot gönderme API'si
app.post('/api/send-bot', (req, res) => {
    const { ip, port } = req.body;

    if (!ip || !port) {
        return res.status(400).json({ success: false, message: "Lütfen geçerli bir IP ve Port girin!" });
    }

    // Botu dinamik verilerle başlatıyoruz
    startBot(ip, parseInt(port));

    res.json({ 
        success: true, 
        message: `${ip}:${port} adresine LegacyBot başarıyla yönlendirildi!` 
    });
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`[LegacyBots] Dinamik Panel Başlatıldı!`);
    console.log(`[LegacyBots] Adres: http://localhost:${PORT}`);
    console.log(`==================================================`);
});
