let isPlayer1Turn = false;
let isPlayer2Turn = false;
let player1Score = 0;
let player2Score = 0;
let lastTwoMoves = ['', ''];
let prevSelectedButton = null;
let currentRowClass = null; 

function generateSticks() {
    const sticksBox = document.getElementById('sticks-box');
    const stickImageSrc = '../images/stick.png';
    let sticksInRow = 1; // Number of sticks in the current row

    for (let i = 0; i < sticksNumber; i++) {
        for (let j = 0; j < sticksInRow; j++, i++) {
            // Create a button element
            const button = document.createElement('button');
            button.className = 'stick-button'; // Add a class for styling
            button.addEventListener('click', player1Move);

            // Create an image element and set its source
            const stick = document.createElement('img');
            stick.src = stickImageSrc;
            stick.alt = 'Stick Image'; // Add alt text for accessibility

            // Append the image to the button
            button.appendChild(stick);

            // Append the button to the sticksBox
            sticksBox.appendChild(button);
        }

        sticksInRow += 2; // Increase the number of sticks in the next row
        const lineBreak = document.createElement('br');
        sticksBox.appendChild(lineBreak);
    }

    // Get all the stick button elements
    const stickButtons = document.querySelectorAll('.stick-button');

    // Add a click event listener to each stick button
    stickButtons.forEach((stickButton, index) => {
        // Adjust the index to start from 1 and assign it as the unique ID
        stickButton.id = `stick-${index + 1}`;

        let buttonIndex = parseInt(stickButton.id.split('-')[1], 10);

        if(buttonIndex == 1) {
            stickButton.classList.add(`row-${1}`);
        } else if(buttonIndex > 1 && buttonIndex <= 4) {
            stickButton.classList.add(`row-${2}`);
        } else if(buttonIndex > 4 && buttonIndex <= 9) {
            stickButton.classList.add(`row-${3}`);
        } else if(buttonIndex > 9 && buttonIndex <= 16){
            stickButton.classList.add(`row-${4}`);
        }                   
    });
}

window.onload = function () {
    generateSticks();
};


// handling the buttons -------------------------------------------------------------------
function startGame() {
    console.log("start game");

    const randomValue = Math.random();
    let startingPlayer;
    if (randomValue < 0.5) {
        startingPlayer = 1;
    } else {
        startingPlayer = 2;
    }

    currentRowClass = null;
    prevSelectedButton = null;
    isPlayer1Turn = false;
    isPlayer2Turn = false;

    if (startingPlayer === 1) {
        isPlayer1Turn = true;
        console.log("Player one turn");
    } else if (startingPlayer === 2) {
        isPlayer2Turn = true;
        console.log("Player two turn");
        player2Move();
    }
}

function player1Move(event){
    event.preventDefault();
    event.stopPropagation();
    const stickButton = event.currentTarget;

    isPlayer1Turn = false;
    isPlayer2Turn = true;
    console.log('Clicked');
    if (!stickButton.classList.contains('selected')) {  
        if (prevSelectedButton) {
            if (isButtonInSameRowAsPreviouslySelected(stickButton)) {
                console.log('Same row, allowing selection.');
                stickButton.classList.add('selected');
                prevSelectedButton = stickButton; 
                currentRowClass = stickButton.classList[1];
            } else {
                alert('Different row, preventing selection.');
            }
        } else {
            // If no previously selected button, allow the selection
            console.log('Allowing initial selection.');
            stickButton.classList.add('selected');
            currentRowClass = stickButton.classList[1]; 
            prevSelectedButton = stickButton; 
        }
    } else {
        console.log('Unselect');
        stickButton.classList.remove('selected');

        // Check if all buttons in the current row are unselected
        if (!document.querySelector(`.stick-button.${currentRowClass}.selected`)) {
            currentRowClass = null;
            prevSelectedButton = null; 
        }
    }
      
    function isButtonInSameRowAsPreviouslySelected(currentButton) {
        if (prevSelectedButton) {
            const prevSelectedRowClass = prevSelectedButton.classList[1];
            const currentRowClass = currentButton.classList[1];
            return prevSelectedRowClass === currentRowClass;
        } else {
            // If there is no previously selected button, return true to allow selection
            return true;
        }
    }

}

