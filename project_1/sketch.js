
//Global variables
let blackBandY = 250;
let blackBandSpeed = 1;
const bandH = 150;
const bandY0 = 250;
let stateBigCircles = [];
let groupNext = { center: 0, negativeSlope: 0, positiveSlope: 0 };
const W = 600;
const H = 550;

function setup() {
    let cnv = createCanvas(W, H);
    centerCanvas(cnv);
    initStateBigCircles();
}

function centerCanvas(cnv) {
  const x = (windowWidth - width) / 2;
  const y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas(select('canvas'));
}

function initStateBigCircles() {
    const xs = [230, 300, 370];
    const yOffs = [40, 110]; 

    stateBigCircles = [];

    // Go through each big circle and initialize its state
    for (let j = 0; j < yOffs.length; j++) {
        for (let i = 0; i < xs.length; i++) {
            if(xs[i] == 300){
                stateBigCircles.push({
                    x: xs[i],
                    yOff: yOffs[j],
                    on: random() < 0.5,                 
                    group: "center",
                });
            }
            else if((xs[i] == 230 && yOffs[j]==40) || (xs[i] == 370 && yOffs[j]==110)){
                stateBigCircles.push({
                    x: xs[i],
                    yOff: yOffs[j],
                    on: random() < 0.3,                 
                    group: "negativeSlope"
                });
            }
            else{
                stateBigCircles.push({
                    x: xs[i],
                    yOff: yOffs[j],
                    on: random() < 0.7,                 
                    group: "positiveSlope"
                });
            }
            
        }
    }
}

function drawBigCircles() {
    stroke(100, 100, 0);
    now = millis();

    if (now >= groupNext.center) {
        for (let c of stateBigCircles) if (c.group === "center") c.on = !c.on;
        groupNext.center = now + random(5000, 7000);
    }

    if (now >= groupNext.negativeSlope) {
        for (let c of stateBigCircles) if (c.group === "negativeSlope") c.on = !c.on;
        groupNext.negativeSlope = now + random(200, 800);
    }

    if (now >= groupNext.positiveSlope) {
        for (let c of stateBigCircles) if (c.group === "positiveSlope") c.on = !c.on;
        groupNext.positiveSlope = now + random(3200, 4500);
    }

    for (let circle of stateBigCircles) {
        const y = blackBandY + circle.yOff;
        if(circle.on) {
            fill(250, 180, 0, 200);
        }
        else {
            noFill();
        }
        ellipse(circle.x, y, 60, 60);
    }
}

function draw() {
    background(180, 0, 0);
    blackBandY += blackBandSpeed;

    if (blackBandY <= 0 || blackBandY >= height - 150) {
        blackBandSpeed *= -1; // change direction
    }

    fill(255, 255, 0, 150);
    noStroke();
    rect(0, blackBandY - 5, 600, 5); // yellow line
    rect(0, blackBandY + 150, 600, 5); // yellow line

    fill(0, 0, 0);
    stroke(0);
    rect(0, blackBandY, 600, 150); // black band

    noFill();
    stroke(100,100,0);
    rect(140,20,320,520);

    drawBigCircles();
    noFill();

    line(190, blackBandY + 75, 410, blackBandY + 75);
    line(265, blackBandY + 5, 265, blackBandY + 145);
    line(335, blackBandY + 5, 335, blackBandY + 145);

    line(190, blackBandY + 30, 190, blackBandY + 120);
    line(410, blackBandY + 30, 410, blackBandY + 120);

    for (let i = 0; i < 6; i++) {
        rect(160 + i * 50, 420, 30, 100);
    }

    fill(100, 0, 0,200);
    // down circles with columns
    for (let i = 0; i < 4; i++) {
        ellipse(175 , 435 + i * 24, 22, 22);
        ellipse(225 , 435 + i * 24, 22, 22);
        ellipse(275 , 435 + i * 24, 22, 22);
        ellipse(325 , 435 + i * 24, 22, 22);
        ellipse(375 , 435 + i * 24, 22, 22);
        ellipse(425 , 435 + i * 24, 22, 22);
    }

    fill(0, 0, 0, 150);
    //the small squares at the bottom
    for (let i = 0; i < 6; i++) {
        rect(145 + i * 50, 460, 15, 15);
    }
    rect(440, 460, 15, 15);
    
    // right circles with lines
    for (let i = 0; i < 3; i++) {
        ran1 = random(0,10);
        ran2 = random(0,8);
        ellipse(525, blackBandY + 40 + i * 35, 30 + ran1, 30 + ran1);
        ellipse(565, blackBandY + 40 + i * 35, 30 + ran2, 30 + ran2);
    }

    line(500, blackBandY, 500, blackBandY + 150);
    line(500, blackBandY + 57, 590, blackBandY + 57);
    line(500, blackBandY + 93, 590, blackBandY + 93);

    // left circles with lines
    for (let i = 0; i < 3; i++) {
        rand1 = random(0,8);
        rand2 = random(0,8);
        ellipse(35,  blackBandY + 40 + i * 35, 30 + rand1, 30 + rand1);
        ellipse(75, blackBandY + 40 + i * 35, 30 + rand2, 30 + rand2);
    }
    line(100, blackBandY, 100, blackBandY + 150);
    line(10, blackBandY + 57, 100, blackBandY + 57);
    line(10, blackBandY + 93, 100, blackBandY + 93);
}