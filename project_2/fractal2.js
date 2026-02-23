//Global variables
const W = 900;
const H = 840;

//var tree = [];
//var leaves = [];
//var count = 0;
let cnv;

// animation control variables
const MAX_ITER = 8;
const GROW_EVERY_FRAMES = 30;    // pause between itarations
const DIE_EVERY_FRAMES  = 2;     // dead speed
const RESPAWN_DELAY_FRAMES = 60; // pause before drawing the trees
//let flowersSpawned = false;

// States
//const STATE_GROW = "grow";
//const STATE_FALL = "fall";
//const STATE_DIE  = "die";
//const STATE_STOP = "stop";
//let state = STATE_GROW;

// Tree location and size
//let rootX = 0;
//let rootY = 0;
//let sizeScale = 1;     // upper, tiny
//let trunkLen = 160;    // recalculate with the scale

// Number of trees to draw
let TREE_COUNT;
const STAGGER_FRAMES = 120;     // timing between trees
let forest = []; // array of trees

// SKY
let stars = [];
let STAR_COUNT; 

function setup() {
    cnv = createCanvas(W, H);
    centerCanvas();
    TREE_COUNT = int(random(3, 8));
    STAR_COUNT = int(random(80, 250));
    initStars();
    
    forest = [];
    for (let i = 0; i < TREE_COUNT; i++) {
      // every tree starts in order
      forest.push(createNewTree(frameCount + i * STAGGER_FRAMES));
    } 
}

function centerCanvas() {
  const x = (windowWidth - width) / 2;
  const y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function drawMiddleBlurryLine() {
  push();
  // for the line in the middle of the canvas
  drawingContext.save();
  drawingContext.shadowBlur = 12;
  drawingContext.shadowColor = "rgba(174, 46, 46, 0.51)";

  stroke(255, 90);
  strokeWeight(3);
  line(0, height / 2, width, height / 2);

  drawingContext.restore();
  pop();
}

function createNewTree(startFrame) {
    return new Tree(startFrame);
}

function drawMoon() {
    const mx = width - 130;
    const my = 60;
    const mr = 55;

    push();
    drawingContext.save();

    // edges 
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = "rgba(255,255,255,0.35)";

    noStroke();
    fill(245, 245, 255, 235);
    ellipse(mx, my, mr * 2, mr * 2);

    // soft
    drawingContext.shadowBlur = 0;
    fill(220, 225, 245, 35);
    ellipse(mx - 14, my - 10, mr * 0.55, mr * 0.55);
    ellipse(mx + 12, my + 8, mr * 0.35, mr * 0.35);
    ellipse(mx + 18, my - 16, mr * 0.22, mr * 0.22);

    drawingContext.restore();
    pop();
}

function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
    }
}

function draw() {
  background(18, 38, 74); 
  // stars, upper half
  for (let i = 0; i < stars.length; i++) stars[i].draw();
  drawMoon(); // moon
  drawMiddleBlurryLine();

  // draw
  for (let i = forest.length - 1; i >= 0; i--) {
    const t = forest[i];
    const alive = t.updateAndDraw();

    // if the tree died, we remove it from the list
    if (!alive) {
      forest.splice(i, 1);

      // create a new tree
      const startFrame = frameCount + RESPAWN_DELAY_FRAMES;
      forest.push(createNewTree(startFrame));
    }
  }
}
