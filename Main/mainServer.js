/**
 * This file contains the main server that we all use for our game webpage.
 * It handles cookies, making schemas, and the various requests we make for
 * our individual games.
 */

// Initializes the required pieces
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs')
const fs2 = require('fs').promises

const readline = require("readline")
const parser = require('body-parser')

const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const { stringify } = require('querystring');
const port = 80

// Builds up the database
const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/final';
mongoose.connect(mongoDBURL);
db.on('error', () => { console.log('MongoDB connection error:') });

// ------------------------------ Schemas ----------------------------------
var Schema = mongoose.Schema;
// made an update here
// The schema for users
var UserSchema = new Schema({
    username: String,
    hash: String,
    salt: String,
    image: String,
    followers: [{ type: Schema.Types.ObjectId }],
    following: [{ type: Schema.Types.ObjectId }]
})

// The schema for hangman
var Schema = mongoose.Schema;
var HangmanSchema = new Schema({
    user: String,
    gamesPlayed: Number,
    wins: Number,
    currWinStreak: Number
})

var people = mongoose.model("User", UserSchema);
var hangman = mongoose.model("Hangman", HangmanSchema);


///// boggle
var Schema = mongoose.Schema;
var boggleInfo = new Schema({
    user: { type: String, default: '', trim: true },
    highScore: { type: Number, default: 0, min: 0 },
    numberOfPlays: { type: Number, default: 0, min: 0 },
    currentWinStreak: { type: Number, default: 0, min: 0 }
});

var boggleData = mongoose.model('boggleData', boggleInfo);

var TTTSchema = new Schema({
    user: { type: String, default: '', trim: true },
    score: { type: Number, default: 0, min: 0 },
    numberPlays: { type: Number, default: 0, min: 0 },
    highestScore: { type: Number, default: 0, min: 0 },
    currentWinstreak: { type: Number, default: 0, min: 0 },
});

var TTTData = mongoose.model('TTTData', TTTSchema);

////////// black jack
var Schema = mongoose.Schema;
var BJInfo = new Schema({
    user: { type: String, default: '', trim: true },
    highScore: { type: Number, default: 0, min: 0 },
    numberOfPlays: { type: Number, default: 0, min: 0 },
    currentWinStreak: { type: Number, default: 0, min: 0 }
});

var BJData = mongoose.model('BJData', BJInfo);

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
    if (c != undefined && c.login != undefined) {
        if (sessions[c.login.username] != undefined &&
            sessions[c.login.username].id == c.login.sessionID) {// if the session and cookie match
            let now = Date.now();
            c.maxAge = 300000 * 2;
            sessions[c.login.username] = { id: c.login.sessionID, time: now }
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
app.use('/update/:id', authenticate);
app.use('/search/users/:keyword', authenticate);

app.use(express.static('public_html'))

/**
 * method handles use logins if the username and password are correct then it sends
 * a success back to the user and creates a cookie
 */
app.post('/login/user/pass', (req, res) => {
    console.log(sessions);
    console.log("tried to login");
    let u = req.body;
    let p1 = people.find({ username: u.username }).exec();
    p1.then((results) => {
        if (results.length == 0) {
            res.send("FAIL");

            res.end();
        } else {
            let currentUser = results[0];
            let toHash = u.password + currentUser.salt;
            let h = crypto.createHash('sha3-256');
            let data = h.update(toHash, 'utf-8');
            let result = data.digest('hex');

            if (result == currentUser.hash) {
                let sid = addSession(u.username);
                console.log(u.username);
                res.cookie("login",
                    { username: u.username, sessionID: sid },
                    { maxAge: 300000 * 2 });
                res.end('SUCCESS');
            }
            else {
                res.end('FAIL');
            }
        }
    });
});


app.post('/logout/user/', (req, res) => {
    console.log("go tto this logout")
    removeCertainSession(req, res);

});

function removeCertainSession(req, res) {
    let c = req.cookies;
    console.log('logout request');
    console.log(req.cookies);
    if (c != undefined) {
        delete sessions[c.login.username];
        res.end("SUCCESS");
    }
}

app.post('/changePassword/user', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let userSearch = people.find({ username: req.body.username }).exec();

    userSearch.then((documents) => {// when get the documents
        if (documents.length == 1) {
            let newSalt = '' + Math.floor(Math.random() * 10000000000);
            let toHash = req.body.password + newSalt;
            let h = crypto.createHash('sha3-256');
            let data = h.update(toHash, 'utf-8');
            let result = data.digest('hex');
            documents[0].hash = result;
            documents[0].salt = newSalt;

            let p = document[0].save();
            p.then(() => {
                res.end('SUCCESS');
            });
            p.catch(() => {
                console.log("save fail")
                res.end('FAIL');
            });
        }
        else {
            console.log("find fail")
            res.end('FAIL');
        }
    });

});


/**
 * post request handles creating a new User. the 
 * elements of the JSON User are in the body of the request
 */
app.post("/add/user/", function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // let saveUser = new people({ username: req.body.username, password: req.body.password, games: [] })
    // // creating a new user
    let userSearch = people.find({ username: req.body.username }).exec();

    // finding the user with the given keyword in the username

    userSearch.then((documents) => {// when get the documents
        if (documents.length == 0) {
            let newSalt = '' + Math.floor(Math.random() * 10000000000);
            let toHash = req.body.password + newSalt;
            let h = crypto.createHash('sha3-256');
            let data = h.update(toHash, 'utf-8');
            let result = data.digest('hex');
            let u = new people({
                hash: result,
                salt: newSalt,
                username: req.body.username,
                image: "",
                followers: [],
                gameScore: []
            });

            let H = new hangman({
                user: req.body.username,
                gamesPlayed: 0,
                wins: 0,
                currWinStreak: 0
            });

            let BJ = new BJData({
                user: req.body.username,
                highScore: 0,
                numberOfPlays: 0,
                currentWinStreak: 0
            });

            let Boggle = new boggleData({
                user: req.body.username,
                highScore: 0,
                numberOfPlays: 0,
                currentWinStreak: 0
            });

            let TTT = new TTTData({
                user: req.body.username,
                score: 0,
                numberPlays: 0,
                highestScore: 0,
                currentWinstreak: 0,
            });

            TTT.save();
            Boggle.save();
            BJ.save();
            H.save();
            let p = u.save();
            p.then(() => {
                res.end('SUCCESS');
            });
            p.catch(() => {
                console.log("save fail")
                res.end('FAIL');
            });
        }
        else {
            console.log("find fail")
            res.end('FAIL');
        }
    });

});


app.get('/get/curUsers/', function (req, res) {
    console.log("getting current user");
    let c = req.cookies;
    console.log(req.cookies);
    if (c != undefined && c.login != undefined) {
        if (sessions[c.login.username] != undefined &&
            sessions[c.login.username].id == c.login.sessionID) {// if the session and cookie match
            res.end((req.cookies).login.username);
        } else {
            res.end("FAIL");
        }
    } else {
        res.end("FAIL");
    }
});


var followingArr = [];
var followerArr = [];

// this is a helper async funtion to get the people the
// current user is following - used in the profile.js
async function getFollowing(person) {
    if (person == undefined) {
        return [];
    }
    for (let i = 0; i < person.length; i++) {
        curr = await people.findOne({ "_id": person[i] });
        followingArr.push(curr.username);
    }
    console.log(followingArr)
    return followingArr;
}

// this is a helper async funtion to get the current users
// followrs - used in the profile.js
async function getFollowers(person) {
    if (person == undefined) {
        return [];
    }
    for (let i = 0; i < person.length; i++) {
        curr = await people.findOne({ "_id": person[i] });
        followerArr.push(curr.username);
    }
    console.log(followerArr)
    return followerArr;
}

// this is a get request to get the followers of the current user- 
// used in profil.js
app.get("/get/followers/", (req, res) => {
    followerArr = [];
    var curUser = people.findOne({ "username": req.cookies.login.username });
    curUser.then((foundUser) => {
        console.log(foundUser.followers)
        return foundUser.followers;
    }).then((followers) => {
        return getFollowers(followers);
    }).then((followers) => {
        console.log(followers);
        res.send(followers)
    });

});


// this is a get request to get the people the current user is following
// used in profile.js
app.get("/get/following/", (req, res) => {
    followingArr = [];
    var curUser = people.findOne({ "username": req.cookies.login.username });
    curUser.then((foundUser) => {
        console.log(foundUser.following)
        return foundUser.following;
    }).then((following) => {
        console.log(followingArr)
        return getFollowing(following);
    }).then((follow) => {
        res.send(follow)
    });
});

app.get("/get/stats/", (req, res) => {
    let curUser = people.findOne({ "username": req.cookies.login.username });
    curUser.then((foundUser) => {
        console.log(foundUser.gameScore)

    })

});


app.get('/search/users/:keyword/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    let curUser = people.findOne({ "username": req.cookies.login.username });
    curUser.then((document) => {
        var id = document._id;
        let userSearch = people.find({ "username": { $regex: req.params.keyword } });
        // finding the user with the given keyword in the username
        var temp = [];
        userSearch.then((documents) => {// when get the documents
            for (user of documents) {
                console.log(req.cookies);
                if (user.following.includes(id)) {
                    temp.push({ user: user.username, stat: "FOLLOWER", id: user._id })
                    //user.stat = "FRIEND";
                } else if (user.followers.includes(id)) {
                    temp.push({ user: user.username, stat: "FOLLOWING", id: user._id })
                } else {
                    temp.push({ user: user.username, stat: "none", id: user._id })
                }

            }
            res.status(200);
            res.type('json').send(JSON.stringify(temp, null, 2) + '\n');
        });
    });

});

