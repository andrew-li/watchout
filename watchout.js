// start slingin' some d3 here.

gameOptions = {
  height: 600,
  width: 800,
  nEnemies: 40,
  padding: 20,
  bounds: 1.05
};

gameStats = {
  score: 0,
  bestScore: 0
};

var Player = function(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
};

var Enemy = function(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
};

d3.select('svg')
.attr('width', gameOptions.width)
.attr('height', gameOptions.height)
.attr('padding', gameOptions.padding)
;

var players = [];
var enemies = [];

var collisionCounter = 0;

// Create player
var createPlayer = function() {
  var player = new Player(500, 350, 15);

  players.push(player);

  d3.select('svg').selectAll('circle')
  .data(players)
  .enter()
  .append('circle')
  .attr('cx',function(d){return d.x;})
  .attr('cy',function(d){return d.y;})
  .attr('r',function(d){return d.r;})
  .attr('class','player')
  .call(drag);
};

// Make draggable
var dragMove = function() {
// console.log(players);

  d3.select(this)
  .attr('cx', function(d){
     if(d3.event.x >= gameOptions.width - d.r){
      d.x = gameOptions.width - d.r;
     }
     else if(d3.event.x <= d.r){
      d.x = d.r;
     }else{
      d.x = d3.event.x;
     }
     return d.x;
  })
  .attr('cy', function(d){
     if(d3.event.y >= gameOptions.height - d.r){
      d.y = gameOptions.height - d.r;
     }
     else if(d3.event.y <= d.r){
      d.y = d.r;
     }else{
      d.y = d3.event.y;
     }
     return d.y;
  });
};

var drag = d3.behavior.drag().on('drag', dragMove);


// Create enemies
var createEnemies = function(numEnemies) {
  for(var i = 0; i < numEnemies; i++) {
    var enemy = new Enemy(Math.random() * gameOptions.width/gameOptions.bounds + 10, Math.random() * gameOptions.height/gameOptions.bounds, 15);
    enemies.push(enemy);
  }

  d3.select('svg').selectAll('image.enemy')
  .data(enemies)
  .enter()
  .append('svg:image')
  .attr('x',function(d){return d.x;})
  .attr('y',function(d){return d.y;})
  .attr('r',function(d){return d.r;})
  .attr('width',function(d){return 2 * d.r;})
  .attr('height',function(d){return 2 * d.r;})
  .attr('xlink:href',"shuriken.png")
  .attr('class','enemy');
};

// Move enemies every set interval
var interval = 1500;
var moveEnemies = function(){
  return function(){
    d3.select('svg').selectAll('.enemy')
    .transition().duration(1500)
    .attr('x',function(d){
      var rand = Math.random() * gameOptions.width/gameOptions.bounds + 10;
      d.x = rand;
      return rand;
    })
    .attr('y',function(d){
      var rand = Math.random() * gameOptions.height/gameOptions.bounds;
      d.y = rand;
      return rand;
    })
    .tween('custom', tweenWithCollisionDetection);

    d3.timer(moveEnemies(), interval);
    return true;
  }
};




var tweenWithCollisionDetection = function(endData) { //endData = each enemy instance.

  var checkCollision = function(enemy, collidedCallback) {
    var player;
    for(var i = 0; i < players.length; i++) {
      player = players[i];

      var radiusSum =  parseFloat(enemy.attr('r')) + player.r;
      var xDiff = parseFloat(enemy.attr('x')) - player.x;
      var yDiff = parseFloat(enemy.attr('y')) - player.y;

      var separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2) );
      if(separation < radiusSum) // if touching
        collidedCallback(player, enemy);
    }
  };


  var onCollision = function() {
    console.log("collision!");
    startGame();

  };

  var endPos, enemy, startPos;
  enemy = d3.select(this); // starting pos - returns d3 node.
  startPos = {
    x: parseFloat(enemy.attr('x')),
    y: parseFloat(enemy.attr('y'))
  };
  endPos = {
    x: (endData.x),
    y: (endData.y)
  };
  return function(t) {
    var enemyNextPos;
    checkCollision(enemy, onCollision);
    enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };
    return enemy.attr('x', enemyNextPos.x).attr('y', enemyNextPos.y);
  };
};

//call the functions

createPlayer();
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

var increment = function(){
  collisionCounter++;
};

var incr = throttle(increment,2000);
var currentTime = 0;
var highTime = 0;

var startGame = function(){
    //reset game
    enemies = [];
    d3.select('svg').selectAll('image.enemy').remove();
    incr();
    //update the collision counter
    d3.select('.collisions').select('span').text(collisionCounter);

    //if current score > high score
    if(currentTime > highTime){
      //set high score
      highTime = currentTime;
    }
    //reset current score to 0
    currentTime = 0;

  createEnemies(gameOptions.nEnemies);

};

startGame();
var currentTimer = function(){
      currentTime++;
      d3.select('.current').select('span').text(currentTime);
      d3.select('.high').select('span').text(highTime);
};
setInterval(currentTimer,1000);
d3.timer(moveEnemies(), interval);

