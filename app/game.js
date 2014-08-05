/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

var GOFOURTH = {},
    C_WIDTH = 500,
    C_HEIGHT = C_WIDTH,
    ctx, headerHeight, midX, midY; 

GOFOURTH.game = (function() {
  var frameLength = 30,
    assets = [
      'assets/img/rocket-up.png',
      'assets/img/rocket-right.png',
      'assets/img/rocket-down.png',
      'assets/img/rocket-left.png'
    ],
    backgroundImg = new Image(),
    fourthOpacity = {
      topLeft: 30,
      topRight: 30,
      bottomLeft: 30,
      bottomRight: 30
    },
    $canvas, canvas;

  headerHeight = 80;

  backgroundImg.onload = function() {
    drawBoard(); 
  };

  backgroundImg.src = 'assets/img/background.jpg';

  function initialize() {
    $canvas = $('#canvas');
    canvas = $canvas[0];
    ctx = canvas.getContext('2d');

    canvas.width = C_WIDTH;
    canvas.height = C_HEIGHT;

    midX = C_WIDTH/2;
    midY = (headerHeight + C_HEIGHT)/2;

    gameLoop();
  }

  function restoreDefaultOpacity() {
    for(var f in fourthOpacity) fourthOpacity[f] = 30; 
  }

  function drawBoard() {
    var quadWidth = canvas.width/2,
      quadHeight = (canvas.height - headerHeight)/2;

    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,185,15,0.' + fourthOpacity.topLeft + ')';
    ctx.fillRect(0, headerHeight, quadWidth, quadHeight);
    ctx.fillStyle = 'rgba(125,38,205,0.' + fourthOpacity.topRight + ')';
    ctx.fillRect(quadWidth, headerHeight, quadWidth, quadHeight);
    ctx.fillStyle = 'rgba(127,255,0,0.' + fourthOpacity.bottomLeft + ')';
    ctx.fillRect(0, midY, quadWidth, quadHeight);
    ctx.fillStyle = 'rgba(205,0,0,0.' + fourthOpacity.bottomRight + ')';
    ctx.fillRect(quadWidth, midY, quadWidth, quadHeight);

    restoreDefaultOpacity();
  }

  function gameLoop() {
    update();
    draw();

    setTimeout(gameLoop, frameLength);
  }

  function update() {
    if(keydown.left) GOFOURTH.rocket.move.left(); 
    if(keydown.right) GOFOURTH.rocket.move.right();
    if(keydown.up) GOFOURTH.rocket.move.up();
    if(keydown.down) GOFOURTH.rocket.move.down();
    updateRocketFourth(GOFOURTH.rocket);
  }

  function updateRocketFourth(rocket) {
    inTopLeft(rocket) || inTopRight(rocket) || inBottomLeft(rocket) || inBottomRight(rocket) 
  }

  function inTopLeft(obj) {
    if(obj.getX() < midX && obj.getY() < midY) {
      return fourthOpacity.topLeft = 50;
    } 
  }

  function inTopRight(obj) {
    if(obj.getX() > midX && obj.getY() < midY) {
      return fourthOpacity.topRight = 50;
    } 
  }

  function inBottomLeft(obj) {
    if(obj.getX() < midX && obj.getY() > midY) {
      return fourthOpacity.bottomLeft = 50;
    } 
  }

  function inBottomRight(obj) {
    if(obj.getX() > midX && obj.getY() > midY) {
      return fourthOpacity.bottomRight = 50;
    } 
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    GOFOURTH.rocket.draw(); 
  }

  return {
    initialize: initialize
  };
})();

GOFOURTH.rocket = (function() {
  var x = C_WIDTH/2,
    y = (C_HEIGHT/2 + headerHeight/2),
    frame = 0,
    width = 49, height = 49,
    rocketImg = new Image(),
    rocketLoaded = false;
    move = {},
    maxX = C_WIDTH - width/2,
    minX = width/2,
    maxY = C_HEIGHT - height/2,
    minY = headerHeight + height/2;

  rocketImg.onload = function() {
    rocketLoaded = true; 
  };

  rocketImg.src = 'assets/img/rocket-sprite.png';

  function draw() {
    if(!rocketLoaded) return;
    ctx.drawImage(rocketImg, frame * width, 0, width, height,  x - width/2, y - height/2, width, height);  
  }

  move.right = function moveRight() {
    x = x.clamp(x + 10, maxX); 
    frame = 2;
  };

  move.up = function moveUp() {
    y = y.clamp(minY + 10, maxY) - 10;
    frame = 0;
  };

  move.left = function moveLeft() {
    x = x.clamp(minX + 10, maxX) - 10; 
    frame = 3;
  };

  move.down = function moveDown() {
    y = y.clamp(y + 10, maxY);
    frame = 1;
  };

  return {
    draw: draw,
    move: move,
    getX: function() { return x; },
    getY: function() { return y; }
  }
})();

$(document).ready(function() {
  GOFOURTH.game.initialize();
});