function player2Move() {
    isPlayer1Turn = true;
    isPlayer2Turn = false;
    currentRowClass = null;

    // Now the algorithm starts

    const levelElement = document.getElementById('level');
    const levelValue = levelElement.textContent;

    if (levelValue === "Easy") {
        // Store available sticks for each row
        const availableRows = [];

        // Loop through the stick buttons to identify available rows and gather sticks
        const stickButtons = document.querySelectorAll('.stick-button');
        stickButtons.forEach((stickButton, index) => {
            if(!stickButton.classList.contains('removed')){
                currentRowClass = stickButton.classList[1];
                availableRows[index] = stickButton.classList[1];
            }
        });

        // Randomly select a row
        const availableRowKeys = Object.keys(availableRows);
        const selectedRowKey = availableRowKeys[Math.floor(Math.random() * availableRowKeys.length)];
        currentRowClass = availableRows[selectedRowKey]; 
        let selectedRow = []; 
        
        let j = 0;
        const stickButtons2 = document.querySelectorAll(`.stick-button.${currentRowClass}`);
        stickButtons2.forEach((stickButton, index) => {
            if(!stickButton.classList.contains('removed')){
                selectedRow[j] = currentRowClass;
                j++;
            }
        });

        // Check if there are sticks in the selected row
        if (selectedRow) {
            const numberOfSticksToPick = Math.max(1, Math.min(Math.floor(Math.random() * selectedRow.length) + 1, selectedRow.length));
            let breakFlag = numberOfSticksToPick;

            // Randomly select the sticks and mark them as 'selected'
            for (let i = 0; i < numberOfSticksToPick; i++) {
                stickButtons.forEach((stickButton, index) => {
                    if (stickButton.classList.contains(currentRowClass) && !stickButton.classList.contains('selected') && !stickButton.classList.contains('removed') && breakFlag) {
                        breakFlag--;
                        stickButton.classList.add('selected');
                        console.log('done');
                    }
                });
            }
        }
        makeMove();
    } 
    else if (levelValue === 'Medium') {        
        const availableRows = [];
        const nimSum = calculateNimSum();

        // Loop through the stick buttons to identify available rows and gather sticks
        const stickButtons = document.querySelectorAll(`.stick-button:not(.removed)`);
        stickButtons.forEach((stickButton, index) => {
                currentRowClass = stickButton.classList[1];
                console.log(currentRowClass);
                availableRows[index] = stickButton.classList[1];
            
        });

        // Find the first heap with a bit set in nimSum
        let selectedRowKey = -1;
        for (let i = 0; i < availableRows.length; i++) {
            if ((nimSum & (1 << i)) !== 0) {
                selectedRowKey = i;
                break;
            }
        }

        // If nim-sum is 0 (losing position), make a random move
        if (selectedRowKey === -1) {
            selectedRowKey = Math.floor(Math.random() * availableRows.length);
        }

        // Get the selected row
        
        currentRowClass = availableRows[selectedRowKey];
        const selectedRow = document.querySelectorAll(`.stick-button.${currentRowClass}:not(.removed)`);

        console.log('test');
        console.log(currentRowClass);

        // Choose a strategy based on the number of sticks in the row
        let numberOfSticksToPick;

        if (selectedRow.length % 3 === 0) {
            // If the number of sticks is a multiple of 3, pick 1 or 2 sticks randomly
            numberOfSticksToPick = Math.floor(Math.random() * 2) + 1;
        } else {
            // Otherwise, pick a random number of sticks
            numberOfSticksToPick = Math.floor(Math.random() * selectedRow.length) + 1;
        }

        console.log('tessssttttt');
        console.log(selectedRow);

        // Mark the randomly selected sticks as 'selected'
        for (let i = 0; i < numberOfSticksToPick; i++) {
            const randomIndex = Math.floor(Math.random() * selectedRow.length);
            console.log("random index : " + randomIndex);
            selectedRow[randomIndex].classList.add('selected');
        }
        
        makeMove();
        
        function calculateNimSum() {
            let nimSum = 0;

            const stickButtons = document.querySelectorAll('.stick-button:not(.removed)');
            stickButtons.forEach((stickButton, index) => {
                if (stickButton.classList.contains('selected')) {
                    nimSum ^= index + 1; // XOR with the heap size
                }
            });

            return nimSum;
        }

    } 
    else if (levelValue === 'Hard') {   
        let currentState = createGameNode();
        console.log('Initial State:', currentState);
        let bestMove = calculateBestMove();
        console.log('Best Move:', bestMove);
        currentRowClass = bestMove.row;
        console.log('Final State:', currentState);
        markSelectedSticks(bestMove);

        const totalSticks = document.querySelectorAll(`.stick-button.${currentRowClass}:not(.removed).selected`);
        console.log('Totally sticks : ', totalSticks);

        makeMove();

        // functions
        function createGameNode() {
            const gameState = {};
    
            const stickButtons = document.querySelectorAll('.stick-button:not(.removed)');
    
            stickButtons.forEach((stickButton, index) => {
                const rowClass = stickButton.classList[1];
                gameState[rowClass] = gameState[rowClass] ? gameState[rowClass] + 1 : 1;
            });
    
            return gameState;
        }
 
        function calculateBestMove() {
            const depth = 10; // Adjust the depth as needed
            const alpha = -Infinity;
            const beta = Infinity;
            const maximizingPlayer = isPlayer1Turn;
        
            const availableMoves = getAvailableMoves();
            console.log('AvailableMoves: ' + JSON.stringify(availableMoves));
        
            let bestValue = -Infinity;
            let bestMove = null;
        
            for (const move of availableMoves) {
                applyMove(move, currentState);
                const value = alphabeta(currentState, depth, alpha, beta, maximizingPlayer);
                undoMove(move, currentState);

                console.log('Move:', move, 'Value:', value);

                // If the move is valid, update the best move
                if (value > bestValue) {
                    bestValue = value;
                    bestMove = move;
                }
            }
        
            // If no valid move is found, generate a new move
            if (!bestMove) {
                bestMove = getRandomMove();
                console.log('random,');
            }
            console.log('BestMoveeee: ', bestMove);

            return bestMove;
        }
           

        function getAvailableMoves() {
            const stickButtons = document.querySelectorAll('.stick-button:not(.removed)');
            const rows = new Set();
            stickButtons.forEach(stickButton => {
                rows.add(stickButton.classList[1]);
            });

            const moves = [];

            rows.forEach(rowClass => {
                const numberOfSticks = document.querySelectorAll(`.stick-button.${rowClass}:not(.removed)`).length;
                for (let i = 1; i <= numberOfSticks; i++) {
                    moves.push({row: rowClass, sticks: i});
                }
            });

            return moves;
        }

        function isValidMove(move) {
            const sticks_in_row = document.querySelectorAll(`.stick-button.${move.row}:not(.removed)`);
            return (sticks_in_row.length >= move.sticks);
        }

        function getRandomMove() {
            const rows = document.querySelectorAll('.stick-button:not(.removed)');
            const randomRow = rows[Math.floor(Math.random() * rows.length)].classList[1];
            const sticks_in_row = document.querySelectorAll(`.stick-button.${randomRow}:not(.removed)`);
            const randomSticks = Math.floor(Math.random() * sticks_in_row.length) + 1;
            return { row: randomRow, sticks: randomSticks };
        }

        function applyMove(move, state) {
            const sticks_in_row = document.querySelectorAll(`.stick-button.${move.row}:not(.removed)`);
        
            for (let i = 0; i < move.sticks; i++) {
                sticks_in_row[i].classList.add('removed');
            }
            state[move.row] -= move.sticks;
        }

        function undoMove(move, state) {
            const sticks_in_row = document.querySelectorAll(`.stick-button.${move.row}.removed`);
        
            for (let i = 0; i < move.sticks; i++) {
                if (sticks_in_row.length > i) {
                    sticks_in_row[sticks_in_row.length - 1 - i].classList.remove('removed');
                }
            }
        
            state[move.row] += move.sticks;
        }
        
        function markSelectedSticks(move) {
            let sticks_in_row = document.querySelectorAll(`.stick-button.${move.row}:not(.removed)`);
            
            for(let i = 0; i < move.sticks; i++){
                if (sticks_in_row[i]) {
                    sticks_in_row[i].classList.add('selected');
                }
            }
        }

        function alphabeta(node, depth, alpha, beta, maximizingPlayer) {
            if (depth === 0 || isTerminalNode(node)) {
                return evaluateNode(node);
            }

            if (maximizingPlayer) {
                let value = -Infinity;
                let children = generateChildren(node);
                for (const child of children) {
                    value = Math.max(value, alphabeta(child, depth - 1, alpha, beta, false));
                    alpha = Math.max(alpha, value);
                    if (beta <= alpha) {
                        break;
                    }
                }
                return value;
            } else {
                let value = Infinity;
                let children = generateChildren(node);
                for (const child of children) {
                    value = Math.min(value, alphabeta(child, depth - 1, alpha, beta, true));
                    beta = Math.min(beta, value);
                    if (beta <= alpha) {
                        break;
                    }
                }
                return value;
            }
        }

        function isTerminalNode(node) {
            const keys = Object.keys(node);
            let totalSticks = 0;
    
            for (const key of keys) {
                totalSticks += node[key];
            }
            return totalSticks === 1;
        }
            // let notEmptyRows = 0;
            // let row1 = 0;
            // let row2 = 0;

            // for(let i = 0 ; i < values.length; i++){
            //     if(values[i] !== undefined && values[i] !== 0) notEmptyRows++;
            //     if(notEmptyRows === 1) row1 = i;
            //     if(notEmptyRows === 2) row2 = i;
            // }

            // if (notEmptyRows === 2 && ( values[row1] === 1 || values[row2] === 1)){
            //     return 1000;
            // }

        function evaluateNode(node) {
            const values = Object.values(node);

            // Calculate nim sum
            let nimSum = calculateNimSum(values);
            return nimSum;
        }
        
        // Helper function to calculate the nimSum of an array of heap sizes
        function calculateNimSum(heapSizes) {
            let nimSum = 0;
            for (let i = 0; i < heapSizes.length; i++) {
                nimSum ^= heapSizes[i];
            }
            return nimSum;
        }

        function generateChildren(node) {
            let children = [];
            for (const row in node) {
                if (node[row] > 0) {
                    for (let i = 1; i <= node[row]; i++) {
                        const childNode = { ...node };  // Correctly clone the node
                        childNode[row] -= i;
                        children.push(childNode);
                    }
                }
            }
            return children;
        }


    }
}   

