// Initial helper method
// credit to shikeyou

Number.prototype.fit = function(oldMin, oldMax, newMin, newMax){
    return (this - 0) / (oldMax - oldMin) * (newMax- newMin) + newMin;
};

// Super class and constructor function for everything in the game

var GameElement = function(){};

// requirements to be a game element
GameElement.prototype.x = 0;
GameElement.prototype.y = 0;
GameElement.prototype.row = 0;
GameElement.prototype.col = 0;
GameElement.prototype.alignAxisX = 0;
GameElement.prototype.alignAxisY = 0;
GameElement.prototype.visability = true;

// shared methods
// GameElement.prototype.update = function(dt){};
// GameElement.prototype.render = function(){
//     if(this.visability){
//         ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
//     }
// };
GameElement.prototype.setCol = function(col){
    this.col = col;
    this.x = col * 101 + this.alignAxisX;
};
GameElement.prototype.setRow = function(row){
    this.row = row;
    this.y = row * 83 + this.alignAxisY;
};

//Enemy speeds and possible y coordinates
// var speedArray = [25, 50, 75, 100, 250, 500];

// var yArray = [60, 140, 230];

//Gem x and y coordinates
// var gemXArray = [2, 275., 300];
// var gemYArray = [200, 150, 80];

// Class that draws the score keeper
// var ScoreKeeper = function(){
//     // ctx.clearRect(410, 40, 100, 0);
//     ctx.font = "bold 16px Arial";
//     ctx.fillStyle = "#0000";
//     ctx.fillText("Score: "+ player.score, 410, 40);
    // if (player.y < 30) {
    //     ctx.clearRect(410, 40, ctx.width, ctx.height);
    //     ctx.fillText("Score: "+ player.score, 410, 40);
    // }
// };

// ScoreKeeper.prototype.update = function(){
    // if player.y is less than 30 and 
    // enemyCollisions(player) is true
    // then clear the rectangle
    // an fillText again with the updated score
//     Enemy.call(this);
//     if (player.y < 30 ||
//         this.enemyCollisions(player) === true) 
//         {
//             ctx.clearRect(410, 40);
//             ctx.beginPath();
//             ctx.fillText("Score: "+ player.score, 410, 40);
//             ctx.closePath();
//         }
// };

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.alignAxisY = -30;
    // this.x = -5;
    // this.y = yArray[Math.floor(Math.random() * yArray.length)];
    // this.randSpeed = speedArray[Math.floor(Math.random() * speedArray.length)];
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

// var makeRandomSpeed = function(){
//     // Enemy.call(this);
//     this.speedArray = [50,100,500,1000];
//     this.randSpeed = this.speedArray[Math.floor(Math.random() * this.speedArray.length)];
    // console.log(randSpeed);
// };
// makeRandomSpeed.prototype = Object.create(Enemy.prototype);

// var makeRandomY = function(){
//     // Enemy.call(this);
//     this.yArray = [60, 140, 230];
//     this.randY = this.yArray[Math.floor(Math.random() * this.yArray.length)];
// };
// makeRandomY.prototype = Object.create(Enemy.prototype);

Enemy.prototype.reset = function() {

    // picks a row from 1 to 3 on the rock ground
    this.setRow(Math.floor(Math.random() * 3) + 1);

    // pick a random speed for each enemy on reset
    this.speed = Math.floor(Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed);

    // makes sure to start the enemy off screen to the left on reset
    // credit to shikeyou
    this.x = -Math.random().fit(0, 1, this.minDelay, this.maxDelay) * this.speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.


    // Code that moves the enemies
    this.x += this.speed * dt;
    if(this.x > canvasWidth) {
        this.reset();
    }


    // Code that handles collisions
    this.enemyCollisions(player);

    // if(this.x === player.x && this.y === player.y){
    //     console.log("Got it!")
        // player.update() = 200;
        // player.update() = 400;
        // this.x = -5;
        // this.y = yArray[Math.floor(Math.random() * yArray.length)]; 
    // }
};

