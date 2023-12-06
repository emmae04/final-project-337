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

function newGame() {

    document.getElementById("label").style.visibility = "hidden";
    let spots = document.getElementsByClassName("spot");
    for (let i = 0; i < spots.length; i++) {
        spots[i].innerText = "";
    }
    turn = 0;
    gameOver = false;
}


function makeTurn(id) {
    if (!gameOver) {
        console.log('HERE');
        console.log(id);
        let space = document.getElementById(id);
        if (player == 0) {
            console.log("player 0 turn");
            console.log(space.innerText);
            if (space.innerText == "") {
                document.getElementById("label").style.visibility = "hidden";
                console.log("got here");
                space.innerText = "X";
                turn += 1;
                if (gameWon(0) == true) {
                    // console.log("HUMAN WON");
                    // score += 5;
                    // scoreLabel.innerText = "Score: " + score;
                    // label.innerText = "YOU WON!";
                    update("WIN");
                    // document.getElementById("label").style.visibility = "visible";
                    gameOver = true;
                }
                else if (gameWon(1) == true) {
                    // document.getElementById("label").style.visibility = "visible";
                    // label.innerText = "YOU LOST!";
                    // score -= 2;
                    // scoreLabel.innerText = "Score: " + score;
                    // console.log("ROBOT WON");
                    update("LOSS");
                    gameOver = true;
                }
                else if (tie() == true) {
                    // document.getElementById("label").style.visibility = "visible";
                    // label.innerText = "TIE GAME!";
                    // score += 2;
                    // scoreLabel.innerText = "Score: " + score;
                    // console.log("TIE");
                    update("TIE");
                    gameOver = true;
                }
                else {
                    //console.log("making robot move");
                    robotMove();
                    if (gameWon(0) == true) {
                        // document.getElementById("label").style.visibility = "visible";
                        // score += 5;
                        // scoreLabel.innerText = "Score: " + score;
                        // label.innerText = "YOU WON!";
                        // console.log("HUMAN WON");
                        update("WIN");
                        gameOver = true;
                    }
                    else if (gameWon(1) == true) {
                        // document.getElementById("label").style.visibility = "visible";
                        // score -= 2;
                        // scoreLabel.innerText = "Score: " + score;
                        // label.innerText = "YOU LOST!";
                        // console.log("ROBOT WON");
                        update("LOSS");
                        gameOver = true;
                    }
                    else if (tie() == true) {
                        // document.getElementById("label").style.visibility = "visible";
                        // score += 2;
                        // scoreLabel.innerText = "Score: " + score;
                        // label.innerText = "TIE GAME!";
                        // console.log("TIE");
                        update("TIE");
                        gameOver = true;
                    }
                }
            } else {
                if (gameOver == false) {
                    label.innerText = "INVALID MOVE SPOT ALREADY TAKEN";
                    document.getElementById("label").style.visibility = "visible";
                }
            }
        }
    }
}

function update(status) {
    document.getElementById("label").style.visibility = "visible";
    if (status == "LOSS") {
        fetch('/get/curUsers/')
            .then((res) => {
                res.text()
                    .then((res2) => {
                        console.log(res2);
                        fetch("/TTT/Loss/", {
                            method: "POST",
                            body: JSON.stringify({ username: res2 }),
                            headers: { 'Content-Type': 'application/json' }
                        }).then((res) => {
                            return res.text();
                        }).then((text) => {
                            scoreLabel.innerText = "Score: " + text;
                            label.innerText = "YOU LOST!";
                        }).catch((err) => { console.log(err) });
                    })
            });

    }
    if (status == "WIN") {
        fetch('/get/curUsers/')
            .then((res) => {
                res.text()
                    .then((res2) => {
                        console.log(res2);
                        fetch("/TTT/Win/", {
                            method: "POST",
                            body: JSON.stringify({ username: res2 }),
                            headers: { 'Content-Type': 'application/json' }
                        }).then((res) => {
                            return res.text();
                        }).then((text) => {
                            scoreLabel.innerText = "Score: " + text;
                            label.innerText = "YOU Won";
                        }).catch((err) => { console.log(err) });
                    })
            });

    }
    if (status == "TIE") {
        fetch('/get/curUsers/')
            .then((res) => {
                res.text()
                    .then((res2) => {
                        console.log(res2);
                        fetch("/TTT/Tie/", {
                            method: "POST",
                            body: JSON.stringify({ username: res2 }),
                            headers: { 'Content-Type': 'application/json' }
                        }).then((res) => {
                            return res.text();
                        }).then((text) => {
                            scoreLabel.innerText = "Score: " + text;
                            label.innerText = "YOU TIED!";
                        }).catch((err) => { console.log(err) });
                    })
            });

    }
}

function tie() {
    let spots = document.getElementsByClassName("spot");
    for (let i = 0; i < spots.length; i++) {
        if (spots[i].innerText == "") {
            return false;
        }
    }
    return true;

}
function gameWon(player) {
    let symbol = "X";
    if (player == 1) {
        symbol = "O";
    }

    if (checkDiagonal(symbol)) {
        return true;
    }
    if (checkVertical(symbol)) {
        return true;
    }
    if (checkHorizontal(symbol)) {
        return true;
    }

    return false;

}

function checkDiagonal(symbol) {

    if (topLeft.innerText == symbol && middleMiddle.innerText == symbol && bottomRight.innerText == symbol) {
        return true;
    }
    if (topRight.innerText == symbol && middleMiddle.innerText == symbol && bottomLeft.innerText == symbol) {
        return true;
    }
    return false;
}

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

function updateButtons() {
    var buts = document.getElementsByClassName("spot");
    for (let i = 0; i < buts.length; i++) {
        buts[i].onclick = (e) => { makeTurn(e.target.id) };
    }
}
updateButtons();