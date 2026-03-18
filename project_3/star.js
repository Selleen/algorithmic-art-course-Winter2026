class Star {
    constructor(palette) {
        this.x = random(-width, width)*0.3;
        this.y = random(-height, height)*0.3; 
        this.z = random(0, width); // this value its for moving the stars, the bigger the z value, the slower it moves
        //being closer or far from the viewer perspective
        this.pz = this.z; // previous z value, to create the tail effect
        this.col = random(palette); // random color per star, from the palette
    }

    update() {
        this.z = this.z - speed;
        if (this.z < 1) { // reappear the star in the center of the canvas when it goes out of the screen
            this.x = random(-width, width)*0.3;
            this.y = random(-height, height)*0.3; 
            this.z = random(0, width);
            this.pz = this.z;
        }
    }
    show() {
        fill(255);
        noStroke();
        // sx,sy simulate the 3D perspective, from the viewer point 
        var sx = map(this.x / this.z, 0, 1, 0, width);
        var sy = map(this.y / this.z, 0, 1, 0, height);
        var r = map(this.z, 0, width, 8, 0);
        //draw the lines between the current position of the star and the previous position, to create a tail effect
        var px = map(this.x / this.pz, 0, 1, 0, width);
        var py = map(this.y / this.pz, 0, 1, 0, height);
        stroke(this.col); // star color
        this.pz = this.z;
        line(px, py, sx, sy);
        
    }
}