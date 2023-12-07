
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