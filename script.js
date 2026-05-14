/* PLAN
Gameboard as array inside Gameboard Object (index 0-8 as possible positions?)
    array of Player Strings. '' is unclaimed, Player1 and Player2 Which are variables that get declared
    No need to keep track of array index in object itself because it already is in array index itself.
    Free positions
    Taken positions
    Array of solutions (with string 012, 046, etc.) numbers toString and append.

Players stored in objects
    Keep track of: 
    Name, isTurn

isWin function -- consider the different possibilities for winning. Use number indexof? (or member of) to check
check for valid spaces left

playRound() -- Keep restrictive as possible

Only need 1 Gameboard object
use factory function (make object) IIFE

*Minimize global code, use factories
*If single instance needed, wrap factory inside IIFE

DOM
DOM is able to read whos turn it is. simple to call.
UI only interacts through playRound()
if the index is already taken then deactivate the DOM response.

DESIGN 
Sketchy style (with stickers?). X and O on side where the one being worked on is highlighted. 
2000s y2k style. 
inspo: anakt school alnst? 

TODO: 
- Redesign Code Structure
perhaps remove player 1 and 2 and only keep x and o tto avoid confusions.
- Style

*/

//NOTE: Within this game, Player 1 uses 'X' while Player 2 uses 'O'

const playerContainer = document.getElementById("players-container");
const spotList = [];
for (let i = 0; i< 9; i++) {
    spotList[i] = document.getElementById("spot-"+i);
}
const boardDisplay = document.getElementById("gameboard");
const newGameBtn = document.getElementById("new-game");
const gameResultDisplay = document.getElementById("game-result");

const pX = createPlayer(document.getElementById("pX-name-input").value, "X");
const pO = createPlayer(document.getElementById("pO-name-input").value, "O");

const gameboard = (function() {
    let board =  ['', '', '', '', '', '', '', '',''];
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

function playMove(player, spot) { //may nest into another function
    gameboard.setSpot(spot, player.symbol);
}

function swapTurn(pX, pO) {
    pX.isTurn = !pX.isTurn;
    pO.isTurn = !pO.isTurn;
}

function checkGameResult(pX, pO) {
    if (gameResult(pX, pO) !== false) {
       if (gameResult(pX, pO) == "tie") {
            gameResultDisplay.textContent = 'It is a tie';
        } else {
            gameResultDisplay.textContent = `${gameResult(pX, pO).name} wins`;
        }
        return true;
    }
    return false;
}

function playRound() {
    boardDisplay.addEventListener('click', (event) => {
        if (event.target.tagName==='BUTTON') {
            if (event.target.textContent !== '' || checkGameResult(pX, pO)) {
                return; //prevents placing in occupied areas or after game end
            }
            if (pX.isTurn) {
                playMove(pX, event.target.id.at(-1)); //consider refactoring this into a function(s)
                event.target.textContent = 'X';
            } else {
                playMove(pO, event.target.id.at(-1));
                event.target.textContent = 'O';
            }
            swapTurn(pX, pO);
            checkGameResult(pX, pO);
            console.log(gameboard.board()); //!!! remove later
        }
    });
}

function clearGame() {
    //!!! is clearing players needed? or will they just be redeclared
    for (let i = 0; i < gameboard.board().length; i++) { //clear gameboard data
        gameboard.setSpot(i, '');
    }
    for (let i = 0; i < 9; i++) { //clear visual gameboard
        spotList[i].textContent = '';
    }
    gameResultDisplay.textContent = ''; //clear game result
}

newGameBtn.addEventListener('click', () => {
    clearGame();
    playRound();
})

playerContainer.addEventListener('input', (event) => {
    if (event.target.tagName==='INPUT') {
        if(event.target.id==="pX-name-input") {
            pX.name = event.target.value;
        } else {
            pO.name = event.target.value;
        }
    }
})

playRound();