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
  fetch(`/update/${id}`, {
    method: "POST",
    body: JSON.stringify({ftnff}), 
    headers: {"Content-Type" : "application/json"}
  }).then((res) => {
    console.log("after fetch is done I am here");
    // document.getElementById(`${id}`).value = "FOLLOWED";
    // tempDiv = tempDiv + `<button class="buttons" id =${id}> FOLLOWED </button></div>`;
    if(ftnff){
      document.getElementById(`${id}`).innerText = "UNFOLLOW";
    }else{
      document.getElementById(`${id}`).innerText = "FOLLOW";
    }
    //return res.text();
  }).catch((err) => { console.log(err) });
}

function updateButtons() {
  var buts = document.getElementsByClassName("buttons");
  for (let i = 0; i < buts.length; i++) {
    buts[i].onclick = (e) => { console.log(this , e.target.innerText.startsWith("F")); follow(e.target.id, e.target.innerText.startsWith("F")) };
  }
}


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
          let name = parsed[i].user;
          let id = parsed[i].id;
          let stat = parsed[i].stat;
          // console.log(parsed.length);
          // console.log("name: " + name);
          // updates the html to add the items on the sceen
          var tempDiv = `<div id="item"> <div>${name}</div>`;
          if (stat.startsWith("FOLLOWER")) {
            tempDiv = tempDiv + `<div>${stat} </div></div>`
          } else if(stat.startsWith("FOLLOWING")){
            tempDiv = tempDiv + `<button class="buttons" id =${id}> UNFOLLOW </button></div>`;
          }else{
            tempDiv = tempDiv + `<button class="buttons" id =${id}> FOLLOW </button></div>`;
          }
          tempDiv = tempDiv + `<button> SEE STATS </button></div>`;
          document.getElementById("searchResult").innerHTML += tempDiv;
        }
        updateButtons();
      })
      .catch((err) => { console.log(err) });
  }
}
