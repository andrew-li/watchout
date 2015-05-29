function Event(time, circleA, circleB) {
  this.time = time;
  this.circleA = circleA;
  this.circleB = circleB;

  var countA = circleA ? circleA.count : -1;
  var countB = circleB ? circleB.count : -1;

  this.isValid = function(e) {
    if(circleA && circleA.count != countA){ return false; }
    if(circleB && circleB.count != countB){ return false; }
    return true;
  };
};
function eventComparator(a, b) {
  return a.time > b.time ? 1 : a.time == b.time ? 0 : -1;
};
//change speed to 0.05
//var speed = 1;
var speed = 0.05;
var fps = 60,
    frameInterval = systemToGameTime(1 / fps * 1000);

function systemToGameTime(msec) {
  return msec * speed / 100;
};

function gameToSystemTime(time) {
  return time / speed * 100;
};


var CoolCollisionSystem = function() {

  CollisionSystem.call(this);

  this.currentTime = 0;
  this.pq = new PriorityQueue(eventComparator);

};

CoolCollisionSystem.prototype = Object.create(CollisionSystem.prototype);

CoolCollisionSystem.prototype.constructor = CoolCollisionSystem;

CoolCollisionSystem.prototype.warmUp = function() {
  this.currentTime = systemToGameTime(Date.now());

  for(var i = 0, length = this.circles.length; i < length; i++) {
    this.predict(this.circles[i]);
  }

  //first draw
  this.pq.enqueue(new Event(this.currentTime + frameInterval, null, null));
};

CoolCollisionSystem.prototype.predict = function(circle) {
  if(!circle) return;

  for(var i = 0, length = this.circles.length; i < length; i++) {
    var circleToHit = this.circles[i];
    var dt = circle.timeToHit(circleToHit);
    if(dt > 0 && dt < this.circles.length/2)
      this.pq.enqueue(new Event(this.currentTime + dt, circle, circleToHit));
  }

  var dtX = circle.timeToHitVerticalWall(this.canvas.width);
  var dtY = circle.timeToHitHorizontalWall(this.canvas.height);

  this.pq.enqueue(new Event(this.currentTime + dtX, circle, null));
  this.pq.enqueue(new Event(this.currentTime + dtY, null, circle));
};

//this.oldDraw = this.draw;
CoolCollisionSystem.prototype.draw = function() {
  var realTime = systemToGameTime(Date.now());
  var wait = gameToSystemTime(e.time - realTime);
  this.last_wait = wait; // Allow the FPS counter to report the last wait time

  //call draw function of parent class
  //this.oldDraw();
  CollisionSystem.prototype.draw.call(this);

  this.pq.enqueue(new Event(this.currentTime + frameInterval, null, null));
  setTimeout(this.loop.bind(this), wait);
};

CoolCollisionSystem.prototype.loop = function() {
  while (true) {
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

