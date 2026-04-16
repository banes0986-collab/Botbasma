const net = require('net');
const chalk = require('chalk'); // Renkli loglar için

const CONFIG = {
    SHIELD_PORT: 25707,
    TARGET_IP: '127.0.0.1',
    TARGET_PORT: 25565,
    MAX_CONN_PER_SEC: 3, // Bir IP saniyede max 3 bağlantı açabilir
    BAN_TIME: 60000 // Saldırganı 1 dakika tamamen blokla
};

const blacklist = new Map();
const connections = new Map();

const server = net.createServer((socket) => {
    const ip = socket.remoteAddress.replace('::ffff:', '');
    const now = Date.now();

    // 1. KARA LİSTE KONTROLÜ
    if (blacklist.has(ip) && blacklist.get(ip) > now) {
        return socket.destroy();
    }

    // 2. AKILLI ANALİZ (Rate Limiting)
    let userData = connections.get(ip) || [];
    userData = userData.filter(t => now - t < 1000);
    
    if (userData.length >= CONFIG.MAX_CONN_PER_SEC) {
        console.log(chalk.red(`[!] SALDIRI TESPİT EDİLDİ: ${ip} - BANLANDI!`));
        blacklist.set(ip, now + CONFIG.BAN_TIME);
        return socket.destroy();
    }

    userData.push(now);
    connections.set(ip, userData);

    // 3. GÜVENLİ YÖNLENDİRME (Proxy)
    const proxy = net.createConnection(CONFIG.TARGET_PORT, CONFIG.TARGET_IP);
    
    socket.pipe(proxy).pipe(socket);

    // Hata Yönetimi (Sunucunun çökmemesi için kritik)
    socket.on('error', () => socket.destroy());
    proxy.on('error', () => socket.destroy());
});

server.listen(CONFIG.SHIELD_PORT, () => {
    console.log(chalk.cyan.bold(`
    ===========================================
       CRM PROJECT | ULTIMATE SHIELD v2.0
       DURUM: AKTİF (KORUMA MODU)
       İŞLEMCİ: RYZEN 9 9950X OPTİMİZE EDİLDİ
    ===========================================
    `));
});
