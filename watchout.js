// start slingin' some d3 here.
//

gameOptions = {
  height: 1000,
  width: 1200,
  nEnemies: 3,
  padding: 20
};

gameStats = {
  score: 0,
  bestScore: 0
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
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
   d.x = d3.event.x;
   return d3.event.x;
  })
  .attr('cy', function(d){
    d.y = d3.event.y;
    return d3.event.y;
  });
};

var drag = d3.behavior.drag().on('drag', dragMove);


// Create enemies
var createEnemies = function(numEnemies) {
  for(var i = 0; i < numEnemies; i++) {
    var enemy = new Enemy(Math.random() * 1000 + 50, Math.random() * 700 + 50, 15);
    enemies.push(enemy);
  }

  d3.select('svg').selectAll('circle.enemy')
  .data(enemies)
  .enter()
  .append('circle')
  .attr('cx',function(d){return d.x;})
  .attr('cy',function(d){return d.y;})
  .attr('r',function(d){return d.r;})
  .attr('class','enemy');

};

// Move enemies every set interval
var interval = 1500;
var moveEnemies = function(){
  return function(){
    d3.select('svg').selectAll('.enemy')
    .transition().duration(1500)
    .attr('cx',function(d){
      var rand = Math.random() * 1000 + 50;
      d.x = rand;
      return rand;
    })
    .attr('cy',function(d){
      var rand = Math.random() * 700 + 50;
      d.y = rand;
      return rand;
    })
    .tween('custom', tweenWithCollisionDetection);

    d3.timer(moveEnemies(), interval);
    return true;
  }
};



var checkCollision = function(enemy, collidedCallback) {
  var player;
  for(var i = 0; i < players.length; i++) {
    player = players[i];

    var radiusSum =  parseFloat(enemy.attr('r')) + player.r;
    var xDiff = parseFloat(enemy.attr('cx')) - player.x;
    var yDiff = parseFloat(enemy.attr('cy')) - player.y;

    var separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2) );
    if(separation < radiusSum) // if touching
      collidedCallback(player, enemy);
  }
};

var tweenWithCollisionDetection = function(endData) { //endData = each enemy instance.

// console.log("starting");
// console.log(d3.select(this).attr('cx'));
// console.log(d3.select(this).attr('cy'));

// console.log("ending");
// console.log(endData);

  var onCollision = function() {
    console.log("collision!");
  };

  var endPos, enemy, startPos;
  enemy = d3.select(this); // starting pos - returns d3 node.
  startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
  };
  endPos = {
    //x: axes.x(endData.x),
    //y: axes.y(endData.y)
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
    return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
  };
};

//call the functions

createPlayer();

createEnemies(gameOptions.nEnemies);

d3.timer(moveEnemies(), interval);
