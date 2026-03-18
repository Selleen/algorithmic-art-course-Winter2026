// data  // https://www.macrotrends.net/datasets/global-metrics/countries/cub/cuba/net-migration

// GLOBAL VARIABLES
const W = 1000;
const H = 1000;

let cnv;

let cubaImg;
let migrationTable;
let audio;
let isPlaying = false;
let starWarsFont;

// Data
let migrationData = [];
let minMigrants = Infinity;
let maxMigrants = -Infinity;

// Main systems
let stars = [];
let orbiters = [];

// Visual parameters driven by data
let speed = 2;
let densityFactor = 0;
let migrationFactor = 0;

// Year cycle
let currentYearIndex = 0;
let currentEntry = null;

let releasedStars = 0;
let targetStarsForYear = 0;
let releasePerFrame = 2;

let yearPauseFrames = 90;
let pauseCounter = 0;

// Orbiters
let targetOrbiters = 0;
let orbiterSpawnAccumulator = 0;

// Cuba position
let cubaX = W / 2;
let cubaY = H / 2 + 310;

// Palette
const STAR_PALETTE = [
  [255, 255, 255],
  [40, 120, 255],
  [255, 60, 60]
];

function preload() {
  starWarsFont = loadFont("assets/Starjedi.ttf");
  cubaImg = loadImage("assets/cuba_island.png");
  asteroidImg = loadImage("assets/asteroid.png");
  migrationTable = loadTable("assets/migration_dataset.csv", "csv", "header",
      () => console.log('Table loaded successfully'),
      (err) =>  console.error('Error loading table:', err)
  );

  audio = loadSound("assets/audio.m4a", 
    () => console.log('Audio loaded successfully'),
    (err) => console.error('Error loading audio:', err)
  );
}

function setup() {
  cnv = createCanvas(W, H);
  centerCanvas();
  parseMigrationTableWithHeader();
  computeMigrationRange();
  initYear(migrationData[currentYearIndex]);
  textFont(starWarsFont);
}


function centerCanvas() {
  const x = (windowWidth - width) / 2;
  const y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function draw() {
  background(0);

  // Relation between the release progress and the objective of the actual year
  densityFactor = releasedStars / max(1, targetStarsForYear);
  densityFactor = constrain(densityFactor, 0, 1);

  // speed calculated by the density
  speed = map(densityFactor, 0, 1, 2, 18);
  drawBackgroundGlow();
  drawCubaOutline();
  releaseStars(); // release stars by slowly
  manageOrbiters();// keep the abstract number of orbital particles

  // draw orbiters
  for (let i = orbiters.length - 1; i >= 0; i--) {
    orbiters[i].update();
    orbiters[i].show();

    if (orbiters[i].isDead()) {
      orbiters.splice(i, 1);
    }
  }
  drawYearLabel();
  drawMigrationLabel();
  drawAudioLabel();
  updateYearCycle();
  translate(width/2, height); //center the canvas in the middle, to make the stars come from the center
  
  // draw stars
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }

 
}

function drawCubaOutline() {
  if (!cubaImg) return;

  push();
  imageMode(CENTER);

  let scaleFactor = 0.30;
  let targetW = width * scaleFactor;
  let targetH = height * scaleFactor;

  tint(255, 170);
  image(cubaImg, cubaX, cubaY, targetW, targetH - 80);

  pop();
}

// Read the .csv file and extract the columns
function parseMigrationTableWithHeader() {
  migrationData = [];
  for (let r of migrationTable.getRows()) {
    let year = int(r.getString(0));
    let migrants = abs(int(r.getString(1))); // make it positive, because in the table is negative
    if (!isNaN(year) && !isNaN(migrants)) {
      migrationData.push({ year, migrants });
    }
  }
}

