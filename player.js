var Player = function(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
};

// Create player
var createPlayer = function(gameOptions) {
  var player = new Player(500, 350, 15);

  var players = [];

  players.push(player);


  // Make draggable

  var dragMove = function() {

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


  //draw the player and set its options

  d3.select('svg').selectAll('circle')
  .data(players)
  .enter()
  .append('circle')
  .attr('cx',function(d){return d.x;})
  .attr('cy',function(d){return d.y;})
  .attr('r',function(d){return d.r;})
  .attr('class','player')
  .call(drag);


  return players;
};

