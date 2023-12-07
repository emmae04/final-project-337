/**
 * Authors: Arianna Velosa, Michelle Ramos-Hernandez, Emma Elliot, Noelle Stewart-Healey
 *
 * This file contains the client side js for hangman. It gets the random word,
 * it tracks the guesses that the user makes, and handles when the user either
 * wins or loses.
 */

const fiveL = [];
const words = [];
const boxes = ["one", "two", "three", "four", "five", "six", "seve", "eight", "nine",
    "ten", "eleven", "twelve"];
let guesses = 0;
let wrong = "";
let left = 5;
let user = "";

/**
 * This function randomly gets a word from a list using Math.random.
 * @returns a string - the word
 */
function getWord() {
    return fiveL[Math.floor(Math.random() * fiveL.length)];
}

/**
 * This function is a getter function which fetches the current user from
 * the server and sets that as the current user.
 */
function getUser() {
    let link = "/get/curUsers/";
    fetch(link).then((response) => {
        return response.text();
    }).then((text) => {
        user = text;
        return text;
    })
}

getUser();

/**
 * This function sends the information to the server when the user wins or
 * losses a game of hangman. Based on the provided parameter, the link that it
 * will use will either direct the client to something in the server that updates
 * a win or updates a loss.
 * @param {*} won - a string
 */
function tellServer(won) {
    var l = document.getElementById("level").innerHTML;
    let level = l.slice(11, l.length - 1);
    let info = {"level": level, "wins": won};
    let p = fetch(`/new/${won}/${user}`, {
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

/**
 * This function replaces elements of the hangman html page if the user has won.
 * It also calls tellServer to update the hangman schema for this user.
 */
function won() {
    console.log("won");
    var text = document.getElementById("guess");
    var button = document.getElementById("makeGuess");
    text.remove();

    var newDiv = document.createElement("div");
    newDiv.innerHTML = "You Won! Dare to play again?";
    document.getElementById("input").appendChild(newDiv);
    button.remove();
    tellServer("win");
}

/**
 * This function replaces the elements of the hangman page if the user lost. It
 * also calls tellServer to update the hangman schema for this user.
 */
function failed() {
    console.log("failed");
    var text = document.getElementById("guess");
    var button = document.getElementById("makeGuess");
    text.remove();
    button.remove();

    var newDiv = document.createElement("div");
    var playAgain = document.createElement("div");
    newDiv.innerHTML = "You Failed! The word was " + answer + ".";
    playAgain.innerHTML = "Dare to play again?";
    document.getElementById("input").appendChild(newDiv);
    document.getElementById("input").appendChild(playAgain);
    tellServer("loss");
}

/**
 * This function updates the incorrect guesses when the user makes a bad guess.
 * After updating the count and list, it puts the updates count on the hangman
 * html page. It also updates the hangman pic.
 * @param {*} word - a string (the guess)
 */
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

/**
 * This function gets the guess from the user and checks it. It is either a one
 * letter guess, or the length of the word they are trying to guess. Based on that,
 * it checks for if it is a valid guess, and then if it is correct. Based on that,
 * it makes different function calls. If it's valid, it returns true. Otherwise
 * it returns false.
 * @returns a boolean value
 */
function checkWord() {
    console.log("answer: " + answer);
    var guess = document.getElementById("guess").value;
    let word = guess.toUpperCase();
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var inAnswer = false;
    document.getElementById("guess").value = "";

    // Full length guess
    if (word.length == answer.length) {
        var letterCount = 0;
        // Check for valid guess
        for (let i = 0; i < answer.length; i++) {
            if (!alphabet.includes(word.charAt(i))) {
                window.alert("Guess must contain letters only!");
                return false;
            }

            if (word.charAt(i) == answer.charAt(i)) {
                letterCount++;
            }
        }

        // Check for no repeats
        if (words.includes(word)) {
            window.alert("Already guessed!");
            return false;
        }
        words.push(word);

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

    // Single letter guess
    if (word.length == 1) {
        // Check for validity
        if (!alphabet.includes(word)) {
            window.alert("Guess must contain letters only!");
            return false;
        }

        // Check for no repeats
        if (words.includes(word)) {
            window.alert("Already guessed!");
            return false;
        }
        words.push(word);

        // Find spot
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

/**
 * This function is a getter function that sends a get request to the server
 * for a word for a beginner level game. It sets answer to that word.
 */
function getWordB() {
    let p ='/get/word/beg';
    fetch(p).then((response) => {
        console.log(response);
        return response.text();
    }).then((text) => {
        text = JSON.parse(text);
        console.log(text);
        answer = text;
        left = answer.length;
    })
}

/**
 * This function is a getter function that sends a get request to the server
 * for a word for an intermediate level game. It sets answer to that word.
 */
function getWordI() {
    let p ='/get/word/in';
    fetch(p).then((response) => {
        console.log(response);
        return response.text();
    }).then((text) => {
        text = JSON.parse(text);
        console.log(text);
        answer = text;
        left = answer.length;
    })
}

/**
 * This function is a getter function that sends a get request to the server
 * for a word for an advanced level game. It sets answer to that word.
 */
function getWordA() {
    let p ='/get/word/ad';
    fetch(p).then((response) => {
        console.log(response);
        return response.text();
    }).then((text) => {
        text = JSON.parse(text);
        console.log(text);
        answer = text;
        left = answer.length;
    })
}

/**
 * This function sets the page to the beginner html.
 */
function setBeginner() {
    window.location.href = "Beginner.html"
}

/**
 * This function sets the page to the intermediate html.
 */
function setIntermediate() {
    window.location.href = "Intermediate.html"
}

/**
 * This function sets the page to the advanced html.
 */
function setAdvanced() {
    window.location.href = "Advanced.html";
}

/**
 * This function sets the page to the main html.
 */
function back() {
    window.location.href = "http://localhost/app/main.html";
}
