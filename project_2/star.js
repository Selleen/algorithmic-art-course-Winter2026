class Star {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height / 2 - 50); // in the upper half of the canvas

    this.r = random(1, 3.0);        // star size, radious
    this.speed = random(1, 8);  // blink speed
  }

  draw() {
    const alpha = random(10, 255) + random(-1,1)* this.speed;
    noStroke();
    fill(255, alpha);
    ellipse(this.x, this.y, this.r, this.r);
  }
}