// Initializes the required pieces
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs')
const app = express()
const parser = require('body-parser')
const cookieParser = require('cookie-parser');
const port = 90

// Builds up the database
const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/final';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', () => { console.log('MongoDB connection error:') });

app.use(express.static('public_html'))
app.use(parser.json());
app.use(cookieParser());
app.use(express.json());

// Creates the mongoose schemas for the ostaa project
var Schema = mongoose.Schema;

// The schema for users
var UserSchema = new Schema({
    username: String,
    password: String,
    games: []
})

// The schema for users
var HangmanSchema = new Schema({
    guesses: Number,
    wins: Number,
    games: []
})

var people = mongoose.model("User", UserSchema);
var hangman = mongoose.model("Hangman", HangmanSchema);



// ---------------------------- Hangman Server ----------------------------




// ---------------------------- Boggle Server ----------------------------




// ---------------------------- TTT Server ----------------------------




// ---------------------------- Blackjack Server ----------------------------