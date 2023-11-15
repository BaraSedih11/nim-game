let player1, player2;
let player1Score = 0;
let player2Score = 0;

function generateSticks() {
    const sticksBox = document.getElementById('sticks-box');
    const stickImageSrc = '../images/stick.png';

    for (let i = 0; i < sticksNumber; i++) {
        const button = document.createElement('button');
        button.className = 'stick-button';

        const stick = document.createElement('img');
        stick.src = stickImageSrc;
        stick.alt = 'Stick Image';

        button.appendChild(stick);
        sticksBox.appendChild(button);
    }

    const lineBreak = document.createElement('br');
    sticksBox.appendChild(lineBreak);

    const rules = document.createElement('p');
    rules.className = 'game-rules';
    rules.textContent = 'You can select 1, 2 or 3 sticks ✅';
    sticksBox.appendChild(rules);


    addClickEventListeners();
}

function addClickEventListeners() {
    const stickButtons = document.querySelectorAll('.stick-button');

    stickButtons.forEach((stickButton, index) => {
        stickButton.id = `stick-${index + 1}`;
        stickButton.addEventListener('click', player1Move);
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
    let isPlayer1Turn = false;
    let isPlayer2Turn = false;


    if (startingPlayer === 1) {
        isPlayer1Turn = true;
        console.log("Player one turn");
    } else if (startingPlayer === 2) {
        isPlayer2Turn = true;
        console.log("Player two turn");
        player2Move();
    }
}

function player1Move(event) {
    event.preventDefault(); 
    event.stopPropagation(); 
    const stickButton = event.currentTarget; 

    console.log('clicked');

    isPlayer1Turn = false;
    isPlayer2Turn = true;

    const totalSticks = document.querySelectorAll('.stick-button:not(.removed)');
    const selectedSticks = document.querySelectorAll('.stick-button:not(.removed).selected');
    
    if (!stickButton.classList.contains('selected') && selectedSticks.length < 3) {
        if(totalSticks.length > selectedSticks.length) {
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

    // Now the algorithm starts
    const levelElement = document.getElementById('level');
    const levelValue = levelElement.textContent;

    if (levelValue === "Easy") {
        const stickButtons = document.querySelectorAll('.stick-button:not(.removed)');
    
        if (stickButtons.length > 1) {
            const maxSticksToPick = Math.min(3, stickButtons.length - 1); // Maximum number of sticks to pick is the total sticks minus one
            const numberOfSticksToPick = Math.max(1, Math.floor(Math.random() * maxSticksToPick) + 1); // Random number between 1 and maxSticksToPick
            console.log(numberOfSticksToPick);
            
            // Ensure at least one stick is not selected
            const nonSelectedSticks = Array.from(stickButtons).filter(stick => !stick.classList.contains('selected'));
            const randomNonSelectedStick = nonSelectedSticks[Math.floor(Math.random() * nonSelectedSticks.length)];
            randomNonSelectedStick.classList.add('selected');
    
            // Select the remaining sticks
            for (let i = 1; i < numberOfSticksToPick; i++) {
                const randomStick = stickButtons[Math.floor(Math.random() * stickButtons.length)];
                randomStick.classList.add('selected');
            }
        }
    }
    
    
    else if (levelValue === 'Medium') {
        console.log("You are medium");
    } 
    else if (levelValue === 'Hard') {
        console.log("You are hard");
    }

    makeMove();
}


function makeMove() {
    // Get the current arr class 
    let totalSticks = document.querySelectorAll('.stick-button:not(.removed)');
    let selectedSticks = document.querySelectorAll('.stick-button.selected');
    const total = Array.from(totalSticks);
    let gameOver = 0;

    if (total.length <= selectedSticks.length) {
        // Select the remaining sticks
        const remainingSticks = Array.from(total).filter(stick => !Array.from(selectedSticks).includes(stick));
        const numberOfSticksToRemove = Math.min(remainingSticks.length, selectedSticks.length);

        for (let i = 0; i < numberOfSticksToRemove; i++) {
            const randomStick = selectedSticks[i];
            randomStick.classList.remove('selected');
            randomStick.classList.add('removed');
            randomStick.disabled = true;
            randomStick.style.display = 'none';
        }

        selectedSticks = document.querySelectorAll('.stick-button.selected');
        if(selectedSticks.length > 0) {
            selectedSticks.forEach( button => {
                button.classList.remove('selected');
            });
        }
        
    } else {
        selectedSticks.forEach( button => {
            button.classList.remove('selected');
            button.classList.add('removed');
            button.disabled = true;
            button.style.display = 'none';

        });
    }

    totalSticks = document.querySelectorAll('.stick-button:not(.removed)');
    if(totalSticks.length === 1) {
        gameOver = 1;
    }
    
        
    if(gameOver){
        //game finished
        if (isPlayer2Turn) {
            alert('Game Over! Player 1 wins!');
            player1Score++;
        } else {
            alert('Game Over! Player 2 wins!');
            player2Score++;
        }
            resetGame(player1Score, player2Score);
    } else {
        // Check whose row is selected (player 1's or player 2's turn)
        if (isPlayer1Turn) {
            console.log('player1 now');
        } else {
            console.log('player2 now');
            player2Move();
        }
    }



}

function updateScores(score1, score2) {
    const resultValue = document.getElementById('result');
    resultValue.innerHTML = `ME : ${score1} vs PC : ${score2}`;
}

function resetGame(score1, score2) {
    console.log('Reset Game');

    // Clear existing sticks
    const sticksBox = document.getElementById('sticks-box');
    sticksBox.innerHTML = '';
    // Generate new sticks
    generateSticks();

    // display the result
    updateScores(score1, score2);
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

