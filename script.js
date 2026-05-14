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

!!! verify no duplicate entries.

!!! nameset functionality

DOM
DOM is able to read whos turn it is. simple to call.
UI only interacts through playRound()
if the index is already taken then deactivate the DOM response.

Name input cannot be empty--this will mess up the functionality. Either start with P1 or P2 or make them set a name before..

DESIGN 
Sketchy style (with stickers?). X and O on side where the one being worked on is highlighted. 
2000s y2k style. 
*/

//NOTE: Within this game, Player 1 uses 'X' while Player 2 uses 'O'

const p1name = document.getElementById("p1-name-input").value;
const p2name = document.getElementById("p2-name-input").value;
const spot0 = document.getElementById("spot-0");
const spot1 = document.getElementById("spot-1");
const spot2 = document.getElementById("spot-2");
const spot3 = document.getElementById("spot-3");
const spot4 = document.getElementById("spot-4");
const spot5 = document.getElementById("spot-5");
const spot6 = document.getElementById("spot-6");
const spot7 = document.getElementById("spot-7");
const spot8 = document.getElementById("spot-8");
const boardDisplay = document.getElementById("gameboard");
const newGameBtn = document.getElementById("new-game");
const gameResultDisplay = document.getElementById("game-result");

const spotList = [spot0, spot1, spot2, spot3, spot4, spot5, spot6, spot7, spot8];

const gameboard = (function() {
    let board =  ['', '', '', '', '', '', '', '',''];
    return {
        board() {
            return board;
        }, 
        setSpot(index, playerName) {
            board[index] = playerName;
        }
    }
})();

function createPlayer(name, num) {
    return {name, num, isTurn: num === 1}
}

function gameResult(p1, p2) {
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
            if (board[i] === player.name) {
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
    if (isWin(p1)) {
        return p1;
    } else if (isWin(p2)) {
        return p2;
    } else if (!spotsLeft()) {
        return "tie";
    } else {
        return false;
    }
}

function swapTurn(p1, p2) {
    p1.isTurn = !p1.isTurn;
    p2.isTurn = !p2.isTurn;
}

function playMove(player, spot) { //may nest into another function
    gameboard.setSpot(spot, player.name);
}

function playRound() {
    const p1 = createPlayer(p1name, 1);
    const p2 = createPlayer(p2name, 2);
    if (gameResult(p1, p2) !== false) {
        if (gameResult(p1, p2) == "tie") {
            gameResultDisplay.textContent('It is a tie');
        } else {
            gameResultDisplay.textContent(`${gameResult(p1, p2).name} wins`);
        }
    } else {
        boardDisplay.addEventListener('click', (event) => {
            if (event.target.tagName==='BUTTON') {
                if (p1.isTurn) {
                    playMove(p2, event.target.id.at(-1));
                    event.target.textContent = 'X';
                    swapTurn(p1, p2);
                } else {
                    playMove(p2, event.target.id.at(-1));
                    event.target.textContent = 'O';
                    swapTurn(p1, p2);
                }
            }
        });
    }
}

function clearGame() {
    //!!! is clearing players needed? or will they just be redeclared
    for (let i = 0; i < gameboard.board().length; i++) { //clear gameboard data
        gameboard.setSpot(i, '');
    }
    for (let i = 0; i < 9; i++) { //clear visual gameboard
        spotList[i].textContent = '';
    }
}

playRound();

newGameBtn.addEventListener('click', () => {
    clearGame();
    playRound();
})
