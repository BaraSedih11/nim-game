document.addEventListener("DOMContentLoaded", () => {
    const sticksContainer = document.querySelector(".sticks");
    const newGameButton = document.getElementById("new-game");
    const resetGameButton = document.getElementById("reset-game");
    const makeMoveButton = document.getElementById("make-move");
    const quitButton = document.getElementById("quit");

    let sticksCount = 7; // Initial number of sticks

    // Function to generate sticks on the UI
    const generateSticks = () => {
        sticksContainer.innerHTML = "";
        for (let i = 0; i < sticksCount; i++) {
            const stick = document.createElement("div");
            stick.className = "stick";
            sticksContainer.appendChild(stick);
        }
    };

    // Initialize the game
    generateSticks();

    // Event listeners for buttons
    newGameButton.addEventListener("click", () => {
        sticksCount = 7; // Set the initial number of sticks
        generateSticks();
    });

    resetGameButton.addEventListener("click", () => {
        generateSticks();
    });

    makeMoveButton.addEventListener("click", () => {
        if (sticksCount > 0) {
            sticksCount--; // Remove one stick
            generateSticks();
        }
    });

    quitButton.addEventListener("click", () => {
        // Handle quitting the game or going back to the main menu
    });
});
