/**Authors: Arianna Velosa, Michelle Ramos-Hernandez, Emma Elliot, Noelle Healey-Stewart
this code handles the changing button visibility when another leaderboard is pressed,
 and calling the server to get the leaderboards
*/


/**
 * if user wants to see boggle leaderboard , hide other leaderboard buttons
 * and display boggle buttons
 */
function getBoggle(){
    document.getElementById("boggleButtons").style.visibility = "visible";
    document.getElementById("boggleButtons").style.display = "block";

    document.getElementById("tttButtons").style.visibility = "hidden";
    document.getElementById("bjButtons").style.visibility = "hidden";
    document.getElementById("hangmanButtons").style.visibility = "hidden";

    document.getElementById("bjButtons").style.display = "none";
    document.getElementById("tttButtons").style.display = "none";
    document.getElementById("hangmanButtons").style.display = "none";
}

/**
 * if user wants to see tic tac toe leaderboard , hide other leaderboard buttons
 * and display tic tac toe buttons
 */
function getTTT(){
    document.getElementById("tttButtons").style.display = "block";
    document.getElementById("tttButtons").style.visibility = "visible";
    document.getElementById("boggleButtons").style.visibility = "hidden";
    document.getElementById("bjButtons").style.visibility = "hidden";
    document.getElementById("hangmanButtons").style.visibility = "hidden";

    document.getElementById("boggleButtons").style.display = "none";
    document.getElementById("bjButtons").style.display = "none";
    document.getElementById("hangmanButtons").style.display = "none";
}

/**
 * if user wants to see hangman leaderboard , hide other leaderboard buttons
 * and display hangman buttons
 */
function getHangman(){
    document.getElementById("tttButtons").style.visibility = "hidden";
    document.getElementById("boggleButtons").style.visibility = "hidden";
    document.getElementById("bjButtons").style.visibility = "hidden";

    document.getElementById("tttButtons").style.display = "none";
    document.getElementById("boggleButtons").style.display = "none";
    document.getElementById("bjButtons").style.display = "none";
    document.getElementById("hangmanButtons").style.visibility = "visible";
    document.getElementById("hangmanButtons").style.display = "block";
}

/**
 * if user wants to see blackjack leaderboard , hide other leaderboard buttons
 * and display blackjack buttons
 */
function getBJ(){
    document.getElementById("bjButtons").style.visibility = "visible";
    document.getElementById("bjButtons").style.display = "block";

    document.getElementById("hangmanButtons").style.visibility = "hidden";
    document.getElementById("tttButtons").style.visibility = "hidden";
    document.getElementById("boggleButtons").style.visibility = "hidden";

    document.getElementById("hangmanButtons").style.display = "none";
    document.getElementById("tttButtons").style.display = "none";
    document.getElementById("boggleButtons").style.display = "none";
}

/**
 * method to get the leaderboard of the highest scores of the
 * boggle game
 */
function boggleHighest(){
    // '/boggle/highestScores/'
    fetch( '/boggle/highestScores/', {// fetching the high scores
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;// display scores

        // change label
        document.getElementById("resultLabel").innerText = "Boggle Highest Score Leaderboard"
    }).catch((err) => { console.log(err) });

}
function changeHTML() {
    window.location.href = "http://localHost/app/main.html"
}


/**
 * method to get the "Boggle Most Games Played Leaderboard"
 */
function boggleNum(){

    fetch( '/boggle/numPlays/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Boggle Most Games Played Leaderboard"
    }).catch((err) => { console.log(err) });

}

/**
 * method to get the "Tic Tac Toe Highest Score Leaderboard"
 */
function TTTHighest(){
    fetch( '/TTT/highestScores/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Tic Tac Toe Highest Score Leaderboard"
    }).catch((err) => { console.log(err) });
}

/**
 * method to get the "Tic Tac Toe Most Games Played Leaderboard"
 */
function TTTNum(){
    fetch( '/TTT/numPlays/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Tic Tac Toe Most Games Played Leaderboard"
    }).catch((err) => { console.log(err) });
}

/**
 * method to get the "Tic Tac Toe Current Win Streaks Leaderboard"
 */
function TTTWs(){
    fetch( '/TTT/winstreak/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Tic Tac Toe Current Win Streaks Leaderboard"
    }).catch((err) => { console.log(err) });
}

/**
 * method to get the "Tic Tac Toe Current Scores Leaderboard"
 */
function TTTScore(){
    fetch( '/TTT/scoreLeader/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Tic Tac Toe Current Scores Leaderboard"
    }).catch((err) => { console.log(err) });
}

/**
 * method to get the "Hangman Current Win Streaks Leaderboard"
 */
function HangmanCurrent(){
    fetch( '/Hangman/winstreak/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Hangman Current Win Streaks Leaderboard"
    }).catch((err) => { console.log(err) });
}

/**
 * method to get the "Hangman Most Games Played Leaderboard"
 */
function HangmanPlays(){
    fetch( '/Hangman/plays/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Hangman Most Games Played Leaderboard"
    }).catch((err) => { console.log(err) });
}

/**
 * method to get the "Hangman Most Games Won Leaderboard"
 */
function HangmanWins()
{
    fetch( '/Hangman/wins/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Hangman Most Games Won Leaderboard"
    }).catch((err) => { console.log(err) });
}

/**
 * method to get the  "BlackJack Highest Score Leaderboard"
 */
function bjHighest()
{
    fetch( '/bj/highest/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "BlackJack Highest Score Leaderboard"
    }).catch((err) => { console.log(err) });
}

/**
 * method to get the  "BlackJack Most Games Played Leaderboard"
 */
function bjNum()
{
    fetch( '/bj/plays/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "BlackJack Most Games Played Leaderboard"
    }).catch((err) => { console.log(err) });
}

/**
 * method to get the  "BlackJack Current Win Streaks Leaderboard"
 */
function bjWins()
{
    fetch( '/bj/ws/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "BlackJack Current Win Streaks Leaderboard"
    }).catch((err) => { console.log(err) });
}

