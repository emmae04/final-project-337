// test
// test 2

const username = document.cookie.username;
function changeHTML() {
  window.location.href = "main.html";
}
function goToTTT() {
  window.location.href = "http://localHost/app/TTT/ttt.html";
}
function goToHangman() {
  window.location.href = "http://localHost/app/HM/Hangman/Beginner.html";
}

function goToBJ() {
  window.location.href = "http://localHost/app/BJ/blackjack.html";

}
function goToBoggle() {
  window.location.href = "http://localHost/app/BOG/index.html";

}
function showDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("myDropdown");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// adds users
function addUser() {
  let username = document.getElementById('usernameC').value;
  let password = document.getElementById('pwC').value;
  var usersInfo = {
    username: username,
    password: password,
  };
  // gets the user post
  fetch("/add/user/", {
    method: "POST",
    body: JSON.stringify(usersInfo),
    headers: { 'Content-Type': 'application/json' }
  }).then((res) => {
    return res.text();
  }).then((text) => {
    if (text == "SUCCESS") {
      alert("user made");
    } else {
      alert("user already exists");
    }
  }).catch((err) => { console.log(err) });
  document.getElementById('usernameC').value = "";
  document.getElementById('pwC').value = "";
}


function login() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('pw').value;
  var userInfo = {
    username: username,
    password: password
  }
  // sends the username and password the user inputed
  fetch("/login/user/pass", {
    method: "POST",
    body: JSON.stringify(userInfo),
    headers: { 'Content-Type': 'application/json' }
  }).then((yo) => {
    return yo.text();
  }).then((text) => {
    // checsk if the user exsit
    if (text == "SUCCESS") {
      window.location.href = "http://localHost/app/main.html";

    }
    else {
      document.getElementById("warningLabel").innerText = ("ISSUE LOGGING IN WITH THAT INFO");
    }
  }).catch((err) => {
    alert("user doenst exist");
    window.location.href = "http://localHost/index.html";
    console.log(err)
  });
  document.getElementById('username').value = "";
  document.getElementById('pw').value = "";
}


function showDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("myDropdown");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


function follow(id, ftnff) {
  // console.log('HERE');
  // console.log(id);
  // sends the user and the id
  console.log("WHOS ID IS THIS_______________________________________");
  console.log(id);
  // the person I want to follow or unfollow
  fetch(`/update/${id}`, {
    method: "POST",
    body: JSON.stringify({ ftnff }),
    headers: { "Content-Type": "application/json" }
  }).then((res) => {
    console.log("after fetch is done I am here");
    // document.getElementById(`${id}`).value = "FOLLOWED";
    // tempDiv = tempDiv + `<button class="buttons" id =${id}> FOLLOWED </button></div>`;
    // if follow true, not follow false
    if (ftnff) {
      document.getElementById(`${id}`).innerText = "UNFOLLOW";
    } else {
      document.getElementById(`${id}`).innerText = "FOLLOW";
    }
    //return res.text();
  }).catch((err) => { console.log(err) });
}





function updateButtons() {
  var buts = document.getElementsByClassName("buttons");
  for (let i = 0; i < buts.length; i++) {
    buts[i].onclick = (e) => { console.log(this, e.target.innerText.startsWith("F")); follow(e.target.id, e.target.innerText.startsWith("F")) };
  }
}

var curUser;

fetch('/get/curUsers/')
  .then((res) => {
    res.text()
      .then((res2) => {
        curUser = res2;
      })
  });


function searchFriends() {
  let input = document.getElementById('searchFriend').value;
  document.getElementById('searchFriend').value = "";

  if (input != "") {
    fetch(`/search/users/${input}`)
      .then((res) => {
        return res.text();
      }).then((res) => {
        let parsed = JSON.parse(res);
        // console.log(parsed);
        document.getElementById("searchResult").innerHTML = "";
        // gets all attibutes of the item
        for (let i = 0; i < parsed.length; i++) {
          // console.log(parsed[i]);
          if (parsed[i].user != curUser) {
            let name = parsed[i].user;
            let id = parsed[i].id;
            let stat = parsed[i].stat;
            console.log("STATS__________________________________________________")
            console.log(stat);
            // updates the html to add the items on the sceen
            var tempDiv = `<div id="item"> <div>${name}</div>`;
            if (stat.startsWith("FOLLOWER")) {
              // tempDiv = tempDiv + `<div>${stat} </div>`;
              tempDiv = tempDiv + `<button onclick="updateButtons();" class="buttons" id =${id}> FOLLOW </button>`;
            } else if (stat.startsWith("FOLLOWING")) {
              // tempDiv = tempDiv + `<div>${stat} </div>`;
              tempDiv = tempDiv + `<button onclick="updateButtons();" class="buttons" id =${id}> UNFOLLOW </button>`;
            } else if(stat.startsWith("FRIENDS")){
              // tempDiv = tempDiv + `<div>${stat} </div>`;
              tempDiv = tempDiv + `<button  onclick="updateButtons();" class="buttons" id =${id}> UNFOLLOW </button>`;
            }else{
              // tempDiv = tempDiv + `<div>${stat} </div>`;
              tempDiv = tempDiv + `<button  onclick="updateButtons();" class="buttons" id =${id}> FOLLOW </button>`;
            }
            tempDiv = tempDiv + `<div> <button class="statsButton" onclick="changeToStat('${parsed[i].user}');"> SEE STATS </button></div> </div>`;
            document.getElementById("searchResult").innerHTML += tempDiv;
          }
        }
        updateButtons();
      })
      .catch((err) => { console.log(err) });
  }
}

function changeToStat(user) {
  window.location.href = `http://localHost/app/stats.html?key=${user}`;
}

function updateStatView() {
  document.getElementById('allInfo').value = "";
  let quory = new URLSearchParams(window.location.search);
  fetch(`/get/userSTATS/${quory.get('key')}`)
    .then((res) => {
      return res.text();
    }).then((res2) => {
      var p = JSON.parse(res2);
      console.log("parsed --------------------------------------------------");
      console.log(p);
      var tempDiv = "";
      for (let i = 0; i < p.length; i++) {
        let usern = p[i].username;
        let high = p[i].highScore;
        let streak = p[i].currentWinStreak;
        let gamePlays = p[i].gamesPlayed;
        tempDiv = tempDiv + `<div id="currUserStat">`;
        if (i == 0) {
          tempDiv = tempDiv + `<div> ${usern} </div>`;
        }
        if (i == 0) {
          tempDiv = tempDiv + `<div> HangMan </div>`;
        } else if (i == 1) {
          tempDiv = tempDiv + `<div> Boggle </div>`;
        } else if (i == 2) {
          tempDiv = tempDiv + `<div> BlackJack </div>`;
        } else if (i == 3) {
          tempDiv = tempDiv + `<div> Tic Tac Toe </div>`;
        }
        tempDiv = tempDiv + `<div> High Score: ${high} </div> <div> Current Win Streak: ${streak} </div> <div> Games Played: ${gamePlays} </div>`;
      }
      tempDiv = tempDiv + "</div>";
      document.getElementById("allInfo").innerHTML += tempDiv;

    })
    .catch((err) => { console.log(err) });
}