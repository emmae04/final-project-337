const fiveL = [];
const boxes = ["one", "two", "three", "four", "five", "six", "seve", "eight", "nine",
    "ten", "eleven", "twelve"];
let guesses = 0;
let wrong = "";
let left = 5;
// const fs = require('fs');
// const readline = require('readline'); 


// If currUser tracked in mainServer, menu bar, how to play, how to go back




function readFile(file) {
    const input = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: input,
        terminal: false
    });

    rl.on('line', function(line) {
        fiveL.push(line);
    });
}

readFile('five.txt');

function getWord() {
    return fiveL[Math.floor(Math.random() * fiveL.length)];
}

function tellServer(won) {
    var l = document.getElementById("level").innerHTML;
    let level = l.slice(11, l.length - 1);
    let info = {"level": level, "word": answer, "guesses": guesses, "wins": won};
    let p = fetch('http://localhost/new/score', {
        method: "POST",
        body: JSON.stringify(info),
        headers: {"Contect-Type": "application/json"}    
    });

    // Promises
    p.then((response) => {
        console.log("done");
        return response.text();
    })
}

function won() {
    console.log("won");
    var text = document.getElementById("guess");
    var button = document.getElementById("makeGuess");
    text.remove();

    var newDiv = document.createElement("div");
    newDiv.innerHTML = "You Won! Dare to play again?";
    document.getElementById("input").appendChild(newDiv);
    button.remove();
    tellServer(true);
}

function failed() {
    console.log("failed");
    var text = document.getElementById("guess");
    var button = document.getElementById("makeGuess");
    text.remove();
    button.remove();

    var newDiv = document.createElement("div");
    newDiv.innerHTML = "You Failed! Dare to play again?";
    document.getElementById("input").appendChild(newDiv);
    tellServer(false);
}

function inputUpdate(word) {
    guesses++;
    if (wrong.length == 0) {
        wrong = word;
    }
    else {
        wrong = wrong + ", " + word;
    }
    var updateWrong = "Incorrect Letters Guessed: " + wrong;
    var count = 8 - guesses;
    var updateNum = "Incorrect Guesses Left: " + count;
    document.getElementById("wrong").innerHTML = updateWrong;
    document.getElementById("guessNum").innerHTML = updateNum;

    var image = document.getElementById("hangPic");
    var imageName = "HangmanPics/" + guesses + ".jpg";
    image.src = imageName;
}

function checkWord() {
    console.log("answer: " + answer);
    var guess = document.getElementById("guess").value;
    let word = guess.toUpperCase();
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var inAnswer = false;
    document.getElementById("guess").value = "";
    if (word.length == answer.length) {
        var letterCount = 0;
        for (let i = 0; i < answer.length; i++) {
            if (!alphabet.includes(word.charAt(i))) {
                window.alert("Guess must contain letters only!");
                return false;
            }

            if (word.charAt(i) == answer.charAt(i)) {
                letterCount++;
            }
        }

        // Won
        if (letterCount == answer.length) {
            for (let  i = 0; i < answer.length; i++) {
                document.getElementById(boxes[i]).innerHTML = answer.charAt(i);
            }
            left = 0;
            won();
            return true;
        }

        inputUpdate(word); 
        if (guesses < 8) {
            return false;
        }

        // Failed
        if (guesses == 8) {
            failed();
            return false;
        }
    }
    if (word.length == 1) {
        if (!alphabet.includes(word)) {
            window.alert("Guess must contain letters only!");
            return false;
        }

        if (wrong.includes(word)) {
            window.alert("Already guessed!");
            return false;
        }

        for (let i = 0; i < answer.length; i++) {
            if (word == answer.charAt(i)) {
                document.getElementById(boxes[i]).innerHTML = word;
                left--;
                inAnswer = true;
            }
        }

        if (!inAnswer) {
            inputUpdate(word);
        }

        if (left == 0) {
            won();
            return true;
        }
        if (guesses == 8) {
            failed();
            return false;
        }
        else {
            return false;
        }
    }
    else {
        window.alert("Guess must be a letter and/or the right length!");
    }
}

function getWord() {
    var l = document.getElementById("level").innerHTML;
    var level = l.slice(11, l.length - 1);
    console.log("." + level);
    let info = {"level": level};
    console.log(info);
    let p = fetch('/get/word', {
        method: "POST",
        body: JSON.stringify(info),
        headers: {"Contect-Type": "application/json"}    
    });

    // Promises
    p.then((response) => {
        console.log(response);
        return response.text();
    }).then((text) => {
        text = JSON.parse(text);
        console.log(text);
        answer = text;
        left = answer.length;
    })
}

function howToPlay() {
    var one = document.createElement("div");
    var two = document.createElement("div");
    var three = document.createElement("div");
    var four = document.createElement("div");
    one.innerHTML = "Welcome to hangman! To play, enter your guess in the box.";
    two.innerHTML = "Your guess must be either a single letter or the length of the word."
    three.innerHTML = "You will have 8 incorrect guesses until you lose the game.";
    four.innerHTML = "To change difficulty, select from the menu your";
    document.getElementById("input").appendChild(newDiv);
}

function setBeginner() {
    window.location.href = "Beginner.html"
}

function setIntermediate() {
    window.location.href = "Intermediate.html"
}
function setAdvanced() {
    window.location.href = "Advanced.html";
}

function back() {
    window.location.href = "main.html";
}
