/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on the player and enemy objects (defined in the app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When the player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we will be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 706;
    doc.body.appendChild(canvas);
    global.canvasWidth = canvas.width;

    var numRows = 6;
    var numCols = 5;
    global.numRows = numRows;
    global.numCols = numCols;

    // Variable to keep track of the current score, 
    // high score, and lives remaining
    var currentGame = {
        'score' : 0,
        'highScore' : 0,
        'lives' : 3
    };
    global.currentGame = currentGame;


    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if the game
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
        lastTime = Date.now();
        main();
    }


    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. 
     */
    function update(dt) {
        updateEntities(dt);
    }


    /* This is called by the update function and loops through all of the
     * objects within the allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for the
     * player object.  
     */

    // Remove pop ups shortly after they are displayed
    // Credit: shikeyou
    function removeText(text_array){
        for(var i = text_array.length - 1; i >= 0; i--){
            if(text_array[i].duration < 0){
                text_array.splice(i, 1);
            }
        }
    }

    function updateEntities(dt) {

        // update item collectables
        allItems.forEach(function(item){
            item.update(dt);
        });

        // update enemies
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        // update the player character
        player.update();

        // update the pop up texts
        allTexts.forEach(function(text){
            text.update(dt);
        });
        removeText(allTexts);

        winnerText.forEach(function(text){
            text.updateWinner(dt);
        });
        removeText(winnerText);

        gameOverText.forEach(function(text){
            text.updateGameOver(dt);
        });
        removeText(gameOverText);
    }


    /* This function initially draws the "game level", it will then call
     * the renderEntities function. 
     */

    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */

        // Clear the canvas first so we don't have elements overlapping.
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

        // Render the score, highscore, and lives
        ctx.font = "32px Impact";
        ctx.fillStyle = 'black';
        ctx.fillText("Score: " + currentGame.score, 0, 640);
        ctx.fillText("High Score: " + currentGame.highScore, 0, 40);
        ctx.fillText("Lives: " + currentGame.lives, 400, 640);

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions that are defined
     * on the enemy and player entities within app.js
     */

    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function.
         */

        // Render items
        allItems.forEach(function(item){
            item.render();
        })

        // Render our player next
        player.render();

        // Followed by the enemies
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        // Render the texts last
        allTexts.forEach(function(text){
            text.render();
        });

        winnerText.forEach(function(text){
            text.renderWinner();
        });

        gameOverText.forEach(function(text){
            text.renderGameOver();
        });
    }


    /* Load all of the images we're going to need to draw our game 
     * level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/gem-blue.png',
        'images/gem-green.png',
        'images/gem-orange.png',
        'images/Star.png',
        'images/Heart.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that it can be used more easily
     * from within the app.js file.
     */
    global.ctx = ctx;
})(this);
