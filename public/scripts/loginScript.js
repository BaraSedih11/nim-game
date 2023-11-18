document.addEventListener("DOMContentLoaded", function() {
    // Event listener for the game type select box
    document.getElementById("gameType").addEventListener("change", updateSticksOptions);

    // Initial call to set up the sticks options based on the initial game type
    updateSticksOptions();
});

function startGame() {
    console.log("Clicked succesfully");
    const gameType = document.getElementById("gameType").value;
    const username = document.getElementById("username").value;
    const numberOfSticks = document.getElementById("sticks").value;
    const levelNumber = document.getElementById("level").value;

    let apiURL = '';
    let sticks = 0;
    let level = levelNumber;

    if (gameType === 'NIM1') {
        apiURL = '/game/version1';
        if (numberOfSticks === 'mode4') {
            sticks = 4;
        } else if (numberOfSticks === 'mode9') {
            sticks = 9;
        } else if (numberOfSticks === 'mode16') {
            sticks = 16;
        }
    } else if (gameType === 'NIM2') {
        apiURL = '/game/version2';
        // Parse the selected number of sticks as an integer
        sticks = parseInt(numberOfSticks.replace("mode", ""), 10);
    }

    // Make a GET request to the server's API
    fetch('/game/startGame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, gameType, sticks, level }),
    })
    .then(response => {
        if (response.ok) {
            window.location.href = apiURL; 
        } else {
            console.error('Authentication failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Event listener for the game type select box
document.getElementById("gameType").addEventListener("change", updateSticksOptions);

// Function to update the options in the "sticks" select box based on the selected game type
function updateSticksOptions() {
    const gameType = document.getElementById("gameType").value;
    const sticksSelect = document.getElementById("sticks");

    // Clear existing options
    sticksSelect.innerHTML = "";

    // Add new options based on the selected game type
    if (gameType === 'NIM1') {
        addOption(sticksSelect, "4");
        addOption(sticksSelect, "9");
        addOption(sticksSelect, "16", true);
    } else if (gameType === 'NIM2') {
        for (let i = 4; i <= 16; i++) {
            addOption(sticksSelect, i.toString());
        }
    }
}

// Helper function to add an option to the select box
function addOption(selectBox, value, selected = false) {
    const option = document.createElement("option");
    option.value = "mode" + value;
    option.text = value;
    option.selected = selected;
    selectBox.add(option);
}