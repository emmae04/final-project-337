/** Author: Emma Elliott
 * This is the client side code for blackjack
 * GAME OVERVIEW
 * 1) the game will begin with the user pressing start 
2) the user and the computer will then be dealt 2 cards each from
the deck of cards displayed at the side of the page
3) players will have 10 seconds to decide whether or not to draw
another card or to stick with their current hand. After they have decided, 
the other player will have the same choice
4) The time continues until both players have stuck to their cards, 
then both cards are revealed to the other player. Then, 1 point is awarded
as followings:
 5) if one of the players is "bust" or has a card calue over 21, 
    the other player is awarded the point
 6) if both players are not "bust", the point is awarded to the player with
    the card value closest to 21
 7) if the players have a tie, the point is awarded to the player with the most cards
 8) if the players have the same amount of cards, the point is awarded to the
    player with the highest card value
9) "global scores" will be determined by whichever player has the most points from 
playing rounds of the game 
 */

var suits = ["S", "D", "C", "H"];
var rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
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
const seeRules = document.getElementById("see-rules")
var player1Sticks = false;
var player2Sticks = false;
var p1Moved = false;
var intID1 = 0;
var intID2 = 0;
var intID3 = 0;
var player1CardVal = 0;
var player2CardVal = 0;
var gameOver = false;

// this function will initalize all the values in the game 
// at the beginning of the round and at the end of each new round
function initValues() {
	seeRules.style.display = "None";
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


var username;

fetch('/get/curUsers/')
.then((res) => {
    res.text()
    .then((res2) => {
        username = res2;
        console.log(res2);
    })
});

// this function will randomly choose cards from the deck
// of cards
function chooseCard() {
	var card = deck[Math.floor(Math.random() * 52)];
	while (!deck.includes(card)) {
		card = deck[Math.floor(Math.random() * 52)];
	}
	currentCards.push(card);
	return card
}


// this function to choose players first cards, each player
// will be dealt 2 cards each to begin
function chooseFirstCards() {
	player1Cards.push(chooseCard());
	player1Cards.push(chooseCard());
	player2Cards.push(chooseCard());
	player2Cards.push(chooseCard());
}

// this function begins the game - it will initialize
// the intervals for the functions to be called within the
// game and initializes values
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

// this function will player the computers turn of the game
// only if the first player has moved or the first player sticks
function playComputersTurn() {
	if (p1Moved || player1Sticks) {
		secondsLeft.innerText = "10"
		computerDraws()
		p1Moved = false;

	}
}

// this function is called every 1/2 second and will determine if
// the game is over to display the scores of the current round
function isGameOver() {
	if (player1Sticks && player2Sticks) {
		stopRound()
	}
	if (player1CardVal > 21 || player2CardVal > 21) {
		stopRound()
	}
}

// this function will make the computer either draw another card 
// or stick with their current cards
function computerDraws() {
	if (tDontD(player2CardVal)) {
		pickAnother(2)
	}
	else {
		player2Sticks = true;
	}

}

// this function will randomly choose whether or not the computer
// will draw another card or stick to their current cards
function tDontD(player2CardVal) {
	if (player2CardVal >= 21) {
		return false;
	}
	random = Math.floor(Math.random() * 3)
	return random != 1
}

// this function will be called everytime player 1 or player 2 chooses
// a card - it takes the parameter of the player number, and will display
// their new card on the screen
function pickAnother(player) {
	let card = chooseCard()
	var anotherCard = document.createElement('img');
	anotherCard.style.width = "100px";
	anotherCard.style.marginRight = "25px";
	anotherCard.style.borderRadius = "15px";
	if (player == 2) {
		// hides player 2's card 
		anotherCard.src = "playing-card.png";
		cardCont2.appendChild(anotherCard);
		secondsLeft.innerText = 10;
		player2Cards.push(card);
		addCardVal(2, card);
	}
	else {
		// shows player 1's card

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

// this function will be called if player 1 sticks, and it will
// disable both action button sof the screen 
function stick() {
	player1Sticks = true;
	p1Moved = true;
	drawAnotherButton.disabled = true;
	stickButton.disabled = true;

}

// this function will be the countdown timer for the game. It will count down
// from 10. If the timer reaches 0 and the player has not moved, the round will
// end and the player who didnt move will automatically loose. The countdown timer
// is reset for every move made ad every new round created
function countDown() {
	var countdown = ["10", "9", "8", "7", "6", "4", "5", "3",
	"2", "1", "0"];
	currVal = secondsLeft.innerText;
	currIndex = countdown.indexOf(currVal);
	if (currVal == 0) {
		if (!p1Moved) {
			// stops round if p1 did not move 
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

// this function will be called if one of the players went "bust", a 
// player ran out of time, or both players have stuck to their cards. 
// it will determine the winner and create a winner message to display on
// the screen 
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
	// clears intervals until next round starts. 
	clearInterval(intID1);
	clearInterval(intID2);
	displayCurrScore();
	clearInterval(intID3)
	playAgain.style.display = 'inline';
	noPlayButton.style.display = 'inline';
	numRounds += 1

}

// this function will determine who is the winner of the game - player 1 or player 2
// depnded on their card value, and how many cards they have. Players can also tie
function whosTheWinner() {
	if (secondsLeft.innerText == "0") {
		return 2;
	}
	if (player1CardVal > 21) {
		if (player2CardVal > 21) {
			// tie if both players are bust
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
			// tie if both players have the same card value and same amount of cards. 
			return 0;
		}
	}	
}

// this function will end the game after the user has decided they want to stop. 
// The total rounds the played vs the total round the computer played will be shown
// and the users wins will be recorded in the server. The user can play again or 
// navigate back to home.
function endGame() {
	if (noPlayButton.innerText == "Go home") {
		window.location.href = "http://localhost/app/main.html";;
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

	data= {
		highScore:P1Wins,
		numberOfPlays:numRounds,
	}

	// will add score to the game
	fetch(`/addScoreBJ/${username}` , {
		method: "POST",
		body: JSON.stringify(data), 
		headers: {"Content-Type" : "application/json"}
	})
}


// this functon will display the current score after the game has been 
// finished as how many rounds P1 wons vs how many rounds P2 has won
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


// this function will display player 1's cards - it will pull images from the cards folder inside 
// this folder. It will then add then to the screen. 
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

// this function will determine the card value of each players card, to be 
// used later on in determining the winner. Aces count as 1 point, and Queens, 
// jacks, and kings count as 10 points. 
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

// checks if a string is number to parse cards in the deck
function isNumber(obj) {
    return typeof obj === 'number';
}

// This function will display player 2's cards as the back of 
// a playing card so it is hidden to the first player. 
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

function back() {
    window.location.href = "http://localhost/app/main.html";
}

// fetch(`/BJGame`, {
// 	method: "POST",
// 	body: JSON.stringify({curScore: P1Wins, username: username, numberOfPlays: numRounds, currentWinStreak: something}),
// 	headers: { 'Content-Type': 'application/json' }
// }).catch((err) => {
// 	console.log(err);
// 	console.log("error");
// });