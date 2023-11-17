const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
app.use(parser.json());
const port = 80;

const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/ostaa';
mongoose.connect(mongoDBURL, { useNewURLParser: true });
db.on('error', console.error.bind(console, "MongoDB connection error"));

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    level: Number,
    coins: Number
  });
  
var User = mongoose.model("User", UserSchema);

