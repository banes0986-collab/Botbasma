const net = require('net');
const fs = require('fs');

// AYARLAR
const TARGET_IP = '127.0.0.1'; // Minecraft sunucunun IP'si
const TARGET_PORT = 25565;    // Minecraft sunucunun portu
const PROXY_PORT = 25577;     // Oyuncuların gireceği korumalı port

const packetLimits = new Map();
const blackList = new Set();

const server = net.createServer((clientSocket) => {
    const remoteIp = clientSocket.remoteAddress;

    // 1. Kara Liste Kontrolü
    if (blackList.has(remoteIp)) {
        clientSocket.destroy();
        return;
    }

    // 2. TCP Flood Koruması (Hız Sınırı)
    const now = Date.now();
    const logs = packetLimits.get(remoteIp) || [];
    const recentLogs = logs.filter(time => now - time < 1000);
    
    if (recentLogs.length > 5) { // Saniyede 5'ten fazla yeni bağlantı açarsa BAN
        console.log(`[BAN] Saldırı algılandı: ${remoteIp}`);
        blackList.add(remoteIp);
        clientSocket.destroy();
        return;
    }
    recentLogs.push(now);
    packetLimits.set(remoteIp, recentLogs);

    // 3. Güvenli Bağlantıyı Minecraft'a Yönlendir
    const targetSocket = net.createConnection(TARGET_PORT, TARGET_IP, () => {
        clientSocket.pipe(targetSocket);
        targetSocket.pipe(clientSocket);
    });

    targetSocket.on('error', () => clientSocket.destroy());
    clientSocket.on('error', () => targetSocket.destroy());

});

server.listen(PROXY_PORT, () => {
    console.log(`[TriggerGuard] Shield Aktif! Port: ${PROXY_PORT} -> ${TARGET_PORT}`);
});
