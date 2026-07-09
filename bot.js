const mineflayer = require('mineflayer');

function startBot(host, port) {
    // İsmin çakışmaması için her butona basıldığında rastgele bir isim üretir
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const botName = `LegacyBot_${randomId}`;

    console.log(`[Sistem] ${botName} isimli bot ${host}:${port} adresine bağlanıyor...`);

    const bot = mineflayer.createBot({
        host: host,
        port: port,
        username: botName
        // Sürüm belirtmedik; Mineflayer sunucu sürümünü otomatik olarak algılamaya çalışacaktır.
    });

    bot.on('spawn', () => {
        console.log(`[Başarılı] ${bot.username} sunucuya giriş yaptı!`);
        
        // Anti-AFK: Sunucudan atılmamak için her 30 saniyede bir zıplama hareketi yapar
        setInterval(() => {
            if (bot) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 30000);
    });

    bot.on('end', (reason) => {
        console.log(`[Bağlantı Koptu] Bot sunucudan ayrıldı. Sebep: ${reason}`);
    });

    bot.on('error', (err) => {
        console.log(`[Hata] Bot bağlanırken bir sorunla karşılaştı: ${err.message}`);
    });
}

module.exports = { startBot };