function computeMigrationRange() {
  minMigrants = Infinity;
  maxMigrants = -Infinity;

  for (let row of migrationData) {
    if (row.migrants < minMigrants) minMigrants = row.migrants;
    if (row.migrants > maxMigrants) maxMigrants = row.migrants;
  }

  console.log("minMigrants:", minMigrants, "maxMigrants:", maxMigrants);
}

function initYear(entry) {
  currentEntry = entry;

  releasedStars = 0;
  pauseCounter = 0;
  stars = [];
  orbiters = [];
  orbiterSpawnAccumulator = 0;

  // factor between 0 and 1, related to the migration number
  migrationFactor = map(entry.migrants, minMigrants, maxMigrants, 0, 1);
  migrationFactor = constrain(migrationFactor, 0, 1);

  // number of stars per year
  targetStarsForYear = int(map(entry.migrants, minMigrants, maxMigrants, 50, 1800));

  // Cuántas se liberan por frame
  // number of orbital particles per frame
  releasePerFrame = int(map(entry.migrants, minMigrants, maxMigrants, 1, 4));

  // number of orbital particles seen
  targetOrbiters = int(map(entry.migrants, minMigrants, maxMigrants, 10, 70));

  console.log(
    `Year ${entry.year} | migrants=${entry.migrants} | targetStars=${targetStarsForYear} | releasePerFrame=${releasePerFrame} | targetOrbiters=${targetOrbiters}`
  );
}

function releaseStars() {
  if (releasedStars < targetStarsForYear) {
    for (let i = 0; i < releasePerFrame; i++) {
      if (releasedStars < targetStarsForYear) {
        stars.push(new Star(STAR_PALETTE, cubaX, cubaY));
        releasedStars++;
      }
    }
  }
}

function manageOrbiters() {
  // years with a higher number of migration generates orbiters faster
  let spawnRate = map(migrationFactor, 0, 1, 0.08, 1.2);
  orbiterSpawnAccumulator += spawnRate;

  while (orbiterSpawnAccumulator >= 1 && orbiters.length < targetOrbiters) {
    orbiters.push(new Orbiter(cubaX, cubaY, migrationFactor));
    orbiterSpawnAccumulator -= 1;
  }
}

function updateYearCycle() {
  if (releasedStars >= targetStarsForYear) {
    pauseCounter++;

    if (pauseCounter > yearPauseFrames) {
      currentYearIndex++;

      if (currentYearIndex >= migrationData.length) {
        currentYearIndex = 0;
      }

      initYear(migrationData[currentYearIndex]);
    }
  }
}


function drawYearLabel() {
  push();
  textAlign(CENTER, TOP);
  textFont(starWarsFont);
  textSize(50);
  fill(255, 204, 0);
  noStroke();
  text(currentEntry.year, width / 2, 30);
  pop();
}

function drawMigrationLabel() {
  push();
  textAlign(CENTER, TOP);
  textSize(35);
  fill(255, 180);
  text(`Migrants: ${currentEntry.migrants}`, width / 2, 80);
  pop();
}

function drawAudioLabel() {
  push();
  textAlign(CENTER, CENTER);
  textSize(14);
  fill(255);
  noStroke();
  text(
    isPlaying ? "Click to Pause Audio" : "Click to Play Audio",
    width / 2,
    height - 22
  );
  pop();
}

function mousePressed() {
  if (audio.isLoaded()) {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play();
      isPlaying = true;
    }
  } else {
    console.log('Audio not loaded yet.');
  }
}


function drawBackgroundGlow() {
  push();

  let glowAlpha = map(migrationFactor, 0, 1, 20, 80);

  noStroke();
  fill(255, 180, 80, glowAlpha);
  ellipse(cubaX, cubaY, 120 + migrationFactor * 120, 70 + migrationFactor * 40);

  fill(100, 160, 255, glowAlpha * 0.55);
  ellipse(cubaX, cubaY - 20, 180 + migrationFactor * 140, 110 + migrationFactor * 60);

  pop();
}