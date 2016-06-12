/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {

     // 'use strict';

    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */

     // enable the strict mode.
     // this helps to optimize the code.
     // from http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 706;
    doc.body.appendChild(canvas);
    global.canvasWidth = canvas.width;
    // global.canvasHeight = canvas.height;


    // global variables storing the number of rows and columns in the game
    var numRows = 6;
    var numCols = 5;
    // global.numRows = numRows;
    // global.numCols = numCols;


    // variable to keep track of the current score, highest score, and lives remaining
    var currentGame = {
        'score' : 0,
        'highScore' : 0//,
        // 'lives' : 0
    };

    // helper function that displays animated pop up text for a short period of time
    // credit shikeyou

    // function displayText(text, col, row, duration, color){
    //     allTexts.push(new InGameText(text, col, row, duration, color));
    // }

    // // shuffles an array
    // //from http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript                      // This is called in resetCollectables. Reference the link in our code

    // function shuffle(o){
    //     for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    //         return o;
    // }


    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        // gameOver();
        lastTime = Date.now();
        main();
    }

    // Update the game and perform collision checks

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
        // updateCurrentGame();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {

        // update power up collectables
        // allPowerups.forEach(function(powerup){
        //     powerup.update(dt);
        // });

        // update enemies
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        // update the player character
        player.update();

        // update the pop up texts
        // allTexts.forEach(function(text){
        //     text.update(dt);
        // });

        // remove pop ups shortly after they are displayed
        // credit shikeyou
        // for(var i = allTexts.length - 1; i >= 0; i--){
        //     if(allTexts[i].duration < 0){
        //         allTexts.splice(i, 1);
        //     }
        // }

        // gem.update();

        // ScoreKeeper.update();
    }

    // function checkCollisions(){

    //     //first check for a collision with power ups.
    //     for(var i = 0, len = allPowerups.length; i < len; i++){
    //         if(allPowerups[i].collectableCollision(player)){

    //             // hide collectable after collision
    //             allPowerups[i].visability = false;

    //             // if collectable is a gem or star add points to game score.
    //             // display text so the player knows how many points they just received
    //             if(allPowerups[i] === Blue_Gem ||
    //                allPowerups[i] === Green_Gem ||
    //                allPowerups[i] === Orange_Gem ||
    //                allPowerups[i] === Star) {
    //                 currentGame.score += allPowerups[i].points;
    //                 displayText('+' + allPowerups[i].points, (Math.floor(allPowerups[i].x / 101)), allPowerups[i].row, .70, 'green');
                    
    //                 //only one power up can be collected at a time
    //                 break;
    //             }
    //             // otherwise add a life unless there are already 5 lives.
    //             // display text so the player knows that they received a life or that 
    //             // they reached the maximum five lives allowed.
    //             else if(allPowerups[i] === Heart){
    //                 currentGame.lives += allPowerups[i].lives;
    //                 displayText("You're ALIVE!", (Math.floor(allPowerups[i].x / 101)), allPowerups.row, .70, 'green');
    //                 if(currentGame.lives > allPowerups[i].maxValue){
    //                     currentGame.lives = allPowerups[i].maxValue;
    //                     displayText("Maximum reached", (Math.floor(allPowerups[i].x / 101)), allPowerups[i].row, .70, 'yellow');
                    
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // }

    // function updateCurrentGame(){

    //     // if the player reaches the water, add points, display a text,
    //     // and move the player back to its starting position.
    //     if(player.row === 0){
    //         var texts = ['WINNER!', 'UNSTOPPABLE!', 'CHICKEN DINNER!'];
    //         var i = Math.floor(Math.random() * 3);

    //         currentGame.score += 8;
    //         displayText('+8' + texts[i], player.col, player.row, .70, 'white');
    //         resetPlayer();
    //     }
    // }

    // Now it is time to render our elements

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */

    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */

         // clear the canvas first so we don't have elements overlapping.
         // try changing the width and height to canvasWidth and canvasHeight
         // same effect?
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        // render the score, highscore, and lives
        ctx.font = "32px Impact";
        ctx.fillStyle = 'black';
        ctx.fillText("Score: " + currentGame.score, 0, 640);
        ctx.fillText("High Score: " + currentGame.highScore, 0, 40);
        // ctx.fillText("Lives x" + currentGame.lives, 270, 640);

        renderEntities();

        // ScoreKeeper();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */

        // render power ups first, have to do it row by row to avoid
        // overlapping. Start by sorting them into rows. credit shikeyou
        // var sorter = {1: [], 2: [], 3: []};
        // for(var i = 0, len = allPowerups.length; i < len; i++){
        //     sorter[allPowerups[i].row].push(allPowerups[i]);
        // }
        // // render row by row.
        // for(i = 1; i <= 3; i++){
        //     for(var j = 0, len = sorter[i].length; j < len; j++){
        //         sorter[i][j].render();
        //     }
        // }

        // render our player next
        player.render();

        // followed by the enemies
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        // rend the texts last
        // allTexts.forEach(function(text){
        //     text.render();
        // });

        // gem.render();
    }

    // Our game resets

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    // function gameOver() {
        
    //     // when game ends, player moves back to its initial position and
    //     // the score is put back to zero. If the score of the previous
    //     // game is higher than our high score then we change highScore

    //     resetPlayer();

    //     if(currentGame.score > currentGame.highScore){
    //         currentGame.highScore = currentGame.score;
    //     }
    //     currentGame.score = 0;
    // }

    // //reset the players position and power ups without resetting the whole game
    // function resetPlayer(){
    //     player.reset();
    //     resetPowerups();
    // }
    
    // // reset the position and whether the power up will be visible or not
    // function resetPowerups(){

    //     // first shuffle an array from 0 - 14 because there are 15 total squares
    //     var shuffledList = shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);

    //     // next loop through the power ups, grab an item from the shuffledList
    //     // array and store it in a variable.
    //     for(var i = 0, len = allPowerups.length; i < len; i++){
            
    //         var n = shuffledList[i];

    //         // this will ensure none of the columns are greater than 4.
    //         allPowerups[i].setCol(n % 5);

    //         // this will ensure none of the rows are greater than 3.
    //         allPowerups[i].setRow(Math.floor(n / 5) + 1);

    //         // finally, we determine whether the power up will be visible
    //         // based on its probability
    //         allPowerups[i].visability = Math.random() <= allPowerups[i].probability;
    //     }
    // }

    // To conclude, we will load all of our elements resources.

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'//,
        // 'images/gem-blue.png',
        // 'images/gem-green.png',
        // 'images/gem-orange.png',
        // 'images/Star.png',
        // 'images/Heart.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
