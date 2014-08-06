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
    headerHeight = 80,
    midX = C_WIDTH/2,
    midY = (headerHeight + C_HEIGHT)/2,
    ctx; 

var LEVELS = [
  {
    question: "sqrt(5! + (-1))",
    choices: [22, 12, 5, 11],
    answer: 11
  },
  {
    question: "7!/6!",
    choices: [1, 7, 42, 6],
    answer: 7
  }
];

GOFOURTH.game = (function() {
  var frameLength = 30,
    backgroundImg = new Image(),
    fourthOpacity = {
      topLeft: 15,
      topRight: 15,
      bottomLeft: 15,
      bottomRight: 15
    },
    fontSize = 24,
    timer = 500,
    level = 0,
    score = 0,
    state = 'play',
    $canvas, canvas, fourthWidth, fourthHeight,
    currentLevel, levels, topScore;

  topScore = localStorage['gf-top-score'] || 0;

  backgroundImg.onload = function() {
    drawBoard(); 
  };

  backgroundImg.src = 'assets/img/background.jpg';

  function initialize(lvls) {
    loadLevels(lvls);

    $canvas = $('#canvas');
    canvas = $canvas[0];
    ctx = canvas.getContext('2d');

    canvas.width = C_WIDTH;
    canvas.height = C_HEIGHT;

    gameLoop();
  }

  function loadLevels(lvls) {
    levels = _.map(_.shuffle(lvls), function(lvl) {
      lvl.choices = _.shuffle(lvl.choices); 
      return lvl;
    }); 
  }

  function restoreDefaultOpacity() {
    for(var f in fourthOpacity) fourthOpacity[f] = 15;
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

  function drawWin() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.font = "40px Abel";
    ctx.fillStyle = "#bbb";
    ctx.textAlign = 'center';
    ctx.fillText("You Win!", midX, 200);
    ctx.font = "22px Abel";
    ctx.fillText("Score: " + score + "  High Score: " + topScore, midX, 260);
    ctx.font = "18px Abel";
    ctx.fillText("Play Again (P)", midX, 350);
  }

  function drawLose() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.font = "40px Abel";
    ctx.fillStyle = "#bbb";
    ctx.textAlign = 'center';
    ctx.fillText("Game Over!", C_WIDTH/2, 200);
    ctx.font = "22px Abel";
    ctx.fillText("Score: " + score + "  High Score: " + topScore, midX, 260);
    ctx.font = "18px Abel";
    ctx.fillText("Play Again (P)", midX, 350);
  }

  function gameLoop() {
    update();
    draw();

    setTimeout(gameLoop, frameLength);
  }

  function update() {
    switch(state) {
      case 'play':
        currentLevel = levels[level];
        if(timer > 0) {
          if(keydown.left) GOFOURTH.rocket.move.left(); 
          if(keydown.right) GOFOURTH.rocket.move.right();
          if(keydown.up) GOFOURTH.rocket.move.up();
          if(keydown.down) GOFOURTH.rocket.move.down();
          if(keydown.return) handleAnswer();
          updateFourthOpacity(GOFOURTH.rocket);
          timer -= 1;
        } else {
          handleAnswer();
        }
        break;
      case 'win':
      case 'lose':
        if(score > topScore) setTopScore(score);
        if(keydown.p) resetGame();
        break;
    }
  }

  function resetGame() {
    GOFOURTH.rocket.reset();
    loadLevels(levels);
    timer = 500;
    score = 0;  
    level = 0;
    state = 'play';
  }

  function setTopScore(s) {
    topScore = s;
    localStorage['gf-top-score'] = s;
  }

  function handleAnswer() {
    if(timer > 490) return;
    return correctAnswer() ? nextLevel() : state = 'lose';
  }

  function nextLevel() {
    score += (level + 1) * timer;
    level += 1; 
    timer = 500;

    return (levels[level] ? true : state = 'win');
  }

  function correctAnswer() {
    var answer = currentLevel.answer;
    return getFourth(GOFOURTH.rocket) === currentLevel.choices.indexOf(answer) ? true : false;
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

    if(rocketFourth) fourthOpacity[rocketFourth] = 40;
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
    switch(state) {
      case 'play':
        drawBoard();
        ctx.font = fontSize.toString() + "px Abel";
        ctx.fillStyle = "#bbb";
        ctx.textAlign = 'left';
        ctx.fillText(currentLevel.question, 25, headerHeight/2 + fontSize/2 - 3);
        ctx.textAlign = 'right';
        ctx.fillText(timer, C_WIDTH - 25, headerHeight/2 + fontSize/2 - 3);
        ctx.textAlign = 'center';
        ctx.fillText(currentLevel.choices[0] , fourthWidth/2, headerHeight + fourthHeight/2);
        ctx.fillText(currentLevel.choices[1], midX + fourthWidth/2, headerHeight + fourthHeight/2);
        ctx.fillText(currentLevel.choices[2], midX + fourthWidth/2, midY + fourthHeight/2);
        ctx.fillText(currentLevel.choices[3], fourthWidth/2, midY + fourthHeight/2);
        GOFOURTH.rocket.draw(); 
        break;
      case 'win':
        drawWin();
        break;
      case 'lose':
        drawLose();
        break;
    }
  }

  return {
    initialize: initialize
  };
})();

GOFOURTH.rocket = (function() {
  var x = midX,
    y = midY,
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

  function reset() {
    x = midX; 
    y = midY;
    frame = 0;
  }

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
    reset: reset,
    getX: function() { return x; },
    getY: function() { return y; }
  }
})();

$(document).ready(function() {
  GOFOURTH.game.initialize(LEVELS);
});
