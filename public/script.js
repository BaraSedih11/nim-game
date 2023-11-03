document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const gameSelection = document.querySelector(".game");
    const levelSelection = document.querySelector(".level");
    const nimGameContainer = document.querySelector(".nim-game-container");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Handle the login and show the game selection screen
        // You can collect the player's name here
        loginForm.parentElement.classList.add("hidden");
        gameSelection.classList.remove("hidden");
    });

    document.getElementById("nim-game").addEventListener("click", () => {
        gameSelection.classList.add("hidden");
        levelSelection.classList.remove("hidden");
    });

    document.getElementById("other-game").addEventListener("click", () => {
        // Handle selecting the other game
    });

    document.getElementById("start-game").addEventListener("click", () => {
        // Handle starting the game, get the selected level, and initialize the game
        // Show the NIM game interface
        levelSelection.classList.add("hidden");
        nimGameContainer.classList.remove("hidden");
    });

    // Add event listeners for game actions (reset, new game, submit move, change level)
    // Implement the game logic here
});
