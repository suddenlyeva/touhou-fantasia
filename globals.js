
let CANVAS_WIDTH = 1920,
CANVAS_HEIGHT = 1080;

// Resize Information
let WINDOW_RESIZED = true;
let STRETCH_THRESHOLD = 0.1;

// Ticker Global for deltaTime interpolation
let TICKER = new PIXI.ticker.Ticker();

// Renderer Global
let RENDERER = PIXI.autoDetectRenderer({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    view: document.getElementById("display"),
    transparent: false,
    autoResize: true
});

// Letterboxing variables
let TOP_MASK,
    BOT_MASK,
    LEFT_MASK,
    RIGHT_MASK,
    frameX,
    frameY,
    frameW,
    frameH;