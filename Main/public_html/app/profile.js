var currUser = ""
function getCurrUser() {
    fetch("/get/curUsers/")
    .then(res => {
        return res.text();
    }).then(text =>{
        currUser = text;
        usernameBox = document.getElementById("username");
        usernameBox.innerText += currUser;
    })
    
}

const col2 = document.getElementById("column2");

function showFollowers() {
    col2.innerHTML = "";
    console.log(currUser);
    fetch("/get/followers/")
    .then((res) => {
        console.log(res)
        friendsData = res;
        friendsDiv = document.createElement('div');
        for (let i = 0; i < friendsData.length; i++) {
            friendName = friendsData[i].userName;
            friendScore = 0;
            for (let j = 0; j < friendsData[i].gameScore.length; j++) {
                friendsScore += friendsData[i].gameScore[j];
            }
            curr = document.createElement('div');
            curr.innerText = "Friend : " + friendName + ", Total score: " + friendsScore;
            friendsDiv.appendChild(curr);
        }
        col2.appendChild(friendsDiv);
    });
}

function showFollowing() {
    col2.innerHTML = "";
    fetch("/get/following/")
    .then((res) => {
        return res.text(); 
    })
    .then(text => {
            console.log(text);
        friendsDiv = document.createElement('div');
        for (let i = 0; i < text.length; i++) {
                following = text[i].userName;
                friendScore = 0;
                for (let j = 0; j < friendsData[i].gameScore.length; j++) {
                    friendsScore += friendsData[i].gameScore[j];
                }
                curr = document.createElement('div');
                curr.innerText = "Friend : " + friendName + ", Total score: " + friendsScore;
                friendsDiv.appendChild(curr);
            }
            col2.appendChild(friendsDiv);
        })

    };

function showStats() {
    getCurrUser();
    col2.innerHTML = "";
    fetch("/get/stats")
    .then(res => {
        console.log(res);
        statsData = res;
        statsDiv = document.createElement("div");
        gameCounter = 0;
        for (let i = 0; i < statsData.length; i++) {
            currScore = statsData[i];
            curr = document.createElement('div');
            if (gameCounter == 0) {
                curr.innerText += "Blackjack : " + currScore;
            }
            else if (gameCounter == 1) {
                curr.innerText += "Boggle : " + currScore;
            }
            else if (gameCounter == 2) {
                curr.innerText += "Hangman : " + currScore;
            }
            else {
                curr.innerText += "Tic Tac Toe : " + currScore;
            }
            gameCounter += 1;
            col2.appendChild(curr);
        }
        }
        );}

