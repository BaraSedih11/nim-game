const path = require('path');

exports.loginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/public', '/login.html')); 
}

exports.version1Page = (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        } else {
            console.log('Session destroyed');
        }
    });
    res.sendFile(path.join(__dirname, '..', '/public', '/version1Page', '/version1.html'));
}
exports.version2Page = (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        } else {
            console.log('Session destroyed');
        }
    });
    res.sendFile(path.join(__dirname, '..', '/public', '/version2Page', '/version2.html'));
}

exports.startGame = (req, res) => {
    const { username, gameType } = req.body;
    req.session.username = username;

    if(req.session && req.session.username){
        let apiURL = '';
        if(gameType === 'NIM1'){
            res.sendFile(path.join(__dirname, '..', '/public', '/version1Page', '/version1.html'));
        } else if (gameType === 'NIM2'){
            res.sendFile(path.join(__dirname, '..', '/public', '/version2Page', '/version2.html'));
        }
    } else {
        res.redirect('/game'); 
    }
    
}