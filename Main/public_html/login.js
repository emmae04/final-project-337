/**Authors: Arianna Velosa, Michelle Ramos-Hernandez, Emma Elliot,Noelle Healey-Stewart
this code handles the logging in for the user, the stat page updates, the dropdown
menu, the friend search, and the redirecting to the individual games once those
are pressed
*/

const username = document.cookie.username;
/**
 * method changes the url to the main.html page
 */
function changeHTML() {
  window.location.href = "main.html";
}
/**
 * method changes the url to the ttt.html page to play ttt
 */
function goToTTT() {
  window.location.href = "http://localHost/app/TTT/ttt.html";
}

/**
 * method changes the url to the /Beginner.html page to play hangman
 */
function goToHangman() {
  window.location.href = "http://localHost/app/HM/Hangman/Beginner.html";
}


/**
 * method changes the url to the blackjack.html page to play blackjack
 */
function goToBJ() {
  window.location.href = "http://localHost/app/BJ/blackjack.html";

}

/**
 * method changes the url to the boggle index.html page to play boggle
 */
function goToBoggle() {
  window.location.href = "http://localHost/app/BOG/index.html";

}
/** method shows the dropdown */
function showDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

/**
 * method shows the items in the dropdown
 * @param {} event 
 */
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

/**
 * method adds a user if they press the create user button
 */
function addUser() {
  let username = document.getElementById('usernameC').value;
  let password = document.getElementById('pwC').value;
  // getting the text field inputs
  var usersInfo = {// making a json to send the info
    username: username,
    password: password,
  };
  // gets the user post
  fetch("/add/user/", {//calling the fetch to add the user
    method: "POST",
    body: JSON.stringify(usersInfo),
    headers: { 'Content-Type': 'application/json' }
  }).then((res) => {// getting response text
    return res.text();
  }).then((text) => {
    if (text == "SUCCESS") {// if user successfully made
      alert("user made");
    } else {// user not made
      alert("user already exists");
    }
  }).catch((err) => { console.log(err) });

  // clearing the create user input fields
  document.getElementById('usernameC').value = "";
  document.getElementById('pwC').value = "";
}


/**
 * method attempts to log the user into the website by calling the server
 */
function login() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('pw').value;
  // getting the text field inputs
  var userInfo = {// making a json to send the info
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
    else {// if not successful loggin
      document.getElementById("warningLabel").innerText = ("ISSUE LOGGING IN WITH THAT INFO");
    }
  }).catch((err) => {// if gotton error
    alert("user doenst exist");
    window.location.href = "http://localHost/index.html";
    console.log(err)
  });
  document.getElementById('username').value = "";
  document.getElementById('pw').value = "";
  // resetting the input fields to blank
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
  // sends the user and the id
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
          tempDiv = tempDiv + `<div> <br>HangMan </div>`;
        } else if (i == 1) {
          tempDiv = tempDiv + `<div> <br>Boggle </div>`;
        } else if (i == 2) {
          tempDiv = tempDiv + `<div> <br>BlackJack </div>`;
        } else if (i == 3) {
          tempDiv = tempDiv + `<div> <br>Tic Tac Toe </div>`;
        }
        tempDiv = tempDiv + `<div> High Score: ${high} </div> <div> Current Win Streak: ${streak} </div> <div> Games Played: ${gamePlays} </div>`;
      }
      tempDiv = tempDiv + "</div>";
      document.getElementById("allInfo").innerHTML += tempDiv;

    })
    .catch((err) => { console.log(err) });
}
