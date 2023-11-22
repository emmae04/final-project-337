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

function getDeck()
{
	let deck = [];
	for(let i = 0; i < suits.length; i++)
	{		for(let x = 0; x < values.length; x++)
		{
            let card = [rank[x] + suits[i]];
			deck.push(card);
		}
	}
	return deck
}


fetch("/")
.then((res) => {
	console.log(res);
})













const deck = getDeck();
const currentCards = []

function initiateGame() {
	var countdown = document.getElementById('countdown');

	// while (!p1Stick) {
	// 	secondsleft = 10;
	// 	countdownInterval = setInterval(function() {
	// 		seconds--;
	// 		countdown.textContent = secondsleft;
	// 	if (secondsleft <= 0) {
	// 		clearInterval(countdownInterval);
	// 		countdown.textContent = 0;
	// 		}
	// 	}, 1000);
			
	// }

	
}

const p1Stick = false;
const p2Stick = false;

var initValP1 = displayP1Cards(player1Cards);
var initValP2 = displayP2Cards(player2cards);

var player1Cards = pickCards();
var player2cards = pickCards();

initiateGame();

function pickAnother() {
	card = chooseCard()
	return card
	
}

function stick() {
	p1Stick = true
	
}


function displayP1Cards(player1Cards) {
	var card1Suit = player1Cards[0].split(" ")[0];
	var card1Rank = player1Cards[0].split(" ")[1];

	cardCont=document.getElementById("P1Cards");

	var card1 = document.createElement('img');
	card1.src = "PNG/" + card1Suit + "-" + card1Rank + ".png";
	cardCont.appendChild(card1);

	var card2Suit = player1Cards[1].split(" ")[0];
	var card2Rank = player1Cards[1].split(" ")[1];

	var card2 = document.createElement('img');
	card2.src = "PNG/" + card2Suit + "-" + card2Rank + ".png";
	cardCont.appendChild(card2);

	return card1Rank + card2Rank

}

function displayP2Cards(player2Cards) {
	cardCont=document.getElementById("P2Cards");

	var card1 = document.createElement('img');
	card1.src = "playing-card.png";
	cardCont.appendChild(card1);

	var card2 = document.createElement('img');
	card2.src = "playing-card.png"
	cardCont.appendChild(card2);

	return player2Cards[0].split(" ")[1] + player2Cards[1].split(" ")[1];
}

function pickCards() {
	var card1 = chooseCard();
	var card2 = chooseCard();
	return card1, card2
}

function chooseCard() {
	var card = deck[Math.floor(Math.random() * 52)];
	while (!deck.includes(card)) {
		card = deck[Math.floor(Math.random() * 52)];
	}
	currentCards.push(card);
	return card
}

