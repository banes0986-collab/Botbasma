const mineflayer = require('mineflayer');

class BotManager {
  constructor() {
    this.activeBots = [];
    this.isRunning = false;
    this.targetHost = '';
    this.targetPort = 25565;
  }

  startTest(host, port, count, logCallback) {
    this.stopTest(); // Önceki botları temizle
    this.isRunning = true;
    this.targetHost = host;
    this.targetPort = parseInt(port) || 25565;
    const botCount = parseInt(count) || 1;

    logCallback(`[SİSTEM] ${botCount} bot ile test başlatılıyor -> ${host}:${port}`);

    for (let i = 1; i <= botCount; i++) {
      if (!this.isRunning) break;

      setTimeout(() => {
        if (!this.isRunning) return;

        try {
          const bot = mineflayer.createBot({
            host: this.targetHost,
            port: this.targetPort,
            username: `CraftTest_${Math.floor(Math.random() * 8999 + 1000)}`,
            hideErrors: true
          });

          bot.on('login', () => {
            logCallback(`[+] ${bot.username} sunucuya giriş yaptı.`);
          });

          bot.on('kicked', (reason) => {
            logCallback(`[-] ${bot.username} atıldı: ${reason}`);
            this.removeBot(bot);
          });

          bot.on('error', (err) => {
            logCallback(`[!] ${bot.username} hatası: ${err.message}`);
            this.removeBot(bot);
          });

          bot.on('end', () => {
            this.removeBot(bot);
          });

          this.activeBots.push(bot);
        } catch (e) {
          logCallback(`[!] Bot ${i} oluşturulamadı: ${e.message}`);
        }
      }, i * 800); // Sunucu korumasına takılmamak için kademeli giriş
    }
  }

  stopTest() {
    this.isRunning = false;
    this.activeBots.forEach((bot) => {
      try {
        bot.quit();
      } catch (e) {}
    });
    this.activeBots = [];
  }

  removeBot(botInstance) {
    this.activeBots = this.activeBots.filter((b) => b !== botInstance);
  }

  getStatus() {
    return {
      running: this.isRunning,
      activeBotCount: this.activeBots.length,
      targetHost: this.targetHost,
      targetPort: this.targetPort
    };
  }
}

module.exports = new BotManager();
