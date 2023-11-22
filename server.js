const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
app.use(parser.json());
const port = 80;
const path = require('path');

const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/cool-math-games';
mongoose.connect(mongoDBURL, { useNewURLParser: true });
db.on('error', console.error.bind(console, "MongoDB connection error"));


app.use(express.static('public_html'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public_html/start_blackjack.html'));
});


var Schema = mongoose.Schema;

// var UserSchema = new Schema({
//     username: String,
//     password: String,
//     level: Number,
//     coins: Number
//   });
  
// var User = mongoose.model("User", UserSchema);

// creates quick link to local host port
app.listen(port, () => 
  console.log(`App listening at http://localhost:${port}`))




