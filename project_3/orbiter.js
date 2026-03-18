class Orbiter {
  constructor(cx, cy, migrationFactor) {
    this.cx = cx;
    this.cy = cy;
    this.migrationFactor = migrationFactor;

    this.angle = random(TWO_PI);
    this.phase = random(TWO_PI);

    this.baseRadius = random(18, 60);
    this.radius = this.baseRadius;

    this.radiusGrowth = random(0.03, 0.12) * (0.5 + migrationFactor);

    this.angularSpeed = random(0.01, 0.03) * (0.6 + migrationFactor * 1.6);

    // mix between sin/cos
    this.waveMix = random(0, 1);

    // deforming the movement
    this.freqX = random(0.8, 2.2) + migrationFactor * random(0.2, 1.2);
    this.freqY = random(0.8, 2.2) + migrationFactor * random(0.2, 1.2);

    this.ampX = random(0.7, 1.4);
    this.ampY = random(0.7, 1.4);

    this.size = random(1.5, 4.5);
    this.alpha = random(90, 220);

    this.life = 0;
    this.maxLife = int(random(240, 520));

    this.col = random([
      [255, 220, 120],
      [255, 180, 80],
      [255, 255, 255],
      [180, 220, 255]
    ]);
  }

  update() {
    this.angle += this.angularSpeed;
    this.radius += this.radiusGrowth;
    this.life++;
  }

  show() {
    let sinX = sin(this.angle * this.freqX + this.phase) * this.radius * this.ampX;
    let cosX = cos(this.angle * (this.freqX + 0.35)) * this.radius * 0.7 * this.ampX;

    let cosY = cos(this.angle * this.freqY + this.phase) * this.radius * this.ampY;
    let sinY = sin(this.angle * (this.freqY + 0.45)) * this.radius * 0.65 * this.ampY;

    let x = this.cx + lerp(sinX, cosX, this.waveMix);
    let y = this.cy + lerp(cosY, sinY, this.waveMix);

    let lifeFade = map(this.life, 0, this.maxLife, 1, 0, true);
    let finalAlpha = this.alpha * lifeFade;

    noStroke();
    fill(this.col[0], this.col[1], this.col[2], finalAlpha);
    circle(x, y, this.size);
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}