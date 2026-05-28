const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRouter = require('./auth'); // Kayıt/Giriş sistemini içeren diğer dosya

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (Ara Katman) Ayarları
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Güvenli Oturum Yönetimi
app.use(session({
    secret: 'nexus_hub_secure_key_9876',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 Saatlik Oturum Ömrü
}));

// Kayıt ve Giriş Rotalarını auth.js dosyasından çekiyoruz
app.use('/api/auth', authRouter.router);

// Güvenli Dosya Deposu (Yasal Minecraft Modları ve Eklentileri)
const plugins = [
    { name: 'Amphetamine-Optimizer.jar', version: '1.21.4', type: 'Fabric Performance', dlCount: 1420 },
    { name: 'Prizrak-Core-mentcenter1.0.jar', version: '1.21.4', type: 'Fabric API', dlCount: 890 },
    { name: 'Arvion-Render-Client.jar', version: '1.21.4', type: 'Graphics Mod', dlCount: 2150 },
    { name: 'Experiment-Tweaks.jar', version: '1.21.4', type: 'Optimization', dlCount: 640 },
    { name: 'moonward-recode-hud.jar', version: '1.21.4', type: 'UI / Interface', dlCount: 3120 },
    { name: 'thunderremake-physics.jar', version: '1.21', type: 'Physics Mod', dlCount: 4500 }
];

// API: Modları Listeleme (Sadece Giriş Yapmış Kullanıcılar Görebilir)
app.get('/api/plugins', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Yetkisiz erişim! Lütfen giriş yapın.' });
    }
    return res.json(plugins);
});

// Dashboard Sayfası Koruma Rotası
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/#login-required');
    }
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Geri kalan tüm istekleri ana sayfaya yönlendir
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`[SERVER] Nexus Hub Sunucusu ${PORT} portunda aktif.`);
    console.log(`[DATABASE] ResulBaba (Admin) hesabı otomatik aktif.`);
    console.log(`==================================================\n`);
});
