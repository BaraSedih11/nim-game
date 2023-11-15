let isPlayer1Turn = false;
let isPlayer2Turn = false;
let player1Score = 0;
let player2Score = 0;
let lastTwoMoves = ['', ''];


function generateSticks() {
    const sticksBox = document.getElementById('sticks-box');
    const stickImageSrc = '../images/stick.png';

    for (let i = 0; i < sticksNumber; i++) {
        const button = document.createElement('button');
        button.className = 'stick-button';
        button.id = `stick-${i + 1}`;
        button.addEventListener('click', player1Move);

        const stick = document.createElement('img');
        stick.src = stickImageSrc;
        stick.alt = 'Stick Image';

        button.appendChild(stick);
        sticksBox.appendChild(button);
    }

    sticksBox.appendChild(document.createElement('br'));

    const rules = document.createElement('p');
    rules.className = 'game-rules';
    rules.textContent = 'You can select 1, 2, or 3 sticks ✅';
    sticksBox.appendChild(rules);
}

function startGame() {
    console.log('Start game');

    const startingPlayer = Math.random() < 0.5 ? 1 : 2;
    isPlayer1Turn = startingPlayer === 1;
    isPlayer2Turn = startingPlayer === 2;

    if (isPlayer2Turn) {
        console.log('Player two turn');
        player2Move();
    } else {
        console.log('Player one turn');
    }
}

function player1Move(event) {
    event.preventDefault();
    event.stopPropagation();
    const stickButton = event.currentTarget;

    console.log('Clicked');

    isPlayer1Turn = false;
    isPlayer2Turn = true;

    const totalSticks = document.querySelectorAll('.stick-button:not(.removed)');
    const selectedSticks = document.querySelectorAll('.stick-button:not(.removed).selected');

    if (!stickButton.classList.contains('selected') && selectedSticks.length < 3) {
        if (totalSticks.length > selectedSticks.length) {
            console.log('Allowing selection.');
            stickButton.classList.add('selected');
        }
    } else if (stickButton.classList.contains('selected')) {
        console.log('Unselect');
        stickButton.classList.remove('selected');
    } else if (selectedSticks.length >= 3) {
        alert('You selected the maximum allowed number of sticks');
    }
}

function player2Move() {
    isPlayer1Turn = true;
    isPlayer2Turn = false;

    const levelElement = document.getElementById('level');
    const levelValue = levelElement.textContent;

    if (levelValue === 'Easy') {
        const stickButtons = document.querySelectorAll('.stick-button:not(.removed)');

        if (stickButtons.length > 1) {
            const maxSticksToPick = Math.min(3, stickButtons.length - 1);
            const numberOfSticksToPick = Math.max(1, Math.floor(Math.random() * maxSticksToPick) + 1);
            console.log(numberOfSticksToPick);

            const nonSelectedSticks = Array.from(stickButtons).filter((stick) => !stick.classList.contains('selected'));
            const randomNonSelectedStick = nonSelectedSticks[Math.floor(Math.random() * nonSelectedSticks.length)];
            randomNonSelectedStick.classList.add('selected');

            for (let i = 1; i < numberOfSticksToPick; i++) {
                const randomStick = stickButtons[Math.floor(Math.random() * stickButtons.length)];
                randomStick.classList.add('selected');
            }
        }
    } 
    else if (levelValue === 'Medium') {  
        // here we go
        console.log('Medium');
        const stickButtons = document.querySelectorAll('.stick-button:not(.removed)');

        if (stickButtons.length > 1) {
            // Check for a winning move
            const winningMove = findWinningMove(stickButtons);

            if (winningMove && Array.isArray(winningMove)) {
                // Make the winning move, ensuring not to exceed the maximum allowed sticks
                winningMove.slice(0, Math.min(3, winningMove.length)).forEach((stick) => stick.classList.add('selected'));
            } else {
                // If there's no winning move, make a random move (similar to the easy level)
                const maxSticksToPick = Math.min(2, stickButtons.length - 1);
                const numberOfSticksToPick = Math.max(1, Math.floor(Math.random() * maxSticksToPick) + 1);

                const nonSelectedSticks = Array.from(stickButtons).filter((stick) => !stick.classList.contains('selected'));
                const randomNonSelectedStick =
                    nonSelectedSticks[Math.floor(Math.random() * nonSelectedSticks.length)];
                randomNonSelectedStick.classList.add('selected');

                for (let i = 1; i < numberOfSticksToPick; i++) {
                    const randomStick = stickButtons[Math.floor(Math.random() * stickButtons.length)];
                    randomStick.classList.add('selected');
                }
            }
        }


    } 
    else if (levelValue === 'Hard') {
        const stickButtons = document.querySelectorAll('.stick-button:not(.removed)');
        
        if (stickButtons.length > 1) {
            // Find the best move using Alpha-Beta Pruning
            const bestMove = findBestMove(stickButtons, -Infinity, Infinity, false);

            if (bestMove) {
                // Make the best move
                bestMove.forEach((stick) => stick.classList.add('selected'));
            } 
        }

    }

    makeMove();
}


