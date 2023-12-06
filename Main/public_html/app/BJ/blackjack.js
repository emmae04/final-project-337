// 1) the game will begin with the current user being
// given the option to either play with the computer
// or another player 
// 2) once the user has selected they will either be assigned another player
// to play if there are others online. If there are no other players online,
// then the user will have to play against the computer 
// 3) the user and the other player will then be dealt 2 cards each from
// the deck of cards displayed at the side of the page
// 4) the other player will have 10 seconds to decide whether or not to draw
// another card or to stick with their current hand. After they have decided, 
// the current user will have the same choice
// 5) The time continues until both players have stuck to their cards, 
// then both cards are revealed to the other player. Then, 1 point is awarded
// to the player with:
//  1) if one of the players is "bust" or has a card calue over 21, 
//     the other player is awarded the point
//  2) if both players are not "bust", the point is awarded to the player with
//     the card value closest to 21
//  3) if the players have a tie, the point is awarded to the player with the most cards
//  4) if the players have the same amount of cards, the point is awarded to the
//     player with the highest card value
// 
// additional rules : 
// 1) an ace can either count for an 11 or a 1 - if a player is dealt
// an ace, they will be given the option to decide if they count it as an 11 or a 1
// 2) There will be 5 rounds total. The player with the most points after 5 rounds is
// awarded a win - or if 1 player wins the first 3 rounds 
// 3) "global scores" will be determined by whichever player has the most points from 
// playing rounds of the game 

var suits = ["S", "D", "C", "H"];
var rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function chooseCard() {
	
	var card = deck[Math.floor(Math.random() * 52)];
	while (!deck.includes(card)) {
		card = deck[Math.floor(Math.random() * 52)];
	}
	currentCards.push(card);
	return card
}
//create a function to initialize values of game
// deck, current cards
var numRounds = 0;
var P1Wins = 0;
var P2Wins = 0;
const deck = []
var currentCards = []
var player1Cards = []
var player2Cards = []
const cardCont1=document.getElementById("P1Cards");
const cardCont2=document.getElementById("P2Cards");
const drawAnotherButton = document.getElementById("drawAnother");
const stickButton = document.getElementById("stick");
const noPlayButton = document.getElementById("dont-play-again");
const playAgain = document.getElementById("play-again");
const txtbox = document.getElementById("textbox");	
const startButton = document.getElementById("start");	
const secondsLeft = document.getElementById("secondsLeft");
var player1Sticks = false;
var player2Sticks = false;
var p1Moved = false;
var intID1 = 0;
var intID2 = 0;
var intID3 = 0;
var player1CardVal = 0;
var player2CardVal = 0;
var gameOver = false;

function initValues() {
	drawAnotherButton.disabled = false;
	stickButton.disabled = false;
	player1Cards = [];
	player2Cards = [];
	player1CardVal = 0;
	player2CardVal = 0;
	currentCards = [];
	p1Moved = false;
	player1Sticks = false;
	player2Sticks = false;
	txtbox.style.display = "None";
	noPlayButton.style.display = "None";
	playAgain.style.display = "None";
	if (numRounds >= 1) {
		cardCont2.innerHTML = "";
		cardCont1.innerHTML = "";
	}
	for(let i = 0; i < suits.length; i++)
	{		for(let x = 0; x < rank.length; x++)
		{
            let card = [rank[x] + " " + suits[i]];
			deck.push(card);
		}
	}
}


// create a function to choose players first cards
function chooseFirstCards() {
	player1Cards.push(chooseCard());
	player1Cards.push(chooseCard());
	player2Cards.push(chooseCard());
	player2Cards.push(chooseCard());
}


function startGame() {
	initValues();
	intID1 = setInterval(countDown, 1000);
	intID2 = setInterval(playComputersTurn, 1000);
	intID3 = setInterval(isGameOver, 500);
	startButton.style.display = "None";
	chooseFirstCards();

	displayP1Cards();
	displayP2Cards();
	
}

function playComputersTurn() {
	if (p1Moved || player1Sticks) {
		secondsLeft.innerText = "10"
		computerDraws()
		p1Moved = false;

	}
}

function isGameOver() {
	if (player1Sticks && player2Sticks) {
		stopRound()
	}
	if (player1CardVal > 21 || player2CardVal > 21) {
		stopRound()
	}
}

function computerDraws() {
	if (tDontD(player2CardVal)) {
		pickAnother(2)
	}
	else {
		console.log("here")
		player2Sticks = true;
	}

}

function tDontD(player2CardVal) {
	if (player2CardVal >= 21) {
		return false;
	}
	random = Math.floor(Math.random() * 3)
	return random != 1
}

function pickAnother(player) {
	let card = chooseCard()
	var anotherCard = document.createElement('img');
	anotherCard.style.width = "100px";
	anotherCard.style.marginRight = "25px";
	anotherCard.style.borderRadius = "15px";
	if (player == 2) {
		anotherCard.src = "playing-card.png";
		cardCont2.appendChild(anotherCard);
		secondsLeft.innerText = 10;
		player2Cards.push(card);
		addCardVal(2, card);
	}
	else {
		var cardSrc = String(card).split(" ")[0] + String(card).split(" ")[1];
		anotherCard.src = "cards/" + cardSrc + ".png"
		cardCont1.appendChild(anotherCard);
		secondsLeft.innerText = 10;
		p1Moved = true;
		player1Cards.push(card);
		addCardVal(1, card)
	}
	currentCards.push(card);


}

function stick() {
	player1Sticks = true;
	p1Moved = true;
	drawAnotherButton.disabled = true;
	stickButton.disabled = true;

}


