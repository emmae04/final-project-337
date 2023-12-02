// Initializes the required pieces
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs')

const parser = require('body-parser')
const cookieParser = require('cookie-parser');

const port = 80

// Builds up the database
const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/final';
mongoose.connect(mongoDBURL);
db.on('error', () => { console.log('MongoDB connection error:') });

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

const app = express();
app.use(cookieParser());    
app.use(express.json())

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

app.use(express.static('public_html'))

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

//////////////////////////// BOGGLE ///////////////////////////////////////

var Schema = mongoose.Schema;
var boggleInfo = new Schema({
    user: { type: String, default: '', trim: true },
    score: { type: Number, default: 0, min: 0 },
});

var boggleData = mongoose.model('boggleData', boggleInfo);


var allBoggleWords = [];


app.post('/diceTray/', function (req, res) { 
    var correctBoggleWords = [];   
    var diceTray = new Array(4);
    diceTray = req.body;
    let p = readAllWords();
    points = 0;
    p.then((response) => {
        let p2 = findAllCorrectWords(correctBoggleWords, diceTray);
        p2.then(() => {
            res.send(correctBoggleWords);
        });
    });
});


app.post('/score/', function(req, res){
    score = req.body;
    res.setHeader('Access-Control-Allow-Origin', '*');


    let boggleSearch = boggleData.find({ "user": { $regex: req.params.keyword } });
    // finding the item with the given keyword in the description
    boggleSearch.then((documents) => {// when get the documents
        res.status(200);
        res.type('json').send(JSON.stringify(documents, null, 2) + '\n');
    });

});


async function readAllWords() {
    data = await fs.readFile('./words.txt', 'utf8') 
        allBoggleWords = data.split("\n");
        for (var i = 0; i < allBoggleWords.length; i++) {
            allBoggleWords[i] = allBoggleWords[i].trim();
        }
    
}

async function findAllCorrectWords(correctBoggleWords, diceTray) {
    for (let i = 0; i < allBoggleWords.length; i++) {
        let s = allBoggleWords[i];
        let result = found(s, diceTray);
        if (result == true) {
            correctBoggleWords.push(s);
        }
    }
}

function found(attempt, diceTray) {
    if (attempt.length < 3) {
        return false;
    }
    attempt = attempt.toUpperCase();

    // Going through all letters in diceTray to find a matching first letter
    for (let i = 0; i < diceTray.length; i++) {
        for (let j = 0; j < diceTray.length; j++) {
            var visited = new Array(4).fill(0).map(() => new Array(4).fill(0));
            if (attempt.charAt(0) == diceTray[i][j]) {
                visited[i][j] = 2;
                let key = testFound(attempt.substring(1), i, j, visited, diceTray);
                if (key == true) {
                    return true;
                }
            }
        }
    }
    return false;
}

function testFound(attempt, row, col, visited, diceTray) {
    let right, rightDown, down, leftDown, left, leftUp, up, rightUp;
    right = rightDown = down = leftDown = left = leftUp = up = rightUp = false;

    // base case
    if (attempt.length == 0) {
        return true;
    }

    // Recursive call, checks for valid locations to check if the word exists in the diceTray

    // check right
    if (isValid(row, col + 1) == true && visited[row][col + 1] !== 2) {
        if (diceTray[row][col + 1] == attempt.charAt(0)) {
            visited[row][col + 1] = 2;
            right = testFound(attempt.substring(1), row, col + 1, visited, diceTray);
            if (!right) {
                visited[row][col + 1] = 0;
            }
        }
    }

    // check rightDown diagonal
    if (isValid(row + 1, col + 1) == true && visited[row + 1][col + 1] !== 2) {
        if (diceTray[row + 1][col + 1] == attempt.charAt(0)) {
            visited[row + 1][col + 1] = 2;
            rightDown = testFound(attempt.substring(1), row + 1, col + 1, visited, diceTray);
            if (!rightDown) {
                visited[row + 1][col + 1] = 0;
            }
        }
    }

    // check down
    if (isValid(row + 1, col) == true && visited[row + 1][col] !== 2) {
        if (diceTray[row + 1][col] == attempt.charAt(0)) {
            visited[row + 1][col] = 2;
            down = testFound(attempt.substring(1), row + 1, col, visited, diceTray);
            if (!down) {
                visited[row + 1][col] = 0;
            }
        }
    }

    // check leftDown diagonal
    if (isValid(row + 1, col - 1) == true && visited[row + 1][col - 1] !== 2) {
        if (diceTray[row + 1][col - 1] == attempt.charAt(0)) {
            visited[row + 1][col - 1] = 2;
            leftDown = testFound(attempt.substring(1), row + 1, col - 1, visited, diceTray);
            if (!leftDown) {
                visited[row + 1][col - 1] = 0;
            }
        }
    }

    // check left
    if (isValid(row, col - 1) == true && visited[row][col - 1] !== 2) {
        if (diceTray[row][col - 1] == attempt.charAt(0)) {
            visited[row][col - 1] = 2;
            left = testFound(attempt.substring(1), row, col - 1, visited, diceTray);
            if (!left) {
                visited[row][col - 1] = 0;
            }
        }
    }

    // check leftUp diagonal
    if (isValid(row - 1, col - 1) == true && visited[row - 1][col - 1] !== 2) {
        if (diceTray[row - 1][col - 1] == attempt.charAt(0)) {
            visited[row - 1][col - 1] = 2;
            leftUp = testFound(attempt.substring(1), row - 1, col - 1, visited, diceTray);
            if (!leftUp) {
                visited[row - 1][col - 1] = 0;
            }
        }
    }

    // check up
    if (isValid(row - 1, col) == true && visited[row - 1][col] !== 2) {
        if (diceTray[row - 1][col] == attempt.charAt(0)) {
            visited[row - 1][col] = 2;
            up = testFound(attempt.substring(1), row - 1, col, visited, diceTray);
            if (!up) {
                visited[row - 1][col] = 0;
            }
        }
    }

    // check rightUp diagonal
    if (isValid(row - 1, col + 1) == true && visited[row - 1][col + 1] !== 2) {
        if (diceTray[row - 1][col + 1] == attempt.charAt(0)) {
            visited[row - 1][col + 1] = 2;
            rightUp = testFound(attempt.substring(1), row - 1, col + 1, visited, diceTray);
            if (!rightUp) {
                visited[row - 1][col + 1] = 0;
            }
        }
    }

    return right || rightDown || down || leftDown || left || leftUp || up || rightUp;
}

function isValid(row, col) {
    return row >= 0 && col >= 0 && row < 4 && col < 4;
}


//////////////////////////// BOGGLE END ////////////////////////////////////////////////




// ---------------------------- TTT Server ----------------------------





// ---------------------------- Blackjack Server ----------------------------
app.listen(port, () =>
console.log(`App listening at http://localhost:${port}`))
