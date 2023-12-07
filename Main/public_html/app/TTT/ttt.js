// function makeTurn(){
//     console.log("clicked");
// }

var turn = 0;
var player = 0;
var score = 0;
var gameOver = false;
var topLeft = document.getElementById("0");
var topMiddle = document.getElementById("1");
var topRight = document.getElementById("2");

var middleLeft = document.getElementById("3");
var middleMiddle = document.getElementById("4");
var middleRight = document.getElementById("5");

var bottomLeft = document.getElementById("6");
var bottomMiddle = document.getElementById("7");
var bottomRight = document.getElementById("8");
var label = document.getElementById("label");
var scoreLabel = document.getElementById("score");
var options = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
function changeHTML() {
    window.location.href = "http://localHost/app/main.html"
}

/**
 * this intial fetch gets the current users score and displays it 
 */
fetch('/get/curUsers/')
    .then((res) => {
        res.text()
            .then((res2) => {
                username = res2;
                console.log(res2);
                fetch("/TTT/get/Score/", {
                    method: "POST",
                    body: JSON.stringify({ username: res2 }),
                    headers: { 'Content-Type': 'application/json' }
                }).then((res) => {
                    return res.text();
                }).then((text) => {
                    scoreLabel.innerText = "Score: " + text;

                }).catch((err) => { console.log(err) });


            })
    });

    /**
     * this sets the ttt board to all blank , is called by newgame button
     */
function newGame() {

    document.getElementById("label").style.visibility = "hidden";
    let spots = document.getElementsByClassName("spot");
    for (let i = 0; i < spots.length; i++) {
        spots[i].innerText = "";
    }
    turn = 0;
    gameOver = false;
}

/**
 * method makes a turn from the user, first it checks if the spot
 * is empty , if not then it places the user x there, then makes the robot move
 * then calls the methods to check if the game is over
 * @param {} id  , the id of the square that was clicked
 */
function makeTurn(id) {
    if (!gameOver) {// if game still going
    
     
        let space = document.getElementById(id);
        if (player == 0) {
      
            console.log(space.innerText);
            if (space.innerText == "") {
                document.getElementById("label").style.visibility = "hidden";
                space.innerText = "X";
                turn += 1;
                if (gameWon(0) == true) {// if user won after move
                    update("WIN");// update user score
                    gameOver = true;
                }
                else if (gameWon(1) == true) {// if robot won
                    update("LOSS");// update user score
                    gameOver = true;
                }
                else if (tie() == true) {// if tie
                    update("TIE");// update user score
                    gameOver = true;
                }
                else {// making the robot move if user didnt win with their move
                    robotMove();
                    if (gameWon(0) == true) {// if user won 
                        update("WIN");// update user score
                        gameOver = true;
                    }
                    else if (gameWon(1) == true) {// if robot won
                        update("LOSS");// update user score
                        gameOver = true;
                    }
                    else if (tie() == true) {// if tie game
                        update("TIE");// update user score
                        gameOver = true;
                    }
                }
            } else {
                if (gameOver == false) {// if the user couldnt place there and game ongoing
                    label.innerText = "INVALID MOVE SPOT ALREADY TAKEN";
                    document.getElementById("label").style.visibility = "visible";
                }
            }
        }
    }
}

/**
 * method updates the user score in the database and on the screen
 * @param {*} status , "WIN","LOSS","TIE"
 */
function update(status) {
    document.getElementById("label").style.visibility = "visible";
    if (status == "LOSS") {// if the user lost
        fetch('/get/curUsers/')// get the current user
            .then((res) => {
                res.text()
                    .then((res2) => {
                        fetch("/TTT/Loss/", {// post that they lost
                            method: "POST",
                            body: JSON.stringify({ username: res2 }),
                            headers: { 'Content-Type': 'application/json' }
                        }).then((res) => {
                            return res.text();
                        }).then((text) => {// text is the users score
                            scoreLabel.innerText = "Score: " + text;// putting score on screen
                            label.innerText = "YOU LOST!";
                        }).catch((err) => { console.log(err) });
                    })
            });

    }
    if (status == "WIN") {// if user won
        fetch('/get/curUsers/')// getting the current user
            .then((res) => {
                res.text()
                    .then((res2) => {
                        fetch("/TTT/Win/", {// posting that the user won
                            method: "POST",
                            body: JSON.stringify({ username: res2 }),
                            headers: { 'Content-Type': 'application/json' }
                        }).then((res) => {
                            return res.text();
                        }).then((text) => {
                            // updating the score on screen
                            scoreLabel.innerText = "Score: " + text;
                            label.innerText = "YOU Won";
                        }).catch((err) => { console.log(err) });
                    })
            });

    }
    if (status == "TIE") {// if the user tied
        fetch('/get/curUsers/')// get the current user
            .then((res) => {
                res.text()
                    .then((res2) => {
                        fetch("/TTT/Tie/", {// post that they tied
                            method: "POST",
                            body: JSON.stringify({ username: res2 }),
                            headers: { 'Content-Type': 'application/json' }
                        }).then((res) => {
                            return res.text();
                        }).then((text) => {
                            // set the score on the screen
                            scoreLabel.innerText = "Score: " + text;
                            label.innerText = "YOU TIED!";
                        }).catch((err) => { console.log(err) });
                    })
            });

    }
}