//for hard
function findBestMove(stickButtons, alpha, beta, maximizingPlayer) {
    const depth = 5;
    let bestMove = null;
    let bestValue = -Infinity;

    const children = generateChildren(stickButtons);
    for (const child of children) {
        applyMove(child);
        const childValue = alphabeta(child, depth, alpha, beta, !maximizingPlayer);
        undoMove(child);

        if ((maximizingPlayer && childValue > bestValue) || (!maximizingPlayer && childValue < bestValue)) {
            bestValue = childValue;
            bestMove = child;
        }

        if (maximizingPlayer) {
            alpha = Math.max(alpha, bestValue);
        } else {
            beta = Math.min(beta, bestValue);
        }

        if (beta <= alpha) {
            break;
        }
    }
    if(!bestMove){
        getRandomMove();
    }

    return bestMove;
}

function applyMove(move) {
    for (let i = 0; i < move.length; i++) {
        move[i].classList.add('selected');
    }
}

function undoMove(move) {
    for (let i = 0; i < move.length; i++) {
        move[i].classList.remove('selected');
    }
}

function generateChildren(stickButtons) {
    const stickArray = Array.from(stickButtons);

    const children = [];

    for (let i = 1; i <= 3; i++) {
        const child = stickArray.slice(); // Create a copy to simulate the move
        const selectedSticks = child.splice(0, i); // Simulate selecting 'i' sticks

        if (selectedSticks.length > 0) {
            children.push(selectedSticks);
        }
    }

    return children;
}

function getRandomMove(){
    const stickButtons = document.querySelectorAll('.stick-button:not(.removed)');

        if (stickButtons.length > 1) {
            // Check for a winning move
            const winningMove = findWinningMoveHard(stickButtons);

            if (winningMove && Array.isArray(winningMove)) {
                // Make the winning move, ensuring not to exceed the maximum allowed sticks
                winningMove.slice(0, Math.min(3, winningMove.length)).forEach((stick) => stick.classList.add('selected'));
            } else {
                // If there's no winning move, make a random move (similar to the easy level)
                const maxSticksToPick = Math.min(2, stickButtons.length - 1);
                const numberOfSticksToPick = Math.max(1, Math.floor(Math.random() * maxSticksToPick) + 1);

                const nonSelectedSticks = Array.from(stickButtons).filter((stick) => !stick.classList.contains('selected'));
                const randomNonSelectedStick =
                    nonSelectedSticks[Math.floor(Math.random() * nonSelectedSticks.length)];
                randomNonSelectedStick.classList.add('selected');

                for (let i = 1; i < numberOfSticksToPick; i++) {
                    const randomStick = stickButtons[Math.floor(Math.random() * stickButtons.length)];
                    randomStick.classList.add('selected');
                }
            }
            console.log('1111111111111111111111111111111111');
            return null;
        }
}

function findWinningMoveHard(stickButtons) {
    // Check if the current state already satisfies the winning condition
    if (stickButtons.length % 4 === 1) {
        // The opponent will be left with an odd number of sticks, which is a winning move
        return stickButtons;
    }

    // If there are exactly 4 sticks, 20% chance to select 3 sticks
    if (stickButtons.length === 4 && Math.random() < 0.2) {
        return Array.from(stickButtons).slice(0, 3);
    }

    // Explore possible moves to find a winning move
    for (let i = 1; i <= 3; i++) {
        const testButtons = [...stickButtons]; // Create a copy to simulate the move
        const selectedSticks = testButtons.splice(0, i); // Simulate selecting 'i' sticks

        if (testButtons.length % 4 === 1) {
            // If the opponent will be left with an odd number of sticks, it's a winning move
            return selectedSticks;
        }
    }

    return null; // No winning move found
}

function alphabeta(node, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || isTerminalNode(node)) {
        return evaluateNode(node);
    }

    if (maximizingPlayer) {
        let value = -Infinity;
        const children = generateChildren(node);

        for (const child of children) {
            value = Math.max(value, alphabeta(child, depth-1, alpha, beta, false));
            alpha = Math.max(alpha, value);

            if (beta <= alpha) {
                // Prune the search tree
                break;
            }
        }

        return value;
    } else {
        let value = Infinity;
        const children = generateChildren(node);

        for (const child of children) {
            value = Math.min(value, alphabeta(child, depth-1, alpha, beta, true));
            beta = Math.min(beta, value);

            if (beta <= alpha) {
                // Prune the search tree
                break;
            }
        }

        return value;
    }
}