function countDown() {
	var countdown = ["10", "9", "8", "7", "6", "4", "5", "3",
	"2", "1", "0"];
	currVal = secondsLeft.innerText;
	currIndex = countdown.indexOf(currVal);
	if (currVal == 0) {
		if (!p1Moved) {
			stopRound()
			secondsLeft.innerText = 0;
		}
		else {
			secondsLeft.innerText = 10;
		}
	}
	else if (currVal >= 1) {
		secondsLeft.innerText = countdown[currIndex+1];
	}

}

function stopRound() {
	winner = whosTheWinner()
	if (whosTheWinner() == 1) {
		P1Wins += 1
		winnerMsg = "You win! "
	}
	else if (whosTheWinner() == 2) {
		P2Wins += 1
		winnerMsg = "You lost. "
	}
	else {
		winnerMsg = "Tie. "
	}
	winnerMsg += "You : " + String(player1CardVal) + " Player 2 : " + String(player2CardVal);

	txtbox.style.display = "inline";
	txtbox.innerText = winnerMsg;
	clearInterval(intID1);
	clearInterval(intID2);
	displayCurrScore();
	clearInterval(intID3)
	playAgain.style.display = 'inline';
	noPlayButton.style.display = 'inline';
	numRounds += 1

}

function whosTheWinner() {
	if (secondsLeft.innerText == "0") {
		return 2;
	}
	if (player1CardVal > 21) {
		if (player2CardVal > 21) {
			return 0;
		}
		else {
			return 2;
		}
	}
	else if (player2CardVal > 21) {
		return 1;
	}
	else if (player1CardVal > player2CardVal) {
		return 1;
	}
	else if (player2CardVal > player1CardVal) {
		return 2;
	}
	else {
		if (player1Cards.length > player2CardVal.length) {
			return 1;
		}
		else if (player2Cards.length > player1CardVal.length) {
			return 2;
		}
		else {
			return 0;
		}
	}	
}

function endGame() {
	if (noPlayButton.innerText == "Go home") {
		window.location.href = "start_blackjack.html";
	}
	initValues()
	txtbox.style.display = "inline"
	var scores = " You - " + P1Wins + " Player 2 - " + P2Wins;
	if (P1Wins > P2Wins) {
		txtbox.innerText = "Congrats! You won. You earned " + P1Wins + " points";
	}
	else if (P2Wins > P1Wins) {
		txtbox.innerText = "You lost. " + scores;
	}
	else {
		txtbox.innerText = "There was a tie." + scores;
	}
	playAgain.innerText = "Play again";
	noPlayButton.innerText = "Go home";
	playAgain.style.display = "inline";
	noPlayButton.style.display = "inline";

	var currUser = ""
	fetch("/get/curUsers/")
    .then(res => {
        return res.text();
    }).then(text =>{
        currUser = text;
    })

	data = {
		user : currUser,
		highScore : P1Wins,
		numberOfPlays : numRounds,
		currentWinStreak : P1Wins;
	}

	fetch(`/addScoreBJ`, {
		method: "POST",
		body: JSON.stringify(data), 
		headers: {"Content-Type" : "application/json"}
	});
}

function displayCurrScore() {

	cards_to_display = cardCont2.getElementsByTagName("img");
	for (let i = 0; i < cards_to_display.length; i++) {
		cardSrc = String(player2Cards[i]).split(" ")[0] + String(player2Cards[i]).split(" ")[1]
		cards_to_display[i].src = "cards/" + cardSrc + ".png"
		cards_to_display[i].style.animation = "fadeIn 1s";
	}
	console.log('P1 ' + String(player1CardVal));
	console.log('P2 ' + String(player2CardVal));
}


function displayP1Cards() {
	var card1Src = String(player1Cards[0]).split(' ')[0] + String(player1Cards[0]).split(' ')[1];
	var card1 = document.createElement('img');
	card1.src = "cards/" + card1Src + ".png";
	card1.style.width = "100px";
	card1.style.marginRight = "25px"
	cardCont1.appendChild(card1);

	var card2Src = String(player1Cards[1]).split(" ")[0] + String(player1Cards[1]).split(" ")[1];
	var card2 = document.createElement('img');
	card2.src = "cards/" + card2Src + ".png";
	card2.style.width = "100px";
	card2.style.marginRight = "25px"
	cardCont1.appendChild(card2);

	addCardVal(1, player1Cards[0]);
	addCardVal(1, player1Cards[1]);

}

function addCardVal(player, card) {
	cardAmt = String(card).split(" ")[0]
	console.log(cardAmt)
	cardVal = 0;
	if (cardAmt == "A") {
		cardVal += 1;
	}
	else if (cardAmt == "Q" || cardAmt == "K" || cardAmt == "J") {
		cardVal += 10;
	}
	else {
		cardVal += Number(cardAmt)
	}
	if (player == 1) {
		player1CardVal += Number(cardVal);
	}
	else if (player == 2) {
		player2CardVal += Number(cardVal);
	}
}

function isNumber(obj) {
    return typeof obj === 'number';
}

function displayP2Cards() {
	var card1 = document.createElement('img');
	card1.src = "playing-card.png";
	card1.style.width = "100px";
	card1.style.marginRight = "25px";
	card1.style.borderRadius = "15px";
	cardCont2.appendChild(card1);

	var card2 = document.createElement('img');
	card2.src = "playing-card.png";
	card2.style.width = "100px";
	card2.style.marginRight = "20px";
	card2.style.borderRadius = "15px";
	cardCont2.appendChild(card2);

	addCardVal(2, player2Cards[0]);
	addCardVal(2, player2Cards[1]);

}

