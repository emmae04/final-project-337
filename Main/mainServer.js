// Initializes the required pieces
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs')
const app = express()
const parser = require('body-parser')
const cookieParser = require('cookie-parser');

const port = 80

// Builds up the database
const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/final';
mongoose.connect(mongoDBURL);
db.on('error', () => { console.log('MongoDB connection error:') });


app.use(parser.json());
app.use(cookieParser());
app.use(express.json());

// ------------------------------ Schemas ----------------------------------
var Schema = mongoose.Schema;

// The schema for users
var UserSchema = new Schema({
    username: String,
    password: String,
    friends: [],
    gameScore: []
})

// The schema for hangman
var HangmanSchema = new Schema({
    user: String,
    word: String,
    guesses: Number,
    wins: boolean
})

var people = mongoose.model("User", UserSchema);
var hangman = mongoose.model("Hangman", HangmanSchema);


app.use(express.static('public_html'))// setting html

let sessions = {};

/**
 * method to add sessions with a random session number. the time is 
 * set to now to compare the time the session has been active

 */
function addSession(username) {
    let sid = Math.floor(Math.random() * 1000000000);
    let now = Date.now();
    sessions[username] = { id: sid, time: now };
    return sid;
}
/**
 * method to remove cookies that went out of the 5 minutes session time
 */
function removeSessions() {
    let now = Date.now();
    let usernames = Object.keys(sessions);
    for (let i = 0; i < usernames.length; i++) {
        let last = sessions[usernames[i]].time;
        //if (last + 120000 < now) {
        if (last + 300000 < now) {
            delete sessions[usernames[i]];
        }
    }
    console.log(sessions);
}

setInterval(removeSessions, 2000);// constantly check to remove items


function authenticate(req, res, next) {
    let c = req.cookies;
    console.log('auth request:');
    console.log(req.cookies);
    if (c != undefined) {
        if (sessions[c.login.username] != undefined &&
            sessions[c.login.username].id == c.login.sessionID) {// if the session and cookie match
            next();
        } else {
            res.redirect('http://localhost/index.html');
        }
    } else {
        res.redirect('http://localhost/index.html');
    }
}

app.use('/app/*', authenticate);// authenticate the app folder
app.get('/app/*', (req, res, next) => {
    console.log('another');
    next();
});



/**
 * method handles use logins if the username and password are correct then it sends
 * a success back to the user and creates a cookie
 */
app.post('/login/user/pass', (req, res) => {
    console.log(sessions);
    console.log("tried to login");
    let u = req.body;
    let p1 = people.find({ username: u.username, password: u.password }).exec();
    p1.then((results) => {
        if (results.length == 0) {

            res.send("FAIL");
            res.end();
        } else {
            let sid = addSession(u.username);
            res.cookie("login",
                { username: u.username, sessionID: sid },
                { maxAge: 60000 * 2 });
            res.status(200);
            res.send("SUCCESS");
        }
    });
});

/**
 * post request handles creating a new User. the 
 * elements of the JSON User are in the body of the request
 */
app.post("/add/user/", function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let saveUser = new people({ username: req.body.username, password: req.body.password, games: []})
    // creating a new user
    let userSearch = people.find({});
    // finding the user with the given keyword in the username

    userSearch.then((documents) => {// when get the documents
        if (documents.length != 0) {
            for (let i = 0; i < documents.length; i++) {
                if (documents[i].username == req.body.username) {
                    res.end("FAIL")
                }
            }
        }
    });
    saveUser.save();// saving the new user
    res.status(200);
    console.log("i posted");
    res.end("SUCCESS");// returning that the code has posted
});

// ---------------------------- Hangman Server ----------------------------




// ---------------------------- Boggle Server ----------------------------




// ---------------------------- TTT Server ----------------------------





// ---------------------------- Blackjack Server ----------------------------
app.listen(port, () =>
console.log(`App listening at http://localhost:${port}`))
