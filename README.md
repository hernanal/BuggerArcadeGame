BUGGER, the classic arcade game
===============================

## Introduction

This game was inspired by the classic arcade game FROGGER.

The object of the game is to cross over from the grass to the water without getting run over by a bug.
Along the way the player will be able to collect items to boost their score or increase their lives.
Lives max out at five and when they run out the game is over, the score resets, the items reset, and the high score is updated (if necessary).

## Files

There are three JavaScript, one HTML, one CSS, and 10 image files that are utilized to make this game possible:
* The app.js file handles the creation of the enemies, player, items, and text in the game.
* The engine.js handles the rendering and updating of the enemies, player, items, text, and background images in the game.
* The resources.js file is the image loading utility.
* The HTML and CSS files are used to load the JavaScript files into the browser and center the canvas.

## Running the Game

1. Clone the repository.

2. Open the file directory.

3. Double click the *index.html* file. (Google Chrome browser recommended)

## How to Play

* To move the player one square at a time use the arrow keys. The player is safe from enemies on the grass and in the water.

* Move the player across the three roads, into the water, without getting hit by an enemy bug to receive 10 points. If the player gets hit, 20 points is deducted from the score. The score can be negative. Text will be displayed to the user during these events.

* Along the way to reaching the water items may be displayed along the roads. The player should try to collect as many of the items as possible to boost their score or the amount of lives they have. Each time an item is collected, text will be displayed as well. Items are allowed to overlap. The items and their values are as follows:

	* Blue gem: 2 points.
	* Green gem: 4 points.
	* Star: 10 points.
	* Orange gem: 20 points.
	* Heart: 1 life. 

* When the lives counter reaches zero the game will reset and a text notifying the player of the end will be displayed. 

I hope you enjoy the game and feel free to message me any suggestions you have on how to improve the game.

Let me know your high score as well!

Check out the game [here](https://hernanal.github.io/BuggerArcadeGame)!!


