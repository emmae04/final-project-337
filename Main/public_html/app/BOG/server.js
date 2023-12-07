
// ---------------------NOT USED-----------------------------


// mongoose setup
const mongoose = require('mongoose');
const express = require('express')
const fs = require('fs').promises;
const app = express()
const port = 80

const parser = require('body-parser');
app.use(parser.json());

// DB stuff
const db = mongoose.connection;

// schema for the items
var Schema = mongoose.Schema;
var boggleInfo = new Schema({
    user: { type: String, default: '', trim: true },
    score: { type: Number, default: 0, min: 0 },
});

var boggleData = mongoose.model('boggleData', boggleInfo);

app.use(express.static('public_html'))
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


app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`));
