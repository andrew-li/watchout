//helper functions

//function that prevents the passed in function from being invoked again within the given time period
var throttle = function(func, wait) {
    var block = false; //a flag that indicates whether the passed in function should be called or not
    var result; //a variable that holds the most recently returned result from the execution of the passed in function

    //this returned function will execute the passed in function and block future attempts to call it until the block flag is set back to false
    //the block flag will be set back to false after the wait time finishes
    //the function will return the most recently returned result from the execution of the passed in function even while block is true
    return function() {
      if(block !== true) //don't do anything if block is set to true
      {
        block = true; //prevent the function from getting called again
        result = func.apply(this, arguments); //execute the function and update result variable

        //run a function to unblock after the wait time finishes
        setTimeout(function() {
          block = false; //allow the function to be called again
        }, wait);
      }

      return result;
    };
};

//function that increments the collision counter and temporarily changes the background color after a collision
var incrementCollisions = function(context){
  
  //temporarily change the background color after a collision 
  d3.select('svg').style('background-color', 'yellow');
  setTimeout(function() {
    d3.select('svg').style('background-color', 'white')
  }, 2000);

  //increment the collision counter
  context.gameStats.collisionCounter++;

  //update the collision counter
  d3.select('.collisions').select('span').text(context.gameStats.collisionCounter);
};

//set a two second grace period on the collision function after a collision
var incrementCollisionsThrottled = throttle(incrementCollisions, 2000);

//function that updates the highest score and resets the current score to zero after a collision
var updateScore = function(context) {
  //keep track of the best score
  if(context.gameStats.score > context.gameStats.bestScore)
    context.gameStats.bestScore = context.gameStats.score;

  //reset current score and update the start time variable that helps calculate the current score
  context.gameStats.score = 0;
  context.startTime = context.currentTime;

  //update the scores on the screen
  d3.select('.current').select('span').text(context.gameStats.score);
  d3.select('.high').select('span').text(context.gameStats.bestScore);
};


//Watchout class

var Watchout = function() {

  CoolCollisionSystem.call(this);

  this.start();

  //capture the start time to help calculate the current score
  this.startTime = this.currentTime;

};  

Watchout.prototype = Object.create(CoolCollisionSystem.prototype);

Watchout.prototype.constructor = Watchout;

//function that starts the game
Watchout.prototype.start = function() {

  //set the game options
  this.gameOptions = {
    height: 600,
    width: 800,
    numEnemies: 15,
    padding: 20,
    bounds: 1.05
  };

  //set the game stats
  this.gameStats = {
    score: 0,
    bestScore: 0,
    collisionCounter: -1
  };

  //arrays to hold players and enemies (circles)
  this.players = [];
  this.circles = [];

  //create the stage
  d3.select('svg')
  .attr('width', this.gameOptions.width)
  .attr('height', this.gameOptions.height)
  .attr('padding', this.gameOptions.padding)
  ;

  this.canvas = {};
  this.canvas["width"] = this.gameOptions.width;
  this.canvas["height"] = this.gameOptions.height;

  //start the fps counter
  this.fpsCounter = new FpsCounter().start();

  //start the game
  this.loadResources();
  this.warmUp();
  this.loop();
};

//function that creates the players and enemies
Watchout.prototype.loadResources = function() {

  this.players = createPlayer(this.gameOptions); //create the player

  this.circles = createEnemies(this.gameOptions); //create the enemies

};

//function that draws the enemies and queues up the next event
Watchout.prototype.draw = function() {
  var realTime = systemToGameTime(Date.now());
  var wait = gameToSystemTime(e.time - realTime);
  this.last_wait = wait; // Allow the FPS counter to report the last wait time

  this.fpsCounter.tick(); 

  //draw the enemies

  d3.select('svg').selectAll('.enemy')
  .data(this.circles)
  .attr('x',function(d){return d.x - 20.0;})
  .attr('y',function(d){return d.y - 20.0;});

  this.pq.enqueue(new Event(this.currentTime + frameInterval, null, null));
  setTimeout(this.loop.bind(this), wait);
};

//function that continually loops updates the screen by calling other functions
Watchout.prototype.loop = function() {
  while (true) {

    //calculate and update the current score
    
    this.gameStats.score = Math.floor((this.currentTime - this.startTime) * 10);

    d3.select('.current').select('span').text(this.gameStats.score);


    //test enemy collision with player

    var players = this.players; 

    var checkCollision = function(enemy, collidedCallback, context) {
      var player;

      for(var i = 0; i < players.length; i++) {
        player = players[i];

        var radiusSum = 1.2 * (enemy.radius + player.r);
        var xDiff = enemy.x - player.x;
        var yDiff = enemy.y - player.y;

        var separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2) );
        if(separation < radiusSum) { // if touching
          collidedCallback(context);
        }
      }
    };

    var onCollision = function(context) {
      //console.log("collision!");
      updateScore(context);
      incrementCollisionsThrottled(context);
    };

    for(var i = 0; i < this.circles.length; i++) {
      checkCollision(this.circles[i], onCollision, this);
    }


    //predict incoming collisions for enemies with walls and other enemies and move enemies appropriately

    e = this.pq.dequeue();
    if (!e.isValid())
      continue;

    var a = e.circleA;
    var b = e.circleB;

    for(var i = 0, length = this.circles.length; i < length; i++) {
      this.circles[i].move(e.time - this.currentTime, this.canvas.width, this.canvas.height);
    }
    this.currentTime = e.time;

    if(a && b) a.bounceOff(b);
    else if(a && !b) a.bounceOffVerticalWall();
    else if(!a && b) b.bounceOffHorizontalWall();
    else {
      this.draw();
      return;
    }

    this.predict(a);
    this.predict(b);

  }
};
