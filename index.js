
let CANVAS_WIDTH = 1920,
CANVAS_HEIGHT = 1080;

let WINDOW_RESIZED = true;

let TOP_MASK,
    BOT_MASK,
    LEFT_MASK,
    RIGHT_MASK,
    frameX,
    frameY,
    frameW,
    frameH;

window.addEventListener('resize', function(){ // Flag after resize event for optimization
  WINDOW_RESIZED = true;
}, true);

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

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
}

// Creates the letterbox around the game
// Divisions are to undo scaling from the scene resize
let letterbox = (frameX, frameY) => {
  frameX /= app.stage.scale.x;
  frameY /= app.stage.scale.y;
  frameW = window.innerWidth/app.stage.scale.x
  frameH = window.innerHeight/app.stage.scale.y

  LEFT_MASK.width = frameX;
  LEFT_MASK.height = frameH;
  LEFT_MASK.x = -frameX;

  RIGHT_MASK.width = frameX;
  RIGHT_MASK.height = frameH;
  RIGHT_MASK.x = CANVAS_WIDTH;

  TOP_MASK.height = frameY;
  TOP_MASK.width = frameW
  TOP_MASK.y = -frameY;

  BOT_MASK.height = frameY;
  BOT_MASK.width = frameW;
  BOT_MASK.y = CANVAS_HEIGHT;

}

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

// load the texture we need
app.loader.add('bunny', 'images/reimu.png').add('black', 'images/black.png').load((loader, resources) => {

    // Create letterbox
    TOP_MASK = new PIXI.extras.TilingSprite(
        resources.black.texture,
        0,
        CANVAS_HEIGHT
    );
    TOP_MASK.interactive = true;
    BOT_MASK = new PIXI.extras.TilingSprite(
        resources.black.texture,
        0,
        CANVAS_HEIGHT
    );
    BOT_MASK.interactive = true;
    LEFT_MASK = new PIXI.extras.TilingSprite(
        resources.black.texture,
        CANVAS_WIDTH,
        0
    );
    LEFT_MASK.interactive = true;
    RIGHT_MASK = new PIXI.extras.TilingSprite(
        resources.black.texture,
        CANVAS_WIDTH,
        0
    );
    RIGHT_MASK.interactive = true;

    app.stage.addChild(LEFT_MASK);
    app.stage.addChild(RIGHT_MASK);
    app.stage.addChild(TOP_MASK);
    app.stage.addChild(BOT_MASK);

    // This creates a texture from a 'bunny.png' image
    const bunny = new PIXI.Sprite(resources.bunny.texture);
    app.renderer.backgroundColor = 0x95d5f5;

    // Rotate around the center
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // Setup the position of the bunny
    bunny.x = CANVAS_WIDTH / 2;
    bunny.y = CANVAS_HEIGHT / 2;

    // Add the bunny to the scene we are building
    app.stage.addChild(bunny);

    // Listen for frame updates
    app.ticker.add(() => {
        // each frame we spin the bunny around a bit
        // Scene resize and centering
        if(WINDOW_RESIZED) {

          sceneResize(); // -> util.js
          app.renderer.resize(window.innerWidth, window.innerHeight);

          app.stage.x = (window.innerWidth - CANVAS_WIDTH * app.stage.scale.x) / 2;
          app.stage.y = (window.innerHeight - CANVAS_HEIGHT * app.stage.scale.y) / 2;
          letterbox(app.stage.x, app.stage.y)

          WINDOW_RESIZED = false;
        }
        bunny.rotation += 0.01;
    });
});