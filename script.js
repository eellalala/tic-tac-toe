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
*get game to work in console first.

!!! verify no duplicate entries.

DOM
DOM is able to read whos turn it is. simple to call.
UI only interacts through playRound()
if the index is already taken then deactivate the DOM response.

Name input cannot be empty.

UI 
Cells are buttons not divs, since they are clickable.

DESIGN 
Sketchy style (with stickers?). X and O on side where the one being worked on is highlighted. 
2000s y2k style. 
*/

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
    let isTurn;
    if (num ==1) {
        isTurn = true;
    } else {
        isTurn = false;
    }
    return {name, isTurn}
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

function playMove(player) { //may nest into another function
    let spot = prompt(`${player.name}Which spot would you like to take`);
    gameboard.setSpot(spot, player.name);
}

function playRound() {
    const p1 = createPlayer("Player 1", 1); //!!! change to recieve inputs later.
    const p2 = createPlayer("Player 2", 2);
    while (gameResult(p1, p2) == false) {
        if (p1.isTurn) {
            playMove(p1);
            swapTurn(p1, p2);
        } else {
            playMove(p2);
            swapTurn(p1, p2);
        }
    }
    if (gameResult(p1, p2) !== false) {
        if (gameResult(p1, p2) == "tie") {
            console.log(`It is a tie`);
        } else {
            console.log(`${gameResult(p1, p2).name} wins`)
        }
    }
}

playRound();