/**
 * method to check if the user tied by checking if all spots are taken
 * @returns true if they tied , false else
 */
function tie() {
    let spots = document.getElementsByClassName("spot");
    for (let i = 0; i < spots.length; i++) {
        if (spots[i].innerText == "") {
            return false;
        }
    }
    return true;

}
/**
 * checks if the game was won by the given player
 * @param {} player , X if the user , O if the robot
 * @returns true if player won , false else
 */
function gameWon(player) {
    let symbol = "X";//preset to the user
    if (player == 1) {// if the player is the robot then set so
        symbol = "O";
    }

    if (checkDiagonal(symbol)) {// check if player won diagonally
        return true;
    }
    if (checkVertical(symbol)) {// check if player won vertically
        return true;
    }
    if (checkHorizontal(symbol)) {// check if player won horizontally
        return true;
    }

    return false;

}

/**
 * method checks if the diagonals all contain the given symbol
 * @param {} symbol , X or O
 * @returns , true if the diagonals all contain the given symbol false else
 */
function checkDiagonal(symbol) {

    if (topLeft.innerText == symbol && middleMiddle.innerText == symbol && bottomRight.innerText == symbol) {
        return true;
    }
    if (topRight.innerText == symbol && middleMiddle.innerText == symbol && bottomLeft.innerText == symbol) {
        return true;
    }
    return false;
}
/**
 * method checks if any of the horizontals all contain the given symbol
 * @param {} symbol , X or O
 * @returns , true if any of the horizontals all contain the given symbol false else
 */
function checkHorizontal(symbol) {
    if (topLeft.innerText == symbol && topMiddle.innerText == symbol && topRight.innerText == symbol) {
        return true;
    }
    if (middleLeft.innerText == symbol && middleMiddle.innerText == symbol && middleRight.innerText == symbol) {
        return true;
    }
    if (bottomLeft.innerText == symbol && bottomMiddle.innerText == symbol && bottomRight.innerText == symbol) {
        return true;
    }

    return false;
}

/**
 * method checks if any of the Verticals all contain the given symbol
 * @param {} symbol , X or O
 * @returns , true if any of the Verticals all contain the given symbol false else
 */
function checkVertical(symbol) {
    if (topLeft.innerText == symbol && middleLeft.innerText == symbol && bottomLeft.innerText == symbol) {
        return true;
    }
    if (topMiddle.innerText == symbol && middleMiddle.innerText == symbol && bottomMiddle.innerText == symbol) {
        return true;
    }
    if (topRight.innerText == symbol && middleRight.innerText == symbol && bottomRight.innerText == symbol) {
        return true;
    }

    return false;
}

/**
 * method makes a random robot move
 */
function robotMove() {
    let randomInt = Math.floor(Math.random() * 9)
    let move = document.getElementById(randomInt.toString());
    console.log("item got:" + randomInt);
    let goodInput = false;
    goodInput = (move.innerText == "");
    while (!goodInput) {
        randomInt = Math.floor(Math.random() * 9)
        move = document.getElementById(randomInt.toString());
        console.log("item got:" + randomInt);
        //document.getElementById(Math.floor(Math.random() * 9).toString());
        if (move.innerText == "") {
            goodInput = true;
        }
    }
    move.innerText = "O";
}

/**
 * method makes all the spaces in the ttt board to have onclicks to make a move
 */
function updateButtons() {
    var buts = document.getElementsByClassName("spot");
    for (let i = 0; i < buts.length; i++) {
        buts[i].onclick = (e) => { makeTurn(e.target.id) };
    }
}
updateButtons();