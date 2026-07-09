const express = require('express');
const path = require('path');
const { startBot } = require('./bot'); // bot.js dosyasındaki fonksiyonu çağırır

const app = express();
// Port ayarı: Vercel/Glitch gibi platformlar veya yerel çalıştırıcılar için dinamik port desteği
const PORT = process.env.PORT || 3000;

// Klasördeki style.css ve diğer statik dosyaların tarayıcı tarafından okunmasını sağlar
app.use(express.static(path.join(__dirname)));

// Ana sayfaya (tarayıcıdan girildiğinde) index.html dosyasını gönderir
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// index.html içerisindeki fetch('/status') fonksiyonunun veri alacağı API endpoint'i
app.get('/status', (req, res) => {
    res.json({ 
        status: "Aktif", 
        message: "LegacyBot_724 arka planda çalışıyor." 
    });
});

// Proje başlatıldığında hem web sunucusunu dinlemeye alır hem de Minecraft botunu çalıştırır
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`[LegacyBots] Web Kontrol Paneli Başlatıldı!`);
    console.log(`[LegacyBots] Port: ${PORT}`);
    console.log(`[LegacyBots] Tarayıcıdan erişmek için: http://localhost:${PORT}`);
    console.log(`==================================================`);
    
    // Minecraft botunu tetikleyen fonksiyon
    startBot();
});
