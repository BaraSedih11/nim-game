const path = require('path');

exports.startGame = (req, res) => {
    // Parse user input for name and game type
    const username = req.body.username;
    const gameType = req.body.gameType;
    const sticks = req.body.sticks;
    const level = req.body.level;
  
    // Initialize the game with user and computer players
    const game = initializeGame(gameType, username, sticks, level);
  
    // Send game data to the client
    res.json({ game });
  }


 exports.loginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'loginPage', 'index.html'));
  }

  function initializeGame(gameType, username, sticks, level) {
    if (gameType === "NIM1") {

        const nimGame = {
            gameType: "NIM1",
            username,
            currentPlayer: "user", 
            sticks, 
            level
        };
        return nimGame;
    } else {
        // Handle other game types or return an error
        throw new Error("Unsupported game type");
    }
}
