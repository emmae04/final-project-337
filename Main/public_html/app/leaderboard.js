
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
function boggleHighest(){
    // '/boggle/highestScores/'
    fetch( '/boggle/highestScores/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Boggle Highest Score Leaderboard"
    }).catch((err) => { console.log(err) });

}
function changeHTML() {
    window.location.href = "http://localHost/app/main.html"
}
function boggleNum(){
    // '/boggle/highestScores/'
    fetch( '/boggle/numPlays/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Boggle Most Games Played Leaderboard"
    }).catch((err) => { console.log(err) });

}
function TTTHighest(){
    fetch( '/TTT/highestScores/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Tic Tac Toe Highest Score Leaderboard"
    }).catch((err) => { console.log(err) });
}
function TTTNum(){
    fetch( '/TTT/numPlays/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Tic Tac Toe Most Games Played Leaderboard"
    }).catch((err) => { console.log(err) });
}

function TTTWs(){
    fetch( '/TTT/winstreak/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Tic Tac Toe Current Win Streaks Leaderboard"
    }).catch((err) => { console.log(err) });
}

function TTTScore(){
    fetch( '/TTT/scoreLeader/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Tic Tac Toe Current Scores Leaderboard"
    }).catch((err) => { console.log(err) });
}

function HangmanCurrent(){
    fetch( '/Hangman/winstreak/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Hangman Current Win Streaks Leaderboard"
    }).catch((err) => { console.log(err) });
}


function HangmanPlays(){
    fetch( '/Hangman/plays/', {
    }).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("result").innerText = text;
        document.getElementById("resultLabel").innerText = "Hangman Most Games Played Leaderboard"
    }).catch((err) => { console.log(err) });
}


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