function delay(m){
    for (let d = 0 ; d < m ; d++){
        console.log("Delay");
    }
}

function makeMove() {
    console.log(currentRowClass);
    const selectedSticksInCurrentRow = document.querySelectorAll(`.stick-button.${currentRowClass}.selected`);    
    console.log(selectedSticksInCurrentRow);
    if (selectedSticksInCurrentRow.length > 0) {     
        if(!isPlayer2Turn)delay(1000);

        updateLastMoves({ row: currentRowClass, sticks: selectedSticksInCurrentRow.length });

        selectedSticksInCurrentRow.forEach(button => {
            button.classList.remove('selected');
            button.classList.add('removed');
            button.disabled = true;
            button.style.display = 'none';
            console.log('remove');
        });


        currentRowClass = null;
        prevSelectedButton = null;

        // Check if there is only one stick left in a row
        const remainingRows = document.querySelectorAll(`.stick-button:not(.removed)`);
        console.log(remainingRows);
        if (remainingRows.length === 1) {
            // Game finished
            if (isPlayer2Turn) {
                alert('Game Over! Player 1 wins!');
                player1Score++;
            } else {
                alert('Game Over! Player 2 wins!');
                player2Score++;
            }
            resetGame(player1Score, player2Score);
            return;
        }

        // Check whose row is selected (player 1's or player 2's turn)
        if (isPlayer1Turn) {
            console.log('player1 now');
        } else {
            console.log('player2 now');
            player2Move();
        }
    } else {
        // No sticks selected, show an alert or handle as needed
        alert('Invalid move. Please select at least one stick.');
    }
}

function updateLastMoves(move) {
    const lastMoveLabel = document.getElementById('last-move');

    // Clear the label when starting a new game or resetting
    if (!move) {
        lastTwoMoves[0] = null;
        lastTwoMoves[1] = null;
        lastMoveLabel.innerHTML = '<strong>Last move:</strong>';
        return;
    }

    lastTwoMoves.shift();
    lastTwoMoves.push(move);

    const movesString = JSON.stringify(move);
    lastMoveLabel.innerHTML = `<strong>Last moves:</strong> ${move.row} : ${move.sticks}`;
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

    isPlayer1Turn = false;
    isPlayer2Turn = false;
    return;
}

function exitGame() {
    fetch('/game/logout', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/game'; 
        } else {
            console.error('Logout request failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}