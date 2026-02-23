function Branch(begin, end) {
  this.begin = begin;
  this.end = end;
  this.finish = false;
  this.show = function() {
    stroke(255);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  }
  
  this.branchA = function() {
    var dir = p5.Vector.sub(this.end, this.begin);
    var rotateAngleA = radians(random(15, 35));
    dir.rotate(random() < 0.5 ? rotateAngleA : -rotateAngleA);
    dir.mult(0.67); // to shorten the branch
    
    var newEnd = p5.Vector.add(this.end, dir);
    var b = new Branch(this.end, newEnd);
    return b;
  }

  this.branchB = function() {
    var dir = p5.Vector.sub(this.end, this.begin);
    var rotateAngleB = radians(random(15, 35));
    dir.rotate(random() < 0.5 ? rotateAngleB : -rotateAngleB);
    dir.mult(0.67); // to shorten the branch
    var newEnd = p5.Vector.add(this.end, dir);
    var b = new Branch(this.end, newEnd);
    return b;
  }
  // to simulate the wind, with movement
  this.jitter = function() {
    this.end.x += random(-1, 1);
    this.end.y += random(-1, 1);
  }
}