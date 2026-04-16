<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>CRM Project | Multi-Port Defense</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        :root { --p: #00f2ff; --s: #7000ff; --bg: #050608; --card: rgba(15, 20, 30, 0.9); --border: rgba(255,255,255,0.1); }
        * { margin:0; padding:0; box-sizing:border-box; font-family: 'Outfit', sans-serif; }
        body { background: var(--bg); color: #fff; height: 100vh; overflow: hidden; }

        /* DASHBOARD GRID */
        #app { display: grid; grid-template-columns: 280px 1fr; height: 100vh; }
        .sidebar { background: #080a0f; border-right: 1px solid var(--border); padding: 40px 20px; }
        .content { padding: 40px; overflow-y: auto; background: radial-gradient(circle at top right, #101520, #050608); }

        /* CARDS */
        .glass-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 25px; backdrop-filter: blur(10px); }
        .btn-neon { background: linear-gradient(45deg, var(--p), var(--s)); border:none; padding:12px 25px; border-radius:12px; cursor:pointer; font-weight:800; text-transform:uppercase; transition:0.3s; }
        .btn-neon:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(0,242,255,0.4); }

        /* INPUTS */
        input { background: rgba(0,0,0,0.5); border: 1px solid var(--border); padding: 12px; border-radius: 10px; color: #fff; margin-bottom: 10px; width: 100%; }
        
        /* TABLE */
        .port-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .port-table th { text-align: left; padding: 15px; color: var(--p); border-bottom: 2px solid var(--border); }
        .port-table td { padding: 15px; border-bottom: 1px solid var(--border); }
        
        .status-on { color: #00ff88; font-weight: bold; text-shadow: 0 0 10px #00ff8855; }
        .hidden { display: none; }
    </style>
</head>
<body>

    <div id="app">
        <aside class="sidebar">
            <h2 style="color:var(--p); margin-bottom: 40px;">CRM PROJECT</h2>
            <div style="margin-bottom: 20px; opacity: 0.6; font-size: 14px;">MENÜ</div>
            <nav>
                <div style="padding:15px 0; cursor:pointer; color:var(--p)"><i class="fas fa-shield-alt"></i> Koruma Paneli</div>
                <div style="padding:15px 0; cursor:pointer; opacity:0.5"><i class="fas fa-shopping-cart"></i> Market (Yakında)</div>
                <div style="padding:15px 0; cursor:pointer; opacity:0.5"><i class="fas fa-users"></i> Kullanıcılar</div>
            </nav>
        </aside>

        <main class="content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                <h1>Multi-Port Shield Dashboard</h1>
                <div class="glass-card" style="padding: 10px 20px;">Kurucu: triggerbaba31</div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
                <div class="glass-card">
                    <h3>Yeni Port Koru</h3>
                    <p style="font-size: 12px; color: #8b949e; margin-bottom: 20px;">Hangi sunucuyu/portu korumak istiyorsun?</p>
                    
                    <label>Shield Port (Dış Kapı)</label>
                    <input type="number" id="in-shield" placeholder="Örn: 25707">
                    
                    <label>Hedef IP</label>
                    <input type="text" id="in-ip" placeholder="127.0.0.1">
                    
                    <label>Hedef Port (İç Kapı)</label>
                    <input type="number" id="in-target" placeholder="25565">
                    
                    <button class="btn-neon" style="width:100%; margin-top:10px;" onclick="addPort()">Korumaya Al</button>
                </div>

                <div class="glass-card">
                    <h3>Aktif Korumalar</h3>
                    <table class="port-table">
                        <thead>
                            <tr>
                                <th>Port</th>
                                <th>Hedef (IP:Port)</th>
                                <th>Durum</th>
                                <th>İşlem</th>
                            </tr>
                        </thead>
                        <tbody id="port-list">
                            </tbody>
                    </table>
                </div>
            </div>

            <div class="glass-card" style="margin-top: 30px; font-family: 'JetBrains Mono'; font-size: 12px; color: #00ff88; height: 150px; overflow-y: auto;">
                > [SYSTEM] CRM Multi-Port Engine v2.0 Başlatıldı...<br>
                > [INFO] Ryzen 9 9950X işlemci optimize edildi.<br>
                <div id="logs"></div>
            </div>
        </main>
    </div>

    <script>
        let activePorts = [];

        function addPort() {
            const sPort = document.getElementById('in-shield').value;
            const tIp = document.getElementById('in-ip').value;
            const tPort = document.getElementById('in-target').value;
            const logs = document.getElementById('logs');

            if(!sPort || !tIp || !tPort) return alert("Tüm alanları doldur!");

            // Simüle edilmiş backend ekleme (Gerçekte fetch ile API'ye gider)
            activePorts.push({ port: sPort, target: tIp + ":" + tPort, status: 'Online' });
            
            logs.innerHTML += `> [SUCCESS] Yeni Tünel: ${sPort} -> ${tIp}:${tPort} Aktif Edildi.<br>`;
            renderTable();
        }

        function renderTable() {
            const list = document.getElementById('port-list');
            list.innerHTML = activePorts.map((p, index) => `
                <tr>
                    <td><b>${p.port}</b></td>
                    <td>${p.target}</td>
                    <td><span class="status-on">● KORUNUYOR</span></td>
                    <td><button onclick="removePort(${index})" style="background:none; border:none; color:#ff3366; cursor:pointer;"><i class="fas fa-trash"></i></button></td>
                </tr>
            `).join('');
        }

        function removePort(index) {
            activePorts.splice(index, 1);
            renderTable();
        }
    </script>
</body>
</html>