app.get(`/get/userSTATS/:user`, function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let curUserHang = hangman.findOne({ user: req.params.user }).exec();
    var stats = [];
    curUserHang.then((hang) => {
        console.log(hang);
        let user = hang;
        stats.push({ username: user.user, highScore: user.wins, currentWinStreak: user.currWinStreak, gamesPlayed: user.gamesPlayed });
        let curUserBog = boggleData.findOne({ user: req.params.user }).exec();
        curUserBog.then((bog) => {
            let user2 = bog;
            stats.push({ username: user2.user, highScore: user2.highScore, currentWinStreak: user2.currentWinStreak, gamesPlayed: user2.numberOfPlays });
            let curUserBJ = BJData.find({ user: { $regex: req.params.user } }).exec();
            curUserBJ.then((bj) => {
                let user3 = bj[0];
                stats.push({ username: user3.user, highScore: user3.highScore, currentWinStreak: user3.currentWinStreak, gamesPlayed: user3.numberOfPlays });
                let curUserTic = TTTData.findOne({ user: { $regex: req.params.user } }).exec();
                curUserTic.then((tic) => {
                    let user4 = tic;
                    stats.push({ username: user4.user, highScore: user4.highestScore, currentWinStreak: user4.currentWinstreak, gamesPlayed: user4.numberPlays });
                    res.status(200);
                    res.type('json').send(JSON.stringify(stats, null, 2) + '\n');
                });
            });
        });
    });
});


app.post("/update/:id", function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    user = people.findById(req.params.id);
    var curUser;
    var message = "user Posted";
    // finding the given user with the given username 
    user.then((document) => {// when get the documents
        if (document) {
            curUser = people.findOne({ username: req.cookies['login'].username });
            curUser.then((secdoc) => {
                if (req.body.ftnff) {
                    secdoc.following.push(document._id);
                    secdoc.save();
                    document.followers.push(secdoc._id);
                    document.save();
                } else {
                    let ind = document.followers.indexOf(secdoc._id);
                    let intdoc = secdoc.following.indexOf(document._id);
                    secdoc.following.splice(intdoc, 1);
                    secdoc.save();

                    document.followers.splice(ind, 1);
                    document.save();
                }

            });
        } else {
            message = "user not found";
        }

    });
    res.send(message);
});

// blackjack server

app.post('/addscoreBJ', function (req, res) {

});


// ---------------------------- Hangman Server ----------------------------

const fiveL = [];
const eightL = [];
const twelveL = [];
/**
 * This function uses file stream and read line to go through a text file and
 * put all of the words into a list
 * @param {*} file - a txt file
 * @param {*} list - a list for the words
 * @returns a list of words
 */
function readFile(file, list) {
    const input = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: input,
        terminal: false
    });

    rl.on('line', function (line) {
        list.push(line);
    });
    rl.on('close', function (close) {
        // console.log(fiveL);
        console.log(list.length);
        return list;
    })
    return list;
}

// Creating the lists
readFile('public_html/app/HM/Hangman/five.txt', fiveL);
readFile('public_html/app/HM/Hangman/eight.txt', eightL);
readFile('public_html/app/HM/Hangman/twelve.txt', twelveL);

/**
 * This is a get request that sends back the randomly picked word of the list for
 * a beginner game.
 */
app.get('/get/word/beg', function (req, res) {
    var answer = fiveL[Math.floor(Math.random() * (fiveL.length - 1))].toUpperCase();
    res.json(answer);
})

/**
 * This is a get request that sends back the randomly picked word of the list for
 * an intermediate game.
 */
app.get('/get/word/in', function (req, res) {
    var answer = eightL[Math.floor(Math.random() * (eightL.length - 1))].toUpperCase();
    res.json(answer);
})

/**
 * This is a get request that sends back the randomly picked word of the list for
 * an advanced game.
 */
app.get('/get/word/ad', function (req, res) {
    var answer = twelveL[Math.floor(Math.random() * (twelveL.length - 1))].toUpperCase();
    res.json(answer);
})

/**
 * This is a post request that gets ther user sent in the url for when they win.
 * It updates the hangman schema for this user by incrementing their values.
 */
app.post('/new/win/:name', (req, res) => {
    console.log(req.body.wins);
    let hGame = hangman.find({ user: req.params.name }).exec();
    hGame.then((doc) => {
        // Increase games played
        let games = doc[0].gamesPlayed;
        games++;
        doc[0].gamesPlayed = games;
        // Add to wins
        var win = doc[0].wins;
        win++;
        doc[0].wins = win;
        // Add to streak
        var streak = doc[0].currWinStreak;
        streak++;
        doc[0].currWinStreak = streak;
        doc[0].save();
        console.log("saved");
    })
})

