const primaryColor = window.getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
const secondaryColor = window.getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
const tertiaryColor = window.getComputedStyle(document.documentElement).getPropertyValue('--tertiary-color');
const primaryColorHi = window.getComputedStyle(document.documentElement).getPropertyValue('--primary-color-highlight');
const secondaryColorHi = window.getComputedStyle(document.documentElement).getPropertyValue('--secondary-color-highlight');

const playerContainer = document.getElementById("players-container");
const pXInfo = document.getElementById("pX-info");
const pOInfo = document.getElementById("pO-info");

const spotList = [];
for (let i = 0; i< 9; i++) {
    spotList[i] = document.getElementById("spot-"+i);
}
const newGameBtn = document.getElementById("new-game-btn");
const gameResultDisplay = document.getElementById("game-result");

const gameboard = (function() {
    let board =  ['', '', '', '', '', '', '', '', ''];
    return {
        board() {
            return board;
        }, 
        setSpot(index, playerSymbol) {
            board[index] = playerSymbol;
        }
    }
})();

function createPlayer(name, symbol) {
    return {name, symbol, isTurn: symbol === "X"}
}

const gameController = (function() {
    const pX = createPlayer(document.getElementById("pX-name-input").value, "X");
    const pO = createPlayer(document.getElementById("pO-name-input").value, "O");

    const boardDisplay = document.getElementById("gameboard");
    
    function playMove(player, spot) {
        gameboard.setSpot(spot, player.symbol);
    }

    function swapTurn(pX, pO) {
        pX.isTurn = !pX.isTurn;
        pO.isTurn = !pO.isTurn;
    }

    boardDisplay.addEventListener('click', (event) => {
        if (event.target.tagName==='BUTTON') {
            if (event.target.textContent !== '' || gameResult(pX, pO)) {
                return; //prevents placing in occupied areas or after game end
            }
            if (pX.isTurn) {
                playMove(pX, event.target.id.at(-1));
            } else {
                playMove(pO, event.target.id.at(-1));
            }
            displayGame(pX, pO);
            swapTurn(pX, pO);
        }
    });

    return {
        getPlayers() {
            return {pX, pO};
        }
    }

})();

function gameResult(pX, pO) {
    const board = gameboard.board();
    function spotsLeft() {
        let spotsLeft = false;
        for (let i = 0; i < board.length; i++) {
            if (board[i] == '') {
                spotsLeft = true;
            }
        }
        return spotsLeft;
    }
    function isWin(player) {
        const solutions = [
            [0, 1, 2], //horizontal
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6], //vertical
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8], //diagonal
            [2, 4, 6]
        ]
        const takenSpots = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === player.symbol) {
                takenSpots.push(i);
            }
        }
        for (let i = 0; i < solutions.length; i++) {
            if (solutions[i].every((n) => (takenSpots.includes(n)))) {
                return true;
            }
        }
        return false;
    }
    if (isWin(pX)) {
        return pX;
    } else if (isWin(pO)) {
        return pO;
    } else if (!spotsLeft()) {
        return "tie";
    } else {
        return false;
    }
}

function displayGame(pX, pO) {
    pXInfo.classList.toggle('primary-highlight');
    pOInfo.classList.toggle('secondary-highlight');
    for (let i = 0; i< gameboard.board().length; i++) {
        let symbol = gameboard.board()[i];
        spotList[i].textContent = symbol;
        if (symbol === "X") {
            spotList[i].style.color = primaryColor;
        } else {
            spotList[i].style.color = secondaryColor;
        }
    }
    if (gameResult(pX, pO) !== false) {
       if (gameResult(pX, pO) == "tie") {
            gameResultDisplay.textContent = "It's a tie.";
        } else {
            gameResultDisplay.textContent = `${gameResult(pX, pO).name} wins!`;
            for (let i = 0; i<gameboard.board().length; i++) {
                spotList[i].classList.remove("border-tertiary");
                if (gameResult(pX, pO).symbol==="X") {
                    spotList[i].classList.add("border-primary");
                } else {
                    spotList[i].classList.add("border-secondary");
                }
            }
        }
    }
}

function clearGame() {
    for (let i = 0; i < gameboard.board().length; i++) { //clear gameboard data
        gameboard.setSpot(i, '');
    }
    for (let i = 0; i < 9; i++) { //clear visual gameboard
        spotList[i].textContent = '';
        spotList[i].classList.remove("border-primary");
        spotList[i].classList.remove("border-secondary");
        spotList[i].classList.add("border-tertiary");
    }
    gameResultDisplay.textContent = ''; //clear game result
}

newGameBtn.addEventListener('click', () => {
    clearGame();
})

playerContainer.addEventListener('input', (event) => {
    if (event.target.tagName==='INPUT') {
        if(event.target.id==="pX-name-input") {
            gameController.getPlayers().pX.name = event.target.value;
        } else {
            gameController.getPlayers().pO.name = event.target.value;
        }
    }
}) 

const profileChange = (function() {
    const Xpfp = document.getElementById("X-pfp");
    const Opfp = document.getElementById("O-pfp");
    const pfpSelectX = document.getElementById('profile-select-X');
    const pfpSelectO = document.getElementById('profile-select-O');

    Xpfp.addEventListener('click', () => {
        pfpSelectX.classList.toggle('hidden'); 
    })

    Opfp.addEventListener('click', () => {
        pfpSelectO.classList.toggle('hidden'); 
    })

    const profileNames = ['mizi', 'sua', 'hyuna', 'till', 'ivan', 'luka'];
    const profileVar = [];
    for (let i = 0; i< profileNames.length; i++) {
        profileVar[i] = document.getElementById("select-"+profileNames[i]);
        profileVar[i].addEventListener('click', () => {
            let pfpPic = 'public/' + profileNames[i] + '.jpg';
            if (i < 3) {
                Xpfp.setAttribute('src', pfpPic);
                pfpSelectX.classList.toggle('hidden'); 
            } else {
                Opfp.setAttribute('src', pfpPic);
                pfpSelectO.classList.toggle('hidden');
            }
        })
    }
})();