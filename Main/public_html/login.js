// test
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

window.onclick = function(event) {
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