/**
 * This is a post request that gets ther user sent in the url for when they lose.
 * It updates the hangman schema for this user by resetting their values.
 */
app.post('/new/loss/:name', (req, res) => {
    console.log(req.body.wins);
    let hGame = hangman.find({ user: req.params.name }).exec();
    hGame.then((doc) => {
        let games = doc[0].gamesPlayed;
        games++;
        doc[0].gamesPlayed = games;
        doc[0].currWinStreak = 0;
        doc[0].save();
        console.log("saved");
    })
})

// ---------------------------- Boggle Server ----------------------------

//////////////////////////// BOGGLE ///////////////////////////////////////

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


app.post('/scoreBoggle', function (req, res) {
    console.log(req.body);
    let bGame = boggleData.find({ user: req.body.username }).exec();
    bGame.then((doc) => {
        let games = doc[0].numberOfPlays;
        games++;
        doc[0].numberOfPlays = games;
        if (req.body.score > doc[0].highScore) {
            doc[0].highScore = req.body.score;
        }
        doc[0].save();
        console.log("saved");
    });
});



async function readAllWords() {
    data = await fs2.readFile('./words.txt', 'utf-8')
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


app.get('/boggle/highestScores/', function (req, res) {
    console.log("here");
    let retStr = ""
    let num=0;
    let bGame = boggleData.find().sort({highScore:-1});
    bGame.then((doc) => {
        let num=doc.length;
        for(let i =0; i < doc.length;i++){
            
            retStr+=num.toString()+": "+doc[i].user+"|Score: "+doc[i].highScore.toString()+"\n";
            num-=1;
        }
        //JSON.stringify(doc)
        res.end( retStr);
    });
});

app.get('/boggle/numPlays/', function (req, res) {
    console.log("here");
    let retStr = ""
   
    let bGame = boggleData.find().sort({numberOfPlays:-1});
    bGame.then((doc) => {
        let num=doc.length;
        for(let i =0; i < doc.length;i++){
 
            retStr+=num.toString()+": "+doc[i].user+"|NumPlays: "+doc[i].numberOfPlays.toString()+"\n";
            num-=1;
        }
        //JSON.stringify(doc)
        res.end( retStr);
    });
});


//////////////////////////// BOGGLE END ////////////////////////////////////////////////




// ---------------------------- TTT Server ----------------------------


app.post('/TTT/Loss/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let username = req.body.username;
    console.log("tttloss " + username)
    let TTTSearch = TTTData.find({ "user": username });
    // finding the item with the given keyword in the description
    TTTSearch.then((documents) => {// when get the documents
        if (documents.length != 0) {
            documents[0].score -= 2;
            documents[0].currentWinstreak = 0;
            documents[0].numberPlays += 1;
        }
        let p = documents[0].save();
        p.then(() => {
            res.end(documents[0].score.toString());
        });
        p.catch(() => {
            console.log("save fail")
            res.end('FAIL');
        });
    });
});

app.post('/TTT/get/Score/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let username = req.body.username;
    let TTTSearch = TTTData.find({ "user": username });
    // finding the item with the given keyword in the description
    TTTSearch.then((documents) => {// when get the documents
        res.end(documents[0].score.toString());
    });
});

app.post('/TTT/Win/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let username = req.body.username;
    console.log("tttwin " + username)
    let TTTSearch = TTTData.find({ "user": username });
    // finding the item with the given keyword in the description
    TTTSearch.then((documents) => {// when get the documents
        if (documents.length != 0) {
            documents[0].score += 5;
            documents[0].currentWinstreak += 1;
            documents[0].numberPlays += 1;
            console.log("currnet score" + documents[0].score)
            console.log("highestScore" + documents[0].highestScore)
            if (documents[0].score >= documents[0].highestScore) {
                documents[0].highestScore = documents[0].score;
            }
        }

        let p = documents[0].save();
        p.then(() => {
            res.end(documents[0].score.toString());
        });
        p.catch(() => {
            console.log("save fail")
            res.end('FAIL');
        });

    });

});
app.post('/TTT/Tie/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let username = req.body.username;
    console.log("ttttie " + username)
    let TTTSearch = TTTData.find({ "user": username });
    // finding the item with the given keyword in the description
    TTTSearch.then((documents) => {// when get the documents
        if (documents.length != 0) {
            documents[0].score += 2;
            documents[0].currentWinstreak = 0;
            documents[0].numberPlays += 1;
        }
        let p = documents[0].save();
        p.then(() => {
            res.end(documents[0].score.toString());
        });
        p.catch(() => {
            console.log("save fail")
            res.end('FAIL');
        });
    });

});


// ---------------------------- Blackjack Server ----------------------------



app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`))
