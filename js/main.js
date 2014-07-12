function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var Star = function(texture, minX, minY, maxX, maxY) {
  this.obj = new PIXI.Sprite(texture);
  this.obj.anchor.x = 0.5;
  this.obj.anchor.y = 0.5;

  this.randomize(minX, minY, maxX, maxY);
};

Star.prototype.addToStage = function(stage) {
  stage.addChild(this.obj);
  this.stage = stage;
};

Star.prototype.removeFromStage = function() {
  this.stage.removeChild(this.obj);
};

Star.prototype.removeIfOutOfBounds = function(screenW, screenH) {
  var x = this.obj.position.x;
  var y = this.obj.position.y;
  var halfSize = this.obj.height / 2;

  if ((x > screenW + halfSize) || (y > screenH + halfSize)) {
    this.removeFromStage();
    return true;
  } else {
    return false;
  }
};

Star.prototype.randomize = function(minX, minY, maxX, maxY) {
  this.obj.position.x = getRandom(minX, maxX);
  this.obj.position.y = getRandom(minY, maxY);
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
    var x = screenW + (this.obj.width / 2);
    this.randomize(x, 0, x, screenH);
  }
};

window.addEventListener('load', function() {
  var w = 0;
  var h = 0;
  var renderer = new PIXI.WebGLRenderer(w, h);

  document.body.appendChild(renderer.view);
  var stage = new PIXI.Stage;

  var bananaTexture = PIXI.Texture.fromImage('img/small.png');
  var bananas = [];

  function bananasInSpace(space) {
    return space / 10000;
  }

  function addBananas(minX, minY, maxX, maxY, count) {
    for (var i = 0; i < count; i++) {
      var banana = new Star(bananaTexture, minX, minY, maxX, maxY);
      banana.addToStage(stage);
      bananas.push(banana);
    }
  }

  function removeBananas(count) {
    toRemove = [];
    for (var i = count; i < count; i++) {
      toRemove.push(Math.floor(getRandom(0, bananas.length - 1)));
    }
    toRemove.sort(function(a, b) { return a - b; });

    for (var i = toRemove.length - 1; i >= 0; i--) {
      bananas[toRemove[i]].removeFromStage();
      bananas.splice(toRemove[i], 1);
    }
  }

  function removeOutOfBoundsBananas(maxX, maxY) {
    for (var i = bananas.length - 1; i >= 0; i--) {
      if (bananas[i].removeIfOutOfBounds(maxX, maxY)) {
        bananas.splice(i, 1);
      }
    }
  }

  function balanceBananaCount(w, h) {
    var countNeeded = bananasInSpace(w * h);

    if (bananas.length < countNeeded) {
      addBananas(w + 8, 0, w + 8, h, countNeeded - bananas.length);
    }

    if (bananas.length > countNeeded) {
      removeBananas(bananas.length - countNeeded);
    }
  }

  function addBananasAfterResize(newW, newH) {
    var bottomSpace = (newH - h) * w;
    var rightSpace  = (newW - w) * newH;

    if (bottomSpace > 0) {
      addBananas(0, h, w, newH, bananasInSpace(bottomSpace));
    }

    if (rightSpace > 0) {
      addBananas(w, 0, newW, newH, bananasInSpace(rightSpace));
    }
  }

  function handleResize() {
    var newW = window.innerWidth;
    var newH = window.innerHeight;

    renderer.resize(newW, newH);
    renderer.view.style.width  = newW + 'px';
    renderer.view.style.height = newH + 'px';

    addBananasAfterResize(newW, newH);
    removeOutOfBoundsBananas(newW, newH);
    balanceBananaCount(newW, newH);

    w = newW;
    h = newH;
  }

  window.addEventListener('resize', debounce(handleResize, 100));
  handleResize();

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
});