Enemy.prototype.enemyCollisions = function(a_player){
    // for(var i = 0; i < allEnemies.length; i++){
    //     if (allEnemies[i].x < player.x + 75 &&
    //         allEnemies[i].x + 30 > player.x &&
    //         allEnemies[i].y < player.y + 10 &&
    //         allEnemies[i].y + player.y + 20) 
    //     {
    //         player.reset();
    //         player.score -= 100;
    //     }
    // }
    if(a_player.x < this.x + this.w &&
       a_player.x + a_player.w > this.x &&
       a_player.y < this.y + this.h &&
       a_player.h + a_player.y > this.y) {
        // a_player.x = 200;
        // a_player.y = 400;
        // if currentGame does not exist then make it a global object
        // in engine.js. Same goes for displayText.
        // var texts = ['WTF!', 'OUCH!', 'WHY!', 'AHH!', 'DAMNIT!']
        // var i = Math.floor(Math.random() * 5);
        // currentGame.score -= 20;
        // currentGame.lives -= 1;
        // displayText(texts[i], a_player.col, a_player.row, .70, 'red');
        a_player.reset();
        // if(currentGame.lives === 0){
            // if gameOver doesn't exist, make it global
            // gameOver();

            // return;
        }
        // return;
    }
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    this.sprite = "images/char-boy.png";
    // this.x = 200;
    // this.y = 400;
    this.w = 30;
    this.h = 70;
    // this.score = 0;
    this.reset();
};

Player.prototype = Object.create(GameElement.prototype);
Player.prototype.constructor = Player;

// Player.prototype.collisonCheck = function(){
//     this.box = [this.x, this.y, this.w, this.h];

//     for(var i = 0; i < allEnemies.length; i++){
//         allEnemies[i].box = [allEnemies[i].x, allEnemies[i].y, allEnemies[i].w, allEnemies[i].h];
//         if(this.box.x < allEnemies[i].box.x + allEnemies[i].w &&
//            this.box.x + this.box.w > allEnemies[i].x &&
//            this.box.y < allEnemies[i].box.y + allEnemies[i].box.h &&
//            this.box.h + this.box.y > allEnemies[i].y){
//             this.x = 200;
//             this.y = 400;
//         }
//     }
// };

// Player.prototype.collisonCheck = function(enemy){
//     var playerBox, enemyBox;

//     playerBox = [this.x, this.y, this.w, this.h];
//     enemyBox = [enemy.x, enemy.y, enemy.w, enemy.h];

//     if(playerBox.x < enemyBox.x + enemyBox.w &&
//        playerBox.x + playerBox.w > enemyBox.x &&
//        playerBox.y < enemyBox.y + enemyBox.h &&
//        playerBox.h + playerBox.y > enemyBox.y) {
//         this.x = 200;
//         this.y = 400;
//         enemy.x = -5;
//         enemy.y = yArray[Math.floor(Math.random() * yArray.length)];
//     }

// };


Player.prototype.reset = function(){
    // if(this.y < 30){
    //     // ctx.clearRect(410, 40);
    //     alert("You're a WINNER!")
    //     player.score += 100;
    //     this.x = 200;
    //     this.y = 400;
    // }
    this.x = 200;
    this.y = 400;
};

Player.prototype.update = function(dt){
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x * dt;
        this.y * dt;
        if(this.y < 0){
            this.y = 0;
            // think about creating an array of 
            // winning alerts and looping through
            // to display a different message each
            // time the player reaches the water
            // alert("Congrats, winner!");
            // player.score += 10;
            this.reset();
        }
        // if(this.collisonCheck() === true){
        //     this.x = 200;
        //     this.y = 400;
        // }
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction){
    // This method will tell how game how to move the player when certain keys
    // a pressed.
    if(direction === 'left' && this.x > 20){
        this.x -= 100;
    }
    if(direction === 'right' && this.x < 400){
        this.x += 100;
    }
    if(direction === 'up' && this.y > 20){
        this.y -= 84;
    }
    if (direction === 'down' && this.y < 400) {
        this.y += 84;
    }
};

// Collectable superclass
// credit to shikeyou

// var Powerups = function(){};
// Powerups.prototype = Object.create(GameElement.prototype);
// Powerups.prototype.constructor = Powerups;
// Powerups.prototype.alignAxisY = -30;

// Powerups.prototype.collectableCollision = function(character){
//     return (
//         (this.visability === true) &&
//         (this.row === character.row) &&
//         (this.x + 101 > character.x) &&
//         (this.x < character.x + 101)
//     );
// };

// // Subclass for all blue gems

// var Blue_Gem = function(){
//     // this.sprite = ['images/gem-blue.png', 'images/gem-green.png', 'images/gem-orange.png'];
//     // var gemArray = ['images/gem-blue.png', 'images/gem-green.png', 'images/gem-orange.png'];
//     // this.x = gemXArray[Math.floor(Math.random() * gemXArray.length)];
//     // this.y = gemYArray[Math.floor(Math.random() * gemYArray.length)];
//     // this.x = [100, 400, 300];
//     // var gemXArray = [100, 400, 300];
//     // this.y = [220, 50, 150]; 
//     // var gemYArray = [220, 50, 150]; 

