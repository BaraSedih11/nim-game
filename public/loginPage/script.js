function startGame() {
    const gameType = document.getElementById("gameType").value;

    console.log(gameType);
    // Redirect to the appropriate page based on 'gameType'
    if (gameType === 'NIM1') {
        window.location.href = '../version1Page/index.html';
    } else if (gameType === 'version2') {
        window.location.href = '/version2Page';
    } else {
        // Handle other cases or show an error message
    }
}
