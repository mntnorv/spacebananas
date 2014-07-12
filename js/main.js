function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

var Star = function(texture, screenW, screenH) {
  this.obj = new PIXI.Sprite(texture);
  this.obj.anchor = 0.5;
  this.obj.anchor = 0.5;

  this.randomize(screenW, screenH);
};

Star.prototype.addToStage = function(stage) {
  stage.addChild(this.obj);
};

Star.prototype.randomize = function(screenW, screenH) {
  this.obj.position.x = getRandom(0, screenW);
  this.obj.position.y = getRandom(0, screenH);
  this.obj.rotation = getRandom(0, 90);

  var scale = getRandom(0.5, 1);
  this.obj.scale.x = scale;
  this.obj.scale.y = scale;

  this.moveSpeed = scale;
  this.rotSpeed  = getRandom(0.005, 0.3);
};

Star.prototype.nextFrame = function(screenW, screenH) {
  this.obj.rotation   += this.rotSpeed;
  this.obj.position.x -= this.moveSpeed;

  if (this.obj.position.x < ((- this.obj.width) / 2)) {
    this.randomize(screenW, screenH);
    this.obj.position.x = screenW + (this.obj.width / 2);
  }
};

window.onload = function() {
  var w = 800;
  var h = 600;
  var renderer = new PIXI.WebGLRenderer(w, h);

  document.body.appendChild(renderer.view);

  var stage = new PIXI.Stage;

  var bananaTexture = PIXI.Texture.fromImage("img/small.png");
  var bananas = [];

  for (var i = 0; i < 100; i++) {
    var banana = new Star(bananaTexture, w, h);
    banana.addToStage(stage);
    bananas.push(banana);
  }

  function animateBananas() {
    for (var i = bananas.length - 1; i >= 0; i--) {
      bananas[i].nextFrame(w, h);
    }
  }

  requestAnimationFrame(animate);

  function animate() {
    animateBananas();
    renderer.render(stage);
    requestAnimationFrame(animate);
  }
};