//     // blue gem if statement
//     // if (player.score === 200) {
//     //     this.sprite = gemArray[0];
//     //     this.x = gemXArray[0];
//     //     this.y = gemYArray[0];
//     // }
//     this.sprite ='images/gem-blue.png';
//     this.points = 2;
//     this.probability = .60;
// };
// Blue_Gem.prototype = Object.create(Powerups.prototype);
// Blue_Gem.prototype.constructor = Blue_Gem;

// // Subclass for all green gems

// var Green_Gem = function(){
//     this.sprite = 'images/gem-green.png';
//     this.points = 4;
//     this.probability = .30;
// };
// Green_Gem.prototype = Object.create(Powerups.prototype);
// Green_Gem.prototype.constructor = Green_Gem;

// // Subclass for all orange gems

// var Orange_Gem = function(){
//     this.sprite = 'images/gem-orange';
//     this.points = 20;
//     this.probability = .10;
// };
// Orange_Gem.prototype = Object.create(Powerups.prototype);
// Orange_Gem.prototype.constructor = Orange_Gem;

// // Subclass for all stars

// var Star = function(){
//     this.sprite = 'images/Star.png';
//     this.points = 10;
//     this.probability = .20;
// };

// Star.prototype = Object.create(Powerups.prototype);
// Star.prototype.constructor = Star;

// // Subclass for lives

// var Heart = function(){
//     this.sprite = 'images/Heart.png';
//     this.lives = 1;
//     this.maxValue = 5;
//     this.probability = .10;
// };

// // var blueGem = function(){
// //     Gem.call(this,sprite, x, y);
// //     this.sprite = this.sprite[0];
// //     this.x = this.x[0];
// //     this.y = this.y[0];
// // };

// // blueGem.prototype = Object.create(Gem.prototype);

// // Gem.prototype.render = function(){
// //     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// // };

// // Gem.prototype.update = function(){
// //     if (player.score === 200) {
// //         this.x = gemXArray[0];
// //         this.y = gemYArray[0];
// //     }
// // };

// // Player.prototype = Object.create(Enemy.prototype);

// // Now instantiate your objects.
// // Place all enemy objects in an array called allEnemies
// // Place the player object in a variable called player


// // ** Think about creating variables to store the
// // initial y coordinate for each row to make
// // the code more readable. **

// // var enemy_row_one = new Enemy(60);
// // var enemy_row_two = new Enemy(makeRandomSpeed(), makeRandomY());
// // var enemy_row_three = new Enemy(makeRandomSpeed(), makeRandomY());


// Subclass for all text that is used in game

var InGameText = function(text, col, row, duration, color){
    this.text = text;
    this.setCol(col);
    this.setRow(row);
    this.duration = duration;
    this.color = color;
    this.speed = 50; // pixels per second
};

InGameText.prototype = Object.create(InGameText.prototype);
InGameText.prototype.constructor = InGameText;
InGameText.prototype.update = function(dt){
    this.duration -= dt;
    this.y -= this.speed * dt;
};
InGameText.prototype.render = function(){
    ctx.font = '30px Impact';
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x + 30, this.y + 120);
};


// This is where the objects are instantiated.

var allEnemies = [];
for( var i = 0; i < 3; i++){
    allEnemies.push(new Enemy())
}

// var enemy_one = new Enemy();
// var enemy_two = new Enemy();
// var enemy_three = new Enemy();
// var enemy_four = new Enemy();
// var enemy_five = new Enemy();
// var enemy_six = new Enemy();
// var enemy_seven = new Enemy();
// var enemy_eight = new Enemy();
// var enemy_nine = new Enemy();
// var enemy_ten = new Enemy();

// var allEnemies = [
//     enemy_one,
//     enemy_two,
//     enemy_three,
//     // enemy_four,
//     // enemy_five,
//     // enemy_six,
//     // enemy_seven,
//     // enemy_eight,
//     // enemy_nine,
//     // enemy_ten
// ];

var player = new Player();
// player.reset();
// player.render();
// console.log(player.x);
// console.log(player.update(x));

var allPowerups = [];
for(var i = 0; i < 4; i++){
    allPowerups.push(new Blue_Gem());
}
for(var i = 0; i < 3; i++){
    allPowerups.push(new Green_Gem());
}
for(var i = 0; i < 2; i++){
    allPowerups.push(new Star());
}
for(var i = 0; i < 1; i++){
    allPowerups.push(new Orange_Gem());
}
for(var i = 0; i < 1; i++){
    allPowerups.push(new Heart());
}


// for the storage of in game text
var allTexts = [];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


