const fiveL = [];
const boxes = ["one", "two", "three", "four", "five"];
const guesses = 0;
const wrong = "";
const left = 5;
// const fs = require('fs');
// const readline = require('readline'); guyouv

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

const answer = getWord();

function checkWord() {
    console.log(answer);
    var word = document.getElementById("guess");
    word = word.toLowerCase;
    var alphabet = "abcdefghijklmnopqrstuvwxyz"
    if (word.length == 5) {
        for (let i = 0; i < 5; i++) {
            if (!alphabet.includes(word.charAt(i))) {
                window.alert("Guess must contain letters only!");
                return false;
            }

            if (word.charAt(i) == answer.charAt(i)) {
                document.getElementById(boxes[i]).innerHTML = answer.charAt(i);
                left--;
            }
            else {
                guesses++;
                wrong = wrong + ", " + word.charAt(i);
                document.getElementById("wrong").innerHtml = "Incorrect Letters Guessed: " + guesses;
                document.getElementById("guessNum").innerHtml = "Incorrect Guesses Left: " + wrong;
            }
        }

        if (left == 0) {
            console.log("won");
            var text = document.getElementById("guess");
            var button = document.getElementById("makeGuess");
            text.remove();

            var newDiv = document.createElementById("div");
            newDiv.innerHtml = "You Won!";
            document.getElementById("input").appendChild(newDiv);
            button.remove();
            return true;
        }
        if (guesses == 8) {
            console.log("failed");
            var text = document.getElementById("guess");
            var button = document.getElementById("makeGuess");
            text.remove();
            button.remove();

            var newDiv = document.createElementById("div");
            newDiv.innerHtml = "You Failed!";
            document.getElementById("input").appendChild(newDiv);
            return false;
        }
    }
    if (word.length == 1) {
        for (let i = 0; i < 5; i++) {
            if (!alphabet.includes(word)) {
                window.alert("Guess must contain letters only!");
                return false;
            }

            if (word == answer.charAt(i)) {
                document.getElementById(boxes[i]).innerHTML = word;
                left--;
            }
            else {
                guesses++;
                wrong = wrong + ", " + word;
                document.getElementById("wrong").innerHtml = "Incorrect Letters Guessed: " + guesses;
                document.getElementById("guessNum").innerHtml = "Incorrect Guesses Left: " + wrong;
            }
        }

        if (left == 0) {
            console.log("won");
            var text = document.getElementById("guess");
            var button = document.getElementById("makeGuess");
            text.remove();
            button.remove();

            var newDiv = document.createElementById("div");
            newDiv.innerHtml = "You Won!";
            document.getElementById("input").appendChild(newDiv);
            return true;
        }
        if (guesses == 8) {
            console.log("failed");
            var text = document.getElementById("guess");
            var button = document.getElementById("makeGuess");
            text.remove();
            button.remove();

            var newDiv = document.createElementById("div");
            newDiv.innerHtml = "You Failed!";
            document.getElementById("input").appendChild(newDiv);
            return false;
        }
    }
    else {
        window.alert("Guess must be a single letter or 5 letters long!");
    }
}