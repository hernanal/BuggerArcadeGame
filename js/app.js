// Super class and constructor function for every element in the game
var GameElement = function(){};

// The requirements to be a game element
GameElement.prototype.x = 0;
GameElement.prototype.y = 0;
GameElement.prototype.row = 0;
GameElement.prototype.col = 0;
GameElement.prototype.alignAxisX = 0;
GameElement.prototype.alignAxisY = 0;
GameElement.prototype.visibility = true;

// Methods all elements have in common
GameElement.prototype.update = function(dt){};
GameElement.prototype.render = function(){
    if(this.visibility){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};
GameElement.prototype.setCol = function(col){
    this.col = col;
    this.x = col * 101 + this.alignAxisX;
};
GameElement.prototype.setRow = function(row){
    this.row = row;
    this.y = row * 83 + this.alignAxisY;
};
// Method to display text during collisions, when the player wins,
// and when the game is over
GameElement.prototype.displayText = function(text_array, text, col, row, duration, color){
    text_array.push(new InGameText(text, col, row, duration, color));
};

// Method to assist in changing the max and min
// Credit: shikeyou
Number.prototype.fit = function(oldMin, oldMax, newMin, newMax){
    return (this - 0) / (oldMax - oldMin) * (newMax- newMin) + newMin;
};


// Sub class for the enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.alignAxisY = -30;
    this.w = 75;
    this.h = 75;
    this.reset();
};

Enemy.prototype = Object.create(GameElement.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.minSpeed = 250;
Enemy.prototype.maxSpeed = 500;

Enemy.prototype.minDelay = 0.5;
Enemy.prototype.maxDelay = 2.0;

Enemy.prototype.reset = function() {

    // picks a row from 1 to 3 on the rock ground
    this.setRow(Math.floor(Math.random() * 3) + 1);

    // pick a random speed for each enemy on reset
    this.speed = Math.floor(Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed);

    // Make sure to start the enemy off screen to the left on reset
    // Credit: shikeyou
    this.x = -Math.random().fit(0, 1, this.minDelay, this.maxDelay) * this.speed;
};

// Update the enemy's position.
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // The dt parameter will ensure the 
    // game runs at the same speed for
    // all computers.

    // Move the enemies
    this.x += this.speed * dt;
    if(this.x > canvasWidth) {
        this.reset();
    }

    this.enemyCollisions(player, allItems);
};

Enemy.prototype.enemyCollisions = function(a_player, item_array){
    if(a_player.x < this.x + this.w &&
       a_player.x + a_player.w > this.x &&
       a_player.y < this.y + this.h &&
       a_player.h + a_player.y > this.y) {
        var texts = ['NO!', 'OUCH!', 'WHY!', 'GAHH!']
        var i = Math.floor(Math.random() * texts.length);
        currentGame.score -= 20;
        currentGame.lives -= 1;
        if(currentGame.lives > 0){
            this.displayText(allTexts, texts[i], a_player.x, a_player.y, .70, 'red');
        }
        a_player.reset();

        // Game over sequence
        if(currentGame.lives <= 0){
            var gameover = ['GAME OVER!', 'YOU LOSE!', 'ARE YOU TRYING?'];
            var i = Math.floor(Math.random() * gameover.length);
            this.displayText(gameOverText, gameover[i], a_player.x - 50, a_player.y, 1.5, 'red');
            a_player.reset();

            // loop to reset collectable items when game ends
            for(var i = 0; i < item_array.length; i++){
                item_array[i].reset();
            }

            // update high score
            if(currentGame.score > currentGame.highScore){
                currentGame.highScore = currentGame.score;
            }
            currentGame.score = 0;
            currentGame.lives = 3;
        }
    }
};


// Draw the enemy on the screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Sub class for the player
var Player = function(){
    this.sprite = "images/char-boy.png";
    this.w = 30;
    this.h = 70;
    this.reset();
};

Player.prototype = Object.create(GameElement.prototype);
Player.prototype.constructor = Player;

Player.prototype.reset = function(){
    this.setCol(2);
    this.setRow(5);
};

Player.prototype.update = function(dt){
    this.x * dt;
    this.y * dt;

    // Winning sequence
    if(this.y < 0){
        this.y = 0;
        currentGame.score += 10;
        var winner = ['WINNER!', 'YES!', 'GOT IT!', 'NICE!'];
        var i = Math.floor(Math.random() * winner.length);
        this.displayText(winnerText, winner[i], canvasWidth / 2, 100, 1, 'green')
        this.reset();
    }
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction){
    // This method will tell the game how to move 
    //the player when certain keys are pressed.
    if(direction === 'left' && this.x > 20){
        this.x -= 100;
    }
    if(direction === 'right' && this.x < 400){
        this.x += 100;
    }
    if(direction === 'up' && this.y > 20){
        this.y -= 90;
    }
    if (direction === 'down' && this.y < 400) {
        this.y += 90;
    }
};


// Collectable items super class
var Item = function(){};
Item.prototype = Object.create(GameElement.prototype);
Item.prototype.constructor = Item;
Item.prototype.alignAxisY = -30;
Item.prototype.width = 75;
Item.prototype.height = 75;

