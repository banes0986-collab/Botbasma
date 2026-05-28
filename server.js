const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Ayarları
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'dark_blue_secret_key_1324',
    resave: false,
    saveUninitialized: true
}));

// Bellek İçi Kullanıcı Veri Tabanı
const users = [];

// OTOMATİK ADMİN HESABI (Sistem başlarken eklenir)
users.push({
    email: 'resul3163@gmail.com',
    username: 'ResulBaba',
    password: 'resulbaba', 
    rank: 'Admin',
    joinDate: '2026-05-28'
});

// ATTIĞIN TÜM HİLE DOSYALARININ EKSİKSİZ LİSTESİ
const clients = [
    { name: 'Amphetamine.jar', version: '1.21.4', type: 'Fabric API Gerekli', dlCount: 1420 },
    { name: 'PrizrakDLC-mentcenter1.0.jar', version: '1.21.4', type: 'Fabric API Gerekli', dlCount: 890 },
    { name: 'ArvionClient.jar', version: '1.21.4', type: 'Fabric API Gerekli', dlCount: 2150 },
    { name: 'ExperimentClient.jar', version: '1.21.4', type: 'Fabric API Gerekli', dlCount: 640 },
    { name: 'moonward-recode.jar', version: '1.21.4', type: 'Fabric API Gerekli', dlCount: 3120 },
    { name: 'thunderremake.jar', version: '1.21', type: 'Fabric API Gerekli', dlCount: 4500 }
];

// API: Giriş Yapma
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        req.session.user = {
            username: user.username,
            email: user.email,
            rank: user.rank
        };
        return res.json({ success: true, message: 'Giriş başarılı!', user: req.session.user });
    }
    return res.json({ success: false, message: 'Hatalı e-posta veya şifre!' });
});

// API: Kayıt Olma
app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (users.find(u => u.email === email)) {
        return res.json({ success: false, message: 'Bu e-posta zaten kayıtlı!' });
    }

    const newUser = {
        username,
        email,
        password,
        rank: 'Kullanıcı', // Yeni kayıt olanlar standart rolü alır
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    req.session.user = { username: newUser.username, email: newUser.email, rank: newUser.rank };
    return res.json({ success: true, message: 'Kayıt başarılı!' });
});

// API: Mevcut Oturumu Getir
app.get('/api/auth/session', (req, res) => {
    if (req.session.user) {
        return res.json({ loggedIn: true, user: req.session.user });
    }
    return res.json({ loggedIn: false });
});

// API: Çıkış Yapma
app.get('/api/auth/logout', (req, res) => {
    req.session.destroy();
    return res.json({ success: true });
});

// API: Hileleri Listele
app.get('/api/clients', (req, res) => {
    return res.json(clients);
});

// Ana Sayfa Yönlendirmesi (Frontend Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`[SERVER] Sunucu ${PORT} portunda aktif.`);
    console.log(`[ADMIN] Girdiğin mail ve şifre başarıyla entegre edildi.`);
    console.log(`[CLIENTS] Toplam ${clients.length} adet hile başarıyla yüklendi.`);
    console.log(`==================================================\n`);
});
