const path = require('path');

exports.loginPage = (req, res) => {
    res.render(path.join(__dirname, '..', '/public', '/login.ejs'))
}

exports.version1Page = (req, res) => {
    res.render(path.join(__dirname, '..', '/public', '/version1Page', '/version1.ejs'),
    {
        username: req.session.username,
        gameType: req.session.gameType,
        sticks: req.session.sticks,
        level: req.session.level,
    });
}
exports.version2Page = (req, res) => {
    res.render(path.join(__dirname, '..', '/public', '/version2Page', '/version2.ejs'),
    {
        username: req.session.username,
        gameType: req.session.gameType,
        sticks: req.session.sticks,
        level: req.session.level,
    });
}

exports.startGame = (req, res) => {
    const { username, gameType, sticks, level } = req.body;
    req.session.username = username;
    req.session.gameType = gameType;
    req.session.sticks = sticks;
    req.session.level = level;

    if(req.session && req.session.username){
        let apiURL = '';
        if(gameType === 'NIM1'){
            res.render(path.join(__dirname, '..', '/public', '/version1Page', '/version1.ejs'),
            {
                username: req.session.username,
                gameType: req.session.gameType,
                sticks: req.session.sticks,
                level: req.session.level,
            });
        } else if (gameType === 'NIM2'){
            res.render(path.join(__dirname, '..', '/public', '/version2Page', '/version2.ejs'),
            {
                username: req.session.username,
                gameType: req.session.gameType,
                sticks: req.session.sticks,
                level: req.session.level,
            });
        }
    } else {
        res.redirect('/game'); 
    }
    
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        } else {
            console.log('Session destroyed');
            res.redirect('/game'); 
        }
    });
}