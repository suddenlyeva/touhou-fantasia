
let CANVAS_WIDTH = 1920
let CANVAS_HEIGHT = 1080

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

let normalizeX = (x) => {
  return x
}
// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

// load the texture we need
app.loader
  .add('circle', 'images/circle.png')
  .add('black', 'images/black.png')
  .add('tile', 'images/tile.png')
  .add('reimu', 'images/reimu.png')
  .add('card', 'images/card.png')
  .add('background', 'images/background.png')
  .load((loader, resources) => {

    app.renderer.backgroundColor = 0xffffff

    // Create letterbox
    app.letterbox = {
      top: new PIXI.extras.TilingSprite(resources.black.texture, 0, CANVAS_HEIGHT),
      bottom: new PIXI.extras.TilingSprite(resources.black.texture, 0, CANVAS_HEIGHT),
      left: new PIXI.extras.TilingSprite(resources.black.texture, CANVAS_WIDTH, 0),
      right: new PIXI.extras.TilingSprite(resources.black.texture, CANVAS_WIDTH, 0)
    }

    app.letterbox.top.interactive = true
    app.letterbox.bottom.interactive = true
    app.letterbox.left.interactive = true
    app.letterbox.right.interactive = true


    // Autoresize
    sceneResize()

    window.addEventListener('resize', () => { 
      sceneResize()
    }, true);

    // Background
    let background = new PIXI.Sprite(resources.background.texture)
    app.stage.addChild(background)


    // Playfield tiles
    let tile1 = new PIXI.Sprite(resources.tile.texture)
    tile1.anchor.set(0.5)
    tile1.width = 320
    tile1.height = 160
    tile1.x = CANVAS_WIDTH / 2 - 320 - 100 - 30
    tile1.y = CANVAS_HEIGHT / 2 + 15
    app.stage.addChild(tile1)

    let tile2 = new PIXI.Sprite(resources.tile.texture)
    tile2.anchor.set(0.5)
    tile2.width = 320
    tile2.height = 160
    tile2.x = CANVAS_WIDTH / 2 - 160 - 30
    tile2.y = CANVAS_HEIGHT / 2 + 80 + 15
    app.stage.addChild(tile2)

    let tile3 = new PIXI.Sprite(resources.tile.texture)
    tile3.anchor.set(0.5)
    tile3.width = 320
    tile3.height = 160
    tile3.x = CANVAS_WIDTH / 2 - 30
    tile3.y = CANVAS_HEIGHT / 2 + 160 + 50 + 15
    app.stage.addChild(tile3)

    let tile4 = new PIXI.Sprite(resources.tile.texture)
    tile4.anchor.set(0.5)
    tile4.width = 320
    tile4.height = 160
    tile4.x = CANVAS_WIDTH / 2 + 30
    tile4.y = CANVAS_HEIGHT / 2 - 160 - 50 - 15
    app.stage.addChild(tile4)

    let tile5 = new PIXI.Sprite(resources.tile.texture)
    tile5.anchor.set(0.5)
    tile5.width = 320
    tile5.height = 160
    tile5.x = CANVAS_WIDTH / 2 + 160 + 30
    tile5.y = CANVAS_HEIGHT / 2 - 80 - 15
    app.stage.addChild(tile5)

    let tile6 = new PIXI.Sprite(resources.tile.texture)
    tile6.anchor.set(0.5)
    tile6.width = 320
    tile6.height = 160
    tile6.x = CANVAS_WIDTH / 2 + 320 + 100 + 30
    tile6.y = CANVAS_HEIGHT / 2 - 15
    app.stage.addChild(tile6)

    // Playfield Characters
    let reimu1 = new PIXI.Sprite(resources.reimu.texture)
    reimu1.x = tile1.x
    reimu1.y = tile1.y + 50
    reimu1.anchor.set(0.5, 1)
    reimu1.width = -210
    reimu1.height = 300
    app.stage.addChild(reimu1)

    let reimu2 = new PIXI.Sprite(resources.reimu.texture)
    reimu2.x = tile2.x
    reimu2.y = tile2.y + 50
    reimu2.anchor.set(0.5, 1)
    reimu2.width = -210
    reimu2.height = 300
    app.stage.addChild(reimu2)

    let reimu3 = new PIXI.Sprite(resources.reimu.texture)
    reimu3.x = tile3.x
    reimu3.y = tile3.y + 50
    reimu3.anchor.set(0.5, 1)
    reimu3.width = -210
    reimu3.height = 300
    app.stage.addChild(reimu3)

    let reimu4 = new PIXI.Sprite(resources.reimu.texture)
    reimu4.x = tile4.x
    reimu4.y = tile4.y + 50
    reimu4.anchor.set(0.5, 1)
    reimu4.width = 210
    reimu4.height = 300
    app.stage.addChild(reimu4)

    let reimu5 = new PIXI.Sprite(resources.reimu.texture)
    reimu5.x = tile5.x
    reimu5.y = tile5.y + 50
    reimu5.anchor.set(0.5, 1)
    reimu5.width = 210
    reimu5.height = 300
    app.stage.addChild(reimu5)

    let reimu6 = new PIXI.Sprite(resources.reimu.texture)
    reimu6.x = tile6.x
    reimu6.y = tile6.y + 50
    reimu6.anchor.set(0.5, 1)
    reimu6.width = 210
    reimu6.height = 300
    app.stage.addChild(reimu6)

    // Card Display

    let cards = []

    for (let i = 0; i < 5; i++) {
      let card = new PIXI.Sprite(resources.card.texture)
      card.anchor.set(0.5)
      card.width = 180
      card.height = 242
      card.x = CANVAS_WIDTH / 2 + ( i - 2 ) * 190
      card.y = CANVAS_HEIGHT - 60 + Math.abs(i - 2) ** 2 * 10
      card.rotation += ( i - 2 ) * 0.08
      card.interactive = true
      card.on('pointerover', (e) => {
        card.width = 250
        card.height = 350
        card.y = CANVAS_HEIGHT - 175
        card.rotation = 0
      })
      card.on('pointerout', (e) => {
        let i = cards.indexOf(card)
        card.width = 180
        card.height = 242
        card.y = CANVAS_HEIGHT - 50 + Math.abs(i - 2) ** 2 * 10
        card.rotation += ( i - 2 ) * 0.08
      })
      app.stage.addChild(card)
      cards.push(card)
    }

    // Targeting
    let circles = []

    for (let i = 0; i < 1000; i++) {
      let circle = new PIXI.Sprite(resources.circle.texture)
      circle.width = 15
      circle.height = 15
      circle.visible = false
      circle.anchor.set(0.5)
      circles.push(circle)
      app.stage.addChild(circle)
    }

    app.stage.interactive = true
    app.stage.on('pointerdown', (e) => {
      let cursor = app.stage.toLocal(e.data.global)
      circles[0].x = cursor.x
      circles[0].y = cursor.y
      for (let i = 0; i < 1000; ++ i) {
        circles[i].visible = true
        circles[i].x = circles[0].x + (cursor.x - circles[0].x) * (i ** 2) / 999 ** 2
        circles[i].y = circles[0].y + (cursor.y - circles[0].y) * i / 999
      }
    })
    app.stage.on('pointermove', (e) => {
      let cursor = app.stage.toLocal(e.data.global)
      for (let i = 0; i < 1000; ++ i) {
        circles[i].x = circles[0].x + (cursor.x - circles[0].x) * (i ** 2) / 999 ** 2
        circles[i].y = circles[0].y + (cursor.y - circles[0].y) * i / 999
      }
    })
    app.stage.on('pointerup', (e) => {
      for (let i = 0; i < 1000; ++ i) {
        circles[i].visible = false
      }
    })
    app.stage.on('pointerupoutside', (e) => {
      for (let i = 0; i < 1000; ++ i) {
        circles[i].visible = false
      }
    })

    // Listen for frame updates
    app.ticker.add(() => {
        // each frame we spin the bunny around a bit
        // Scene resize and centering

      app.stage.addChild(app.letterbox.top)
      app.stage.addChild(app.letterbox.bottom)
      app.stage.addChild(app.letterbox.left)
      app.stage.addChild(app.letterbox.right)
    });
});