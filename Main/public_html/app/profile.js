var currUser = ""
function getCurrUser() {
    fetch("/get/curUsers/")
        .then(res => {
            return res.text();
        }).then(text => {
            currUser = text;
            usernameBox = document.getElementById("username");
            usernameBox.innerText += " " + currUser;
        })

}


function logOut() {
    fetch("/logout/user/", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            return res.text();
        }).then(text => {
            if (text == "SUCCESS") {
                window.location.href = "http://localHost/index.html";
            }

        })
}
const col2 = document.getElementById("column2");

function showFollowers() {
    col2.innerHTML = "";
    fetch("/get/followers/")
        .then((res) => {
            return res.text();
        })
        .then(followers => {
            data = JSON.parse(followers);
            topText = document.createElement("div")
            topText.innerText = 'You have ' + data.length + " followers"
            col2.appendChild(topText);
            for (let i = 0; i < data.length; i++) {
                curr = document.createElement('div');
                p = document.createElement('p');
                p.innerText = "Username: " + data[i]
                curr.appendChild(p)
                curr.style.height = "10vh";
                curr.style.border = "1px solid black"
                p.style.marginLeft = "25px"

                col2.appendChild(curr);
            }
        })

};

function showFollowing() {
    col2.innerHTML = "";
    fetch("/get/following/")
        .then((res) => {
            return res.text();
        })
        .then(following => {
            data = JSON.parse(following);
            topText = document.createElement("div")
            topText.innerText = 'You are following ' + data.length + " users"
            col2.appendChild(topText);
            for (let i = 0; i < data.length; i++) {
                curr = document.createElement('div');
                p = document.createElement('p');
                p.innerText = "Username: " + data[i]
                curr.appendChild(p)
                curr.style.height = "10vh";
                curr.style.border = "1px solid black"
                p.style.marginLeft = "25px"

                col2.appendChild(curr);
            }
        })

};

function showStats() {
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
        );
}

