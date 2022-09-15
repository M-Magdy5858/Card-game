///////////////// Global Variables ////////////////////
// audio objects
var audio1 = new Audio('./media/pop.mp3');
var audio2 = new Audio('./media/notification-1.wav');

var dup = []; // duplicated numbers after getting random numbers
var tried = 0; // number of tries

var minutes = document.getElementById('timer-minutes');
var seconds = document.getElementById('timer-seconds');
var hours = document.getElementById('timer-hours');
var secondPassed = 0;
var timer; // variable to hold  interval id

///////////////// Functions ////////////////////
//
// adding left zero  5:8 => 05:08
function addLeftZero(value) {
	return value > 9 ? value : '0' + value;
}
// timer function
function countUp() {
	secondPassed++;
	hours.innerHTML = addLeftZero(Math.floor(secondPassed / 3600));
	minutes.innerHTML = addLeftZero(Math.floor((secondPassed % 3600) / 60));
	seconds.innerHTML = addLeftZero(Math.floor(secondPassed % 60));
}
// generate random source for img element
function randomPic(img) {
	var x;
	do {
		x = Math.ceil(Math.random() * 8);
	} while (dup.includes(x)); // condition to get a NEW reandom number

	img.src = './media/' + x + '.jpg';

	// add number to dup array if img is repeated twice
	var repeat = Array.from(document.getElementsByTagName('img')).filter(
		function (e) {
			if (e.src.includes('/' + x + '.jpg')) {
				return e;
			}
		}
	).length;
	if (repeat == 2) {
		dup.push(x);
	}
}
// building the card
function makeCard() {
	var card = document.createElement('div');
	card.className = 'card';
	var face = document.createElement('div');
	face.className = 'face';
	var back = document.createElement('div');
	back.className = 'back';
	var image = document.createElement('img');

	var backImage = document.createElement('img');
	backImage.src = './media/m.jpg';

	back.appendChild(backImage);
	face.appendChild(image);
	card.append(face, back);

	document.getElementById('game-wrapper').appendChild(card);

	//add random img rource to img element
	randomPic(image);
}
// render all 16 cards
function renderCards() {
	while (dup.length < 8) {
		makeCard();
	}
}
//flip function
function flip(element) {
	element.classList.toggle('flipped');
}
// main game function
function game() {
	var selected; // previously selected card
	document
		.getElementById('game-wrapper')
		.addEventListener('click', function (e) {
			if (e.target.id == 'game-wrapper') {
				// do nothing if wrapper was clicked on
			} else {
				// get the card element of the clicked img
				console.log(e.target);
				card = e.target.parentElement.parentElement;
				lastCard = selected ? selected.parentElement.parentElement : null;

				// I. clicking on the same previous card
				if (e.target == selected) {
					document.getElementById('try').innerHTML = addLeftZero(++tried);
					flip(card);
					selected = null; // reset previously selected
				}
				// II. clicking on a new card ( no previously selected card )
				else if (!selected && e.target.id != 'game-wrapper') {
					selected = e.target;
					flip(card);
				}
				// III. clicking on a matched card
				else if (selected.src == e.target.src) {
					flip(card);
					audio1.play();
					card.classList.toggle('correct');
					lastCard.classList.toggle('correct');
					card.style.visibility = 'hidden';
					lastCard.style.visibility = 'hidden';
					document.getElementById('try').innerHTML = addLeftZero(++tried);
					selected = null; // reset previously selected
				}
				// IX. clicking on a wrong card
				else {
					flip(card);
					card.classList.toggle('in-correct');
					lastCard.classList.toggle('in-correct');

					// stop pointer event until cards flip back
					document.getElementById('game-wrapper').style.pointerEvents = 'none';
					// flip cards back after 1 second
					setTimeout(function () {
						flip(card);
						flip(lastCard);
						document.getElementById('try').innerHTML = addLeftZero(++tried);
						card.classList.toggle('in-correct');
						lastCard.classList.toggle('in-correct');
						//continue pointer events
						document.getElementById('game-wrapper').style.pointerEvents =
							'auto';
					}, 1000);

					selected = null; // reset previously selected
				}
			}
			// check if all cards are found
			if (
				Array.from(document.getElementById('game-wrapper').children).every(
					function (item) {
						return item.style.visibility == 'hidden';
					}
				)
			) {
				// end game
				audio2.play();
				clearInterval(timer); //stop timer
			}
		});
}

///////////////////////  Events  ///////////////////////////////////////
renderCards(); // render all cards & imgs on loading page

// start game event on clicking start btn
document.getElementById('start').addEventListener('click', function () {
	Array.from(document.getElementsByClassName('card')).forEach(function (card) {
		flip(card);
	});
	this.disabled = true; /// disable start button
	this.innerText = 'Started..';
	timer = setInterval(countUp, 1000); /// start timer
	game();
});

// reloading page on clicking reload
document.getElementById('reload').addEventListener('click', function () {
	location.reload();
});
