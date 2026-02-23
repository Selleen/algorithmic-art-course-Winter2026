class Tree {
  constructor(startFrame) {
    // 
    this.startFrame = startFrame;

    // states
    this.STATE_GROW = "grow";
    this.STATE_FALL = "fall";
    this.STATE_DIE  = "die";
    this.state = this.STATE_GROW;

    // structure parts
    this.tree = [];
    this.leaves = [];
    this.count = 0;
    this.flowersSpawned = false;

    // location + size of the tree
    this.rootX = 0;
    this.rootY = 0;
    this.sizeScale = 1;
    this.trunkLen = 180; // the size of the trunk, recalculated with scale

    // init
    this.resetTree();
  }

  resetTree() {
    this.tree = [];
    this.leaves = [];
    this.count = 0;
    this.flowersSpawned = false;
    this.state = this.STATE_GROW;

    this.rootX = random(100, width - 100); // to have the trees in the middle of the canvas, not too close to the edges
    const yMin = height / 2 + 20; // limit the trees on the top 
    const yMax = height - 40; // limit the trees on the bottom
    this.rootY = random(yMin, yMax);

    if (this.rootY < (3 * height) / 4) {
        this.sizeScale = 0.50;   // normal size
    } else {
        this.sizeScale = 1.00;  // half size
    }
    this.trunkLen = 180 * this.sizeScale;

    const a = createVector(this.rootX, this.rootY);
    const b = createVector(this.rootX, this.rootY - this.trunkLen);
    this.tree.push(new Branch(a, b));
  }

  growOneIteration() {
    for (let i = this.tree.length - 1; i >= 0; i--) {
      let b = this.tree[i];
      if (!b.finish) {
        this.tree.push(b.branchA());
        this.tree.push(b.branchB());
      }
      b.finish = true;
    }
    this.count++;
  }

  spawnFlowers() {
    this.leaves = [];

    // if there are no unfinished branches, take all the branch ends
    for (let i = 0; i < this.tree.length; i++) {
      if (!this.tree[i].finish) {
        this.leaves.push(this.tree[i].end.copy());
      }
    }
    // otherwise, randomly pick some branch ends
    if (this.leaves.length === 0) {
      for (let i = 0; i < this.tree.length; i++) {
        if (random() < 0.18) this.leaves.push(this.tree[i].end.copy());
      }
    }

    this.flowersSpawned = true;
  }
  // check if all flowers have fallen
  allFlowersFallen() {
    for (let i = 0; i < this.leaves.length; i++) {
      if (this.leaves[i].y <= height + 10) return false;
    }
    return true;
  }
  // one step of dying: remove one branch
  dieStep() {
    if (this.tree.length > 0) this.tree.pop();
  }

  // returns:
  // true: if the tree is still alive
  // false: if it died completely
  updateAndDraw() {
    // wait until it's time to start
    if (frameCount < this.startFrame) return true;
    // grow
    if (this.state === this.STATE_GROW) {
      if (this.count < MAX_ITER && frameCount % GROW_EVERY_FRAMES === 0) {
        this.growOneIteration();
        if (this.count === MAX_ITER && !this.flowersSpawned) {
          this.spawnFlowers();
          this.state = this.STATE_FALL;
        }
      }
    }

    // draw branches
    for (let i = 0; i < this.tree.length; i++) {
      this.tree[i].show();
    }

    // draw flowers / leaves
    if (this.state === this.STATE_FALL) {
      for (let i = 0; i < this.leaves.length; i++) {
        fill(255, 0, 100, 80);
        noStroke();
        const r = (this.sizeScale < 1) ? 5 : 10;
        ellipse(this.leaves[i].x, this.leaves[i].y, r, r);
        this.leaves[i].y += random(0.5, 2.5);
      }

      if (this.allFlowersFallen()) {
        this.state = this.STATE_DIE;
      }
    }

    // die
    if (this.state === this.STATE_DIE) {
      if (frameCount % DIE_EVERY_FRAMES === 0) {
        this.dieStep();
      }
      // if there are not branches left, is because the tree died
      if (this.tree.length === 0) return false;
    }

    return true;
  }
}