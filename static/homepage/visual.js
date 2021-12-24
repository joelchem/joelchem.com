let backgroundColor = "#181818";
let canvas = document.getElementById("screen");
let ctx = canvas.getContext('2d');

class Point {
    constructor(){
      this.x = Math.random()*canvas.width;
      this.y = Math.random()*canvas.height;
      this.vx = Math.random()*1.5-0.75;
      this.vy = Math.random()*1.5-0.75;
  
      this.radius = 5;
      this.color = "white"
      this.maxLineShowDist = Math.max(canvas.width/8, canvas.height/8);
    }
    draw(){
      this.x += this.vx;
      this.y += this.vy;
  
      if(this.x > canvas.width+this.radius*2){
        // this.x = -this.radius*2;
        this.vx  *= -1;
      } else if(this.x < -this.radius*2){
        // this.x = canvas.width+this.radius*2;
        this.vx  *= -1;
      }
  
      if(this.y > canvas.height+this.radius*2){
        // this.y = -this.radius*2;
        this.vy *= -1;
      } else if(this.y < -this.radius*2){
        // this.y = canvas.height+this.radius*2;
        this.vy *= -1;
      }
  
    //   ctx.fillStyle = this.color;
    //   ctx.beginPath();
    //   ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    //   ctx.fill();
    //   ctx.closePath();
    }
    drawLine(otherPoint){
  
      let dist = Math.hypot(this.x-otherPoint.x, this.y-otherPoint.y);
      let strength = -dist/this.maxLineShowDist+1;
      if(strength<0){strength=0;}
  
  
      ctx.strokeStyle = "rgba(255, 255, 255, "+strength+")";
  
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(otherPoint.x, otherPoint.y);
      ctx.stroke();
  
      return strength>0;
    }
  
  }

function randomRange(low, high){
    var difference = high-low;
    var output = Math.random();
    output = Math.round(output*(difference+0.99)-0.5)+low;
    return output;
}

function canvasResize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = backgroundColor;
    //ctx.fillStyle = canvascolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
canvasResize();

let points = [];
let cursorPoint = new Point();

for(let i = 0; i < 75; i++){
    points.push(new Point());
}

document.addEventListener("mousemove", event => {
    cursorPoint.x = event.clientX;
    cursorPoint.y = event.clientY;
});

setInterval(function(){
    canvasResize();
    let totalConnections = 0;
    for(let i = 0; i < points.length; i++){
        for(let j = i+1; j < points.length; j++){
            if(points[i].drawLine(points[j])){
                totalConnections++;
            }
        }
        points[i].drawLine(cursorPoint);
        points[i].draw();
    }
}, 10);