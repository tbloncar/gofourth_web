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

var LEVELS = [
  {
    question: "sqrt(5! + (-1))",
    choicesArr: [22, 12, 5, 11],
    answerIndex: 3
  },
  {
    question: "7!/6!",
    choicesArr: [1, 7, 42, 6],
    answerIndex: 1
  }
];

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
      topLeft: 10,
      topRight: 10,
      bottomLeft: 10,
      bottomRight: 10
    },
    fontSize = 24,
    timer = 500,
    level = 0,
    $canvas, canvas, fourthWidth, fourthHeight, currentLevel;

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
    fourthWidth = canvas.width/2;
    fourthHeight = (canvas.height - headerHeight)/2;

    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,185,15,0.' + fourthOpacity.topLeft + ')';
    ctx.fillRect(0, headerHeight, fourthWidth, fourthHeight);
    ctx.fillStyle = 'rgba(125,38,205,0.' + fourthOpacity.topRight + ')';
    ctx.fillRect(fourthWidth, headerHeight, fourthWidth, fourthHeight);
    ctx.fillStyle = 'rgba(127,255,0,0.' + fourthOpacity.bottomLeft + ')';
    ctx.fillRect(0, midY, fourthWidth, fourthHeight);
    ctx.fillStyle = 'rgba(205,0,0,0.' + fourthOpacity.bottomRight + ')';
    ctx.fillRect(fourthWidth, midY, fourthWidth, fourthHeight);

    restoreDefaultOpacity();
  }

  function gameLoop() {
    update();
    draw();

    setTimeout(gameLoop, frameLength);
  }

  function update() {
    currentLevel = LEVELS[level];
    if(timer > 0) {
      if(keydown.left) GOFOURTH.rocket.move.left(); 
      if(keydown.right) GOFOURTH.rocket.move.right();
      if(keydown.up) GOFOURTH.rocket.move.up();
      if(keydown.down) GOFOURTH.rocket.move.down();
      if(keydown.return) {
        if(checkAnswer()) {
          nextLevel(); 
        }
      }
      updateFourthOpacity(GOFOURTH.rocket);
      timer -= 1;
    } else {
      if(checkAnswer()) {
        nextLevel();   
      }
    }
  }

  function nextLevel() {
    level += 1; 
    timer = 500;
  }

  function checkAnswer() {
    var answer = currentLevel.answerIndex;
    return getFourth(GOFOURTH.rocket) === answer ? true : false;
  }

  function updateFourthOpacity(rocket) {
    var rocketFourth = false;

    if(inTopLeft(rocket)) {
      rocketFourth = "topLeft";
    } else if(inTopRight(rocket)) {
      rocketFourth = "topRight";
    } else if(inBottomLeft(rocket)) {
      rocketFourth = "bottomLeft";
    } else if(inBottomRight(rocket)) {
      rocketFourth = "bottomRight";
    }

    if(rocketFourth) fourthOpacity[rocketFourth] = 50;
  }

  function getFourth(obj) {
    if(inTopLeft(obj)) {
      return 0; 
    } else if(inTopRight(obj)) {
      return 1; 
    } else if(inBottomRight(obj)) {
      return 2; 
    } else if(inBottomLeft(obj)) {
      return 3; 
    }

    return -1;
  }

  function inTopLeft(obj) {
    if(obj.getX() < midX && obj.getY() < midY) return true;
  }

  function inTopRight(obj) {
    if(obj.getX() > midX && obj.getY() < midY) return true;
  }

  function inBottomLeft(obj) {
    if(obj.getX() < midX && obj.getY() > midY) return true;
  }

  function inBottomRight(obj) {
    if(obj.getX() > midX && obj.getY() > midY) return true;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    ctx.font = fontSize.toString() + "px Abel";
    ctx.fillStyle = "#bbb";
    ctx.textAlign = 'left';
    ctx.fillText(currentLevel.question, 25, headerHeight/2 + fontSize/2 - 3);
    ctx.textAlign = 'right';
    ctx.fillText(timer, C_WIDTH - 25, headerHeight/2 + fontSize/2 - 3);
    ctx.textAlign = 'center';
    ctx.fillText(currentLevel.choicesArr[0] , fourthWidth/2, headerHeight + fourthHeight/2);
    ctx.fillText(currentLevel.choicesArr[1], midX + fourthWidth/2, headerHeight + fourthHeight/2);
    ctx.fillText(currentLevel.choicesArr[2], midX + fourthWidth/2, midY + fourthHeight/2);
    ctx.fillText(currentLevel.choicesArr[3], fourthWidth/2, midY + fourthHeight/2);
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
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(x, y, width/1.5, 0, 2 * Math.PI);
    ctx.fill();
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
