const express = require('express');
const router = express.Router();

// Bellek içi sanal kullanıcı veri tabanı
const users = [];

// İstediğin otomatik Admin hesabı sisteme gömüldü
users.push({
    email: 'resul3163@gmail.com',
    username: 'ResulBaba',
    password: 'resulbaba', 
    rank: 'Admin'
});

// Giriş Yapma İşlemi (POST /api/auth/login)
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        req.session.user = {
            username: user.username,
            email: user.email,
            rank: user.rank
        };
        return res.json({ success: true, message: 'Giriş başarılı! Panele yönlendiriliyorsunuz...', user: req.session.user });
    }
    return res.json({ success: false, message: 'Hatalı e-posta veya şifre girdiniz!' });
});

// Kayıt Olma İşlemi (POST /api/auth/register)
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (users.find(u => u.email === email)) {
        return res.json({ success: false, message: 'Bu e-posta adresiyle zaten bir hesap var!' });
    }

    const newUser = {
        username,
        email,
        password,
        rank: 'Kullanıcı' // Yeni kayıt olan herkese standart rol verilir
    };
    
    users.push(newUser);
    // Kayıt olduktan sonra otomatik giriş yaptırıyoruz
    req.session.user = { username: newUser.username, email: newUser.email, rank: newUser.rank };
    return res.json({ success: true, message: 'Hesabınız başarıyla oluşturuldu!' });
});

// Aktif Oturumu Kontrol Etme (GET /api/auth/session)
router.get('/session', (req, res) => {
    if (req.session.user) {
        return res.json({ loggedIn: true, user: req.session.user });
    }
    return res.json({ loggedIn: false });
});

// Güvenli Çıkış Yapma (GET /api/auth/logout)
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.json({ success: false, message: 'Çıkış yapılamadı.' });
        }
        return res.json({ success: true });
    });
});

module.exports = { router, users };
                     