function isTerminalNode(node) {
    // In this example, a terminal node is reached when there is only one stick left
    return node.length === 1;
}
function evaluateNode(node, maximizingPlayer) {
    console.log('Node:', node); // Add this line

    const sticksLeft = node.filter(element => typeof element !== 'number' && !element.classList.contains('removed'));

    // Check if the current state already satisfies the winning condition
    if (sticksLeft.length % 4 === 1) {
        // The opponent will be left with an odd number of sticks, which is a winning move
        console.log("Winning move detected!");
        return maximizingPlayer ? -1 : 1; // Return a negative score for winning move if maximizingPlayer, else positive
    }

    // If there are exactly 4 sticks, 20% chance to select 3 sticks
    if (sticksLeft.length === 4 && Math.random() < 0.2) {
        console.log("20% chance move detected!");
        return maximizingPlayer ? 1 : -1; // Return a positive score for selecting 3 sticks if maximizingPlayer, else negative
    }

    // Default score for other cases
    console.log("Default move detected!");
    return 0;
}

// for medium
function findWinningMove(stickButtons) {
    // Check if the current state already satisfies the winning condition
    if (stickButtons.length % 4 === 1) {
        // The opponent will be left with an odd number of sticks, which is a winning move
        return stickButtons;
    }

    // If there are exactly 4 sticks, 20% chance to select 3 sticks
    if (stickButtons.length === 4 && Math.random() < 0.2) {
        return Array.from(stickButtons).slice(0, 3);
    }

    // Explore possible moves to find a winning move
    for (let i = 1; i <= 3; i++) {
        const testButtons = [...stickButtons]; // Create a copy to simulate the move
        const selectedSticks = testButtons.splice(0, i); // Simulate selecting 'i' sticks

        if (testButtons.length % 4 === 1) {
            // If the opponent will be left with an odd number of sticks, it's a winning move
            return selectedSticks;
        }
    }

    return null; // No winning move found
}

// Other
function makeMove() {
    let totalSticks = document.querySelectorAll('.stick-button:not(.removed)');
    let selectedSticks = document.querySelectorAll('.stick-button.selected');
    const total = Array.from(totalSticks);
    let gameOver = 0;

    if (total.length <= selectedSticks.length) {
        const remainingSticks = Array.from(total).filter((stick) => !Array.from(selectedSticks).includes(stick));
        const numberOfSticksToRemove = Math.min(remainingSticks.length, selectedSticks.length);

        for (let i = 0; i < numberOfSticksToRemove; i++) {
            const randomStick = selectedSticks[i];
            randomStick.classList.remove('selected');
            randomStick.classList.add('removed');
            randomStick.disabled = true;
            randomStick.style.display = 'none';
        }

        selectedSticks = document.querySelectorAll('.stick-button.selected');
        if (selectedSticks.length > 0) {
            selectedSticks.forEach((button) => {
                button.classList.remove('selected');
            });
        }
    } else {
        selectedSticks.forEach((button) => {
            button.classList.remove('selected');
            button.classList.add('removed');
            button.disabled = true;
            button.style.display = 'none';
        });
    }

    updateLastMoves(selectedSticks);

    totalSticks = document.querySelectorAll('.stick-button:not(.removed)');
    if (totalSticks.length === 1) {
        gameOver = 1;
    }

    if (gameOver) {
        if (isPlayer2Turn) {
            alert('Game Over! Player 1 wins!');
            player1Score++;
        } else {
            alert('Game Over! Player 2 wins!');
            player2Score++;
        }
        resetGame(player1Score, player2Score);
    } else {
        if (isPlayer1Turn) {
            console.log('Player 1 now');
        } else {
            console.log('Player 2 now');
            player2Move();
        }
    }
}

function updateLastMoves(numberOfRemovedSticks) {
    const lastMoveLabel = document.getElementById('last-move');

    // Clear the label when starting a new game or resetting
    if (numberOfRemovedSticks === null) {
        lastMoveLabel.innerHTML = '<strong>Last move:</strong>';
        return;
    }

    lastTwoMoves.shift();
    lastTwoMoves.push(numberOfRemovedSticks);

    // Convert NodeList to an array of numbers representing removed sticks
    const movesArray = Array.from(lastTwoMoves).map(move => move.length);
    const movesString = movesArray.join(', ');

    lastMoveLabel.innerHTML = `<strong>Last moves:</strong> ${movesString}`;
}

function updateScores(score1, score2) {
    const resultValue = document.getElementById('result');
    resultValue.innerHTML = `ME: ${score1} vs PC: ${score2}`;
}

function resetGame(score1, score2) {
    console.log('Reset Game');

    const sticksBox = document.getElementById('sticks-box');
    sticksBox.innerHTML = '';
    generateSticks();

    updateScores(score1, score2);
    updateLastMoves(null);
}

function exitGame() {
    fetch('/game/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (response.ok) {
                window.location.href = '/game';
            } else {
                console.error('Logout request failed');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

window.onload = generateSticks;
