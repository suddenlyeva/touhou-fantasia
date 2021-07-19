
let CANVAS_WIDTH = 1920,
CANVAS_HEIGHT = 1080;

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
let app = new PIXI.Application();

// Creates the letterbox around the game
// Divisions are to undo scaling from the scene resize
let letterbox = (frame, frameX, frameY) => {
  frameX /= app.stage.scale.x
  frameY /= app.stage.scale.y
  let frameW = window.innerWidth/app.stage.scale.x
  let frameH = window.innerHeight/app.stage.scale.y

  frame.left.width = frameX
  frame.left.height = frameH
  frame.left.x = -frameX

  frame.right.width = frameX
  frame.right.height = frameH
  frame.right.x = CANVAS_WIDTH

  frame.top.height = frameY
  frame.top.width = frameW
  frame.top.y = -frameY

  frame.bottom.height = frameY
  frame.bottom.width = frameW
  frame.bottom.y = CANVAS_HEIGHT

}

// Rescales the screen up to a certain threshold
let sceneResize = (stretchThreshold = 0) => {
  // stretchThreshold - how much scene dimensions can deviate from the desired aspect ratio
  // 0.2 means the scene can be stretched by a maximum of 20% vertically or horizontally
  let targetAspectRatio  = CANVAS_WIDTH / CANVAS_HEIGHT,
      currentAspectRatio = window.innerWidth / window.innerHeight;

  if(targetAspectRatio < currentAspectRatio) {                         // Wider screen than normal
      app.stage.scale.y = window.innerHeight / CANVAS_HEIGHT;              // Always stretch height
      app.stage.scale.x = Math.min(app.stage.scale.y * (1 + stretchThreshold), // Use height ratio if past Stretch Threshold
          window.innerWidth / CANVAS_WIDTH);                           // Else stretch the width

  } else {                                                             // Taller Screen than normal
      app.stage.scale.x = window.innerWidth / CANVAS_WIDTH;
      app.stage.scale.y = Math.min(app.stage.scale.x * (1 + stretchThreshold), // Same as vertical, but inverted x and y
          window.innerHeight / CANVAS_HEIGHT);
  }
  app.renderer.resize(window.innerWidth, window.innerHeight)
    
  app.stage.x = (window.innerWidth - CANVAS_WIDTH * app.stage.scale.x) / 2
  app.stage.y = (window.innerHeight - CANVAS_HEIGHT * app.stage.scale.y) / 2
  letterbox(app.letterbox, app.stage.x, app.stage.y)
}

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

// load the texture we need
app.loader.add('bunny', 'images/reimu.png').add('black', 'images/black.png').load((loader, resources) => {

    app.renderer.backgroundColor = 0xffffff

    // Create letterbox
    app.letterbox = {
      top: new PIXI.extras.TilingSprite(resources.black.texture, 0, CANVAS_HEIGHT),
      bottom: new PIXI.extras.TilingSprite(resources.black.texture, 0, CANVAS_HEIGHT),
      left: new PIXI.extras.TilingSprite(resources.black.texture, CANVAS_WIDTH, 0),
      right: new PIXI.extras.TilingSprite(resources.black.texture, CANVAS_WIDTH, 0)
    }

    app.letterbox.top.interactive = true
    app.stage.addChild(app.letterbox.top)

    app.letterbox.bottom.interactive = true
    app.stage.addChild(app.letterbox.bottom)

    app.letterbox.left.interactive = true
    app.stage.addChild(app.letterbox.left)

    app.letterbox.right.interactive = true
    app.stage.addChild(app.letterbox.right)

    sceneResize() // -> util.js

    window.addEventListener('resize', () => { 
      sceneResize() // -> util.js
    }, true);

    // Listen for frame updates
    app.ticker.add(() => {
        // each frame we spin the bunny around a bit
        // Scene resize and centering
    });
});