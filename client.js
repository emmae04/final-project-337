const dices = [
    ['L', 'R', 'Y', 'T', 'T', 'E'],
    ['A', 'N', 'A', 'E', 'E', 'G'],
    ['A', 'F', 'P', 'K', 'F', 'S'],
    ['Y', 'L', 'D', 'E', 'V', 'R'],
    ['V', 'T', 'H', 'R', 'W', 'E'],
    ['I', 'D', 'S', 'Y', 'T', 'T'],
    ['X', 'L', 'D', 'E', 'R', 'I'],
    ['Z', 'N', 'R', 'N', 'H', 'L'],
    ['E', 'G', 'H', 'W', 'N', 'E'],
    ['O', 'A', 'T', 'T', 'O', 'W'],
    ['H', 'C', 'P', 'O', 'A', 'S'],
    ['N', 'M', 'I', 'H', 'U', 'Q'],
    ['S', 'E', 'O', 'T', 'I', 'S'],
    ['M', 'T', 'O', 'I', 'C', 'U'],
    ['E', 'N', 'S', 'I', 'E', 'U'],
    ['O', 'B', 'B', 'A', 'O', 'J']
];

// var currentBoard = new Array(4).fill(0).map(() => new Array(4).fill(0));
var currentBoard = [];
var userGuesses = [];
var gameStart = 0;
var time = 180;
var points = 0;
var correctBoggleWords = [];

function tableToArray(table) {
    var tableArray = [];
    // goes through all the rows in the table
    for (let i = 0; i < table.rows.length; i++) {
        var rowArray = [];
        var row = table.rows[i];
        // goes through all the cells in each row
        for (let j = 0; j < row.cells.length; j++) {
            var element = row.cells[j];
            rowArray.push(element.textContent);
        }
        tableArray.push(rowArray);
    }

    return tableArray;
}

var intervalId;

function startGame() {
    document.getElementById("allGuesses").innerHTML = "<div> All Guesses:<br><br></div>";
    document.getElementById("scoreLabel").innerHTML = "<h2> Score: </h2>";
    document.getElementById("guessLabel").innerHTML = "";
    table = document.getElementById("diceTray");
    currentBoard = tableToArray(table);
    DiceTray();
    var temp = currentBoard.slice();
    // goes through rows of table
    for (let i = 0; i < table.rows.length; i++) {
        var row = table.rows[i];
        // goes through columns of table
        for (let j = 0; j < row.cells.length; j++) {
            const cell = row.cells[j];
            cell.textContent = temp[i][j];
        }
    }

    fetch("/diceTray/", {
        method: "POST",
        body: JSON.stringify(temp),
        headers: { 'Content-Type': 'application/json' }
    }).then((res) => {
        return res.text();
    }).then((res) => {
        clearInterval(this.intervalId);
        intervalId = setInterval(timer, 1000);
        correctBoggleWords = res;
        console.log(correctBoggleWords);
        time = 180;
        points = 0;
        gameStart = 1;
    }).catch((err) => {
        console.log(err);
        console.log("error");
    });
}

function timer() {
    var min = time / 60;
    var sec = Math.floor(time - 60 * Math.floor(min));
    if (time == 0) {
        clearInterval(this.intervalId);
        document.getElementById("currTime").innerHTML = "TIMES UP";
        document.getElementById("guessLabel").innerHTML = "Already Guessed";
        gameStart = 0;

        fetch("/score/", {
            method: "POST",
            body: JSON.stringify(score),
            headers: { 'Content-Type': 'application/json' }
        }).catch((err) => {
            console.log(err);
            console.log("error");
        });
        return;
    }
    if (sec.toString().length == 1) {
        document.getElementById("currTime").innerHTML = Math.floor(min).toString() + " : 0" + sec.toString();
    } else {
        document.getElementById("currTime").innerHTML = Math.floor(min).toString() + " : " + sec.toString();
    }
    time--;
}

async function updateScore() {
    document.getElementById("scoreLabel").innerHTML = "<h2> Score: " + points + "</h2>";
}

function DiceTray() {
    const numbersArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const numbersArray2 = [0, 1, 2, 3, 4, 5];

    const pick = [...numbersArray];
    const pick2 = [...numbersArray2];
    // randomizes the array
    pick.sort(() => Math.random() - 0.5);
    pick2.sort(() => Math.random() - 0.5);
    console.log(pick);
    console.log(pick2);

    let count = 0;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const val2 = Math.floor(Math.random() * 4);
            currentBoard[i][j] = dices[pick[count]][pick2[val2]];
            count++;
            if (count == 16) {
                count = 0;
            }
        }
    }
}


function userGuess() {
    document.getElementById("guessLabel").innerHTML = "";
    if (gameStart == 1 && time != 0) {
        var userInput = document.getElementById("guess").value;
        userInput = userInput.toLowerCase();
        if (!userGuesses.includes(userInput)) {
            userGuesses.push(userInput);
            var tempDiv = "<div>" + userInput + "</div>";
            document.getElementById("allGuesses").innerHTML += tempDiv;
            if (correctBoggleWords.includes(userInput)) {
                addPoints(userInput);
                updateScore();
            }
        }else{
            document.getElementById("guessLabel").innerHTML = "Already Guessed";
        }
    }
    document.getElementById('guess').value = "";
}


function addPoints(word) {
    var len = word.length;
    if (len == 3 || len == 4) {
        points++;
    } else if (len == 5) {
        points += 2;
    } else if (len == 6) {
        points += 3;
    } else if (len == 7) {
        points += 4;
    } else if (len >= 8) {
        points += 11;
    }
}