window.onload = function() {
  var w = 800;
  var h = 600;
  var renderer = new PIXI.WebGLRenderer(w, h);

  document.body.appendChild(renderer.view);

  var stage = new PIXI.Stage;

  var bananaTexture = PIXI.Texture.fromImage("img/small.png");
  var bananas = [];
  var bananaData = [];

  for (var i = 0; i < 100; i++) {
    var banana = new PIXI.Sprite(bananaTexture);

    banana.anchor.x = 0.5;
    banana.anchor.y = 0.5;

    stage.addChild(banana);
    bananas.push(banana);
  }

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function renewBanana(i) {
    bananas[i].position.x = w + 8;
    bananas[i].position.y = getRandom(0, h);

    var scale = getRandom(0.5, 1);
    bananas[i].scale.x = scale;
    bananas[i].scale.y = scale;

    bananaData[i] = {
      moveSpeed: scale,
      rotSpeed: getRandom(0.005, 0.3)
    };
  }

  function randomizeAll() {
    for (var i = bananas.length - 1; i >= 0; i--) {
      bananas[i].position.x = getRandom(0, w);
      bananas[i].position.y = getRandom(0, h);
      bananas[i].rotation = getRandom(0, 90);

      var scale = getRandom(0.5, 1);
      bananas[i].scale.x = scale;
      bananas[i].scale.y = scale;

      bananaData[i] = {
        moveSpeed: scale,
        rotSpeed: getRandom(0.005, 0.3)
      };
    }
  }

  function animateBananas() {
    for (var i = bananas.length - 1; i >= 0; i--) {
      bananas[i].rotation   += bananaData[i].rotSpeed;
      bananas[i].position.x -= bananaData[i].moveSpeed;

      if (bananas[i].position.x < -8) {
        renewBanana(i);
      }
    }
  }

  randomizeAll();
  requestAnimationFrame(animate);

  function animate() {
    animateBananas();
    renderer.render(stage);
    requestAnimationFrame(animate);
  }
}
