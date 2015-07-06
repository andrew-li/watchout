
var Enemy = function(x, y, radius, mass, vX, vY) {
  Circle.call(this, x, y, radius, mass, vX, vY);
};

Enemy.prototype = Object.create(Circle.prototype);

Enemy.prototype.constructor = Enemy;

Enemy.prototype.drawIn = function(context) {
};


//function to initialize enemies
var createEnemies = function(gameOptions) {
  var enemies = [];

  for(var i = 0; i < gameOptions.numEnemies; ++i) {

      var x = Math.random() * gameOptions.width / gameOptions.bounds + 10;
      var y = Math.random() * gameOptions.height / gameOptions.bounds;
      var radius = 15;
      var mass = radius / 2;
      var vX = Math.random() * gameOptions.width / gameOptions.bounds + 10;
      var vY = Math.random() * gameOptions.height / gameOptions.bounds;

      enemies.push(new Enemy(x, y, radius, mass, vX, vY));
  }

  d3.select('svg').selectAll('image.enemy')
  .data(enemies)
  .enter()
  .append('svg:image')
  .attr('x',function(d){return d.x - 20.0;})
  .attr('y',function(d){return d.y - 20.0;})
  .attr('r',function(d){return d.radius;})
  .attr('width',function(d){return 2.5 * d.radius;})
  .attr('height',function(d){return 2.5 * d.radius;})
  .attr('xlink:href',"shuriken.png")
  .attr('class','enemy');

  return enemies;
};