// Test for conditions that would be present during a collision
Item.prototype.itemCollision = function(character){
    if(this.visibility === true &&
       character.x < this.x + this.width &&
       character.x + character.w > this.x &&
       character.y < this.y + this.height &&
       character.h + character.y > this.y)
    {
        return true;
    }
};

// Method that handles the result of an item collision
Item.prototype.itemBoost = function(){

    // First check for a collision with one of the items
    for(var i = 0; i < allItems.length; i++){
        if(allItems[i].itemCollision(player) === true){
            
            // Check if item is a Heart and lives is not maxed out
            if(allItems[i].lives === true && 
               currentGame.lives < 5){
                currentGame.lives += 1;
                this.displayText(allTexts, 'Extra life!', canvasWidth / 2, this.y, 0.8, 'white');
            }
            else{
                currentGame.lives = currentGame.lives
                currentGame.score += allItems[i].points;
                this.displayText(allTexts, '+' + allItems[i].points, this.x, this.y, 0.8, 'yellow');             
            }
            
            // Hide the item
            allItems[i].visibility = false;
        }
    }
};
Item.prototype.randomLocation = function(){
    this.row = this.setRow(Math.floor(Math.random() * 3) + 1);
    this.col = this.setCol(Math.floor(Math.random() * 5));
};
Item.prototype.reset = function(){
    // Change the location of the items
    this.randomLocation();

    // Determine whether item will display
    this.visibility = Math.random() <= this.probability;
};
Item.prototype.update = function(){
    if(player.y <= 0){
        this.reset();
    }
    this.itemBoost();
};


// Sub class for all blue gems
var Blue_Gem = function(){
    this.sprite ='images/gem-blue.png';
    this.points = 2;
    this.probability = .60;
    this.reset();
};
Blue_Gem.prototype = Object.create(Item.prototype);
Blue_Gem.prototype.constructor = Blue_Gem;


// Sub class for all green gems
var Green_Gem = function(){
    this.sprite = 'images/gem-green.png';
    this.points = 4;
    this.probability = .30;
    this.reset();
};
Green_Gem.prototype = Object.create(Item.prototype);
Green_Gem.prototype.constructor = Green_Gem;


// Sub class for all orange gems
var Orange_Gem = function(){
    this.sprite = 'images/gem-orange.png';
    this.points = 20;
    this.probability = .10;
    this.reset();
};
Orange_Gem.prototype = Object.create(Item.prototype);
Orange_Gem.prototype.constructor = Orange_Gem;


// Sub class for all stars
var Star = function(){
    this.sprite = 'images/Star.png';
    this.points = 10;
    this.probability = .20;
    this.reset();
};

Star.prototype = Object.create(Item.prototype);
Star.prototype.constructor = Star;


// Sub class for lives
var Heart = function(){
    this.sprite = 'images/Heart.png';
    this.lives = true;
    this.points = 0;
    this.probability = .10;
    this.reset();
};

Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;


// Sub class for all text that is used in game
var InGameText = function(text, x, y, duration, color){
    this.text = text;
    this.x = x;
    this.y = y;
    this.duration = duration;
    this.color = color;
    this.speed = 70; // pixels per second
};

InGameText.prototype = Object.create(GameElement.prototype);
InGameText.prototype.constructor = InGameText;


InGameText.prototype.update = function(dt){
    // Amount of time to display text
    this.duration -= dt;
    // How to move the text
    this.y -= this.speed * dt;
    this.x -= 60 * dt;
};
InGameText.prototype.updateWinner = function(dt){
    this.duration -= dt;
    this.y -= this.speed * dt;
    this.x += 50 * dt;
};
InGameText.prototype.updateGameOver = function(dt){
    this.duration -= dt;
    this.y -= this.speed * dt;
    this.x * dt;
}

// Methods to uniquely render the different texts
InGameText.prototype.render = function(){
    ctx.font = '30px Impact';
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x + 30, this.y + 120);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeText(this.text, this.x + 30, this.y + 120);
};
InGameText.prototype.renderWinner = function(){
    ctx.font = '40px Impact';
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y + 100);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeText(this.text, this.x, this.y + 100);
};
InGameText.prototype.renderGameOver = function(){
    ctx.font = '50px Impact';
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x - 30, this.y - 120);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeText(this.text, this.x - 30, this.y - 120);
};


// This is where the elements are instantiated

// Create the enemies
var allEnemies = [];
for( var i = 0; i < 3; i++){
    allEnemies.push(new Enemy())
}

// Create the player
var player = new Player();

// Create the collectable items
var allItems = [];
for(var i = 0; i < 4; i++){
    allItems.push(new Blue_Gem());
}
for(var i = 0; i < 3; i++){
    allItems.push(new Green_Gem());
}
for(var i = 0; i < 2; i++){
    allItems.push(new Star());
}
for(var i = 0; i < 1; i++){
    allItems.push(new Orange_Gem());
}
for(var i = 0; i < 1; i++){
    allItems.push(new Heart());
}
// Storage for game text
var allTexts = [];
var winnerText = [];
var gameOverText = [];


// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
