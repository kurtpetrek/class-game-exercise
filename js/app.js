function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var enemyYPositions = [60, 145, 230];
var enemyXPositions = [-100, -150, -200, -300, -360, -400, -450, - 500, -600, - 650, -730, -800,-850, -900, -950, -100, -150, -200, -300, -360, -400, -450, - 500, -600, - 650, -730, -800,-850, -900, -950];
var score = 0;
var bamText = {
  time: 0,
  x: 0,
  y: 0
};
var scoreText = {
  time: 0,
  x: 0,
  y: 0
};

function drawText(obj, text, color, offset){
  ctx.font = '30px Helvetice';
  ctx.fillStyle = color;
  ctx.fillText(text, obj.x, obj.y + offset);
  obj.y-= .1;
  obj.time -= 3;
}

var Coin = function (x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/gem-green.png';
};

Coin.prototype.mixUp = function(){
  this.x = getRandomInt(0, 400);
  this.y = getRandomInt(100, 300);
};

Coin.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 75, 100);
};

// Enemies our player must avoid
var Enemy = function (x, y) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.x = x;
  this.y = y;
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += 250 * dt;
//  console.log(dt);
  
  if(this.x > 500){
    this.x = enemyXPositions[getRandomInt(0, enemyXPositions.length)];
    this.y = enemyYPositions[getRandomInt(0, enemyYPositions.length)];
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Collision Text 
  if(bamText.time > 0){
    drawText(bamText, 'BAM!', '#a00', 100);
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 400;
};

Player.prototype.update = function (dt) {
  // Reset location if player reaches water
  if(this.y < 60){
    
    // Create score text
    scoreText.time = 100;
    scoreText.x = this.x;
    scoreText.y = this.y;
    
    // Reset players position and add points
    this.x = 200;
    this.y = 400;
    score += 10;
    
    // Mix up coins
    allCoins.forEach(function(x){
      x.mixUp();
    });
  }
  
  // Enemy Collision
  for(var i = 0; i < allEnemies.length; i++){
    if(this.y + 50 > allEnemies[i].y && this.y - 50 < allEnemies[i].y &&
       this.x + 50 > allEnemies[i].x && this.x - 50 < allEnemies[i].x){
      
      bamText.time = 500;
      bamText.x = this.x;
      bamText.y = this.y;
      
      // Reset player position after collision
      this.x = 200;
      this.y = 400;
      
      // Deduct Score for collision
      if(score > 50){
        score -= 50;
      } else {
        score = 0;
      }
      
      allCoins.forEach(function(x){
        x.mixUp();
      });
    }
  }
  
  // Coin Collision
  for(var i = 0; i < allCoins.length; i++){
    if(this.y + 50 > allCoins[i].y && this.y - 50 < allCoins[i].y &&
       this.x + 50 > allCoins[i].x && this.x - 50 < allCoins[i].x){
      console.log('coin '+ allCoins[i].x + ' ' + allCoins[i].y);
      console.log('player '+ this.x + ' ' + this.y);
      allCoins[i].x = -100;
      allCoins[i].y = -100;
      scoreText.time = 500;
      scoreText.x = this.x;
      scoreText.y = this.y;
      
      // Add to Score
      score += 10;
      
    }
  }
  
};

Player.prototype.handleInput = function (key) {
  if(key == 'up' && this.y > 60){
    this.y -= 85;
  } else if (key == 'down' && this.y < 400){
    this.y += 85;
  } else if (key == 'left' && this.x > 0){
    this.x -= 100;
  } else if (key == 'right' && this.x < 400){
    this.x += 100;
  } else if (key == 'up' && this.y === 60){
    this.y -= 65;
  }
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  
  // Points Text 
  if(scoreText.time > 0){
    drawText(scoreText, '+10', '#fff', 150);
  }
};

// Creates Enemies
var allEnemies = [];
for (var i = 0; i < 10; i++){
  allEnemies.push(new Enemy(enemyXPositions[getRandomInt(0, enemyXPositions.length)],enemyYPositions[getRandomInt(0, 3)]));
}

// Creates Coins
var allCoins = [];
for (var i = 0; i < 3; i ++) {
//  allCoins.push(new Coin(getRandomInt(0, 400), getRandomInt(100, 300)));
  allCoins.push(new Coin(0, 0));
  allCoins[i].mixUp();
}

// Creates Player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
