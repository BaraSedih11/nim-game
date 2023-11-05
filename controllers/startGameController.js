const path = require('path');

// exports.startGame = (req, res) => {
//     console.log('Button clicked on the server');

//     const { username, gameType, level, sticks } = req.body;
    
//     // Perform any server-side logic here and send a response back to the client
//     const response = { message: 'Button click event received on the server' };
//     res.json(response);
//   }

//  exports.loginPage = (req, res) => {
//     //res.sendFile(path.join(__dirname, '..', 'public', 'loginPage', 'index.html'));

//     console.log('Button clicked on the server');
//     // You can access request data from req.body to get user input
//     const { username, gameType, level, sticks } = req.body;
    
//     // Perform any server-side logic here

//     // Send a response to the client
//     const response = { message: 'Button click event received on the server' };
//     res.json(response);
//   }

//   function initializeGame(gameType, username, sticks, level) {
//     if (gameType === "NIM1") {

//         const nimGame = {
//             gameType: "NIM1",
//             username,
//             currentPlayer: "user", 
//             sticks, 
//             level
//         };
//         return nimGame;
//     } else {
//         // Handle other game types or return an error
//         throw new Error("Unsupported game type");
//     }
//}

// exports.homePage = (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'loginPage', 'index.html'));
// }