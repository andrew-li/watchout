// start slingin' some d3 here.

var Player = function() {


};


var Enemy = function(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;



};

var enemies = [];

var numEnemies = 20;

for(var i = 0; i < numEnemies; i++) {
  var enemy = new Enemy(Math.random() * 1000 + 50, Math.random() * 700 + 50, 15);
  enemies.push(enemy);
}


d3.select('svg').selectAll('circle')
  .data(enemies)
  .enter()
  .append('circle')
  .attr('cx',function(d){return d.x;})
  .attr('cy',function(d){return d.y;})
  .attr('r',function(d){return d.r;})
  .attr('class','enemy');
