let backgroundColor = "#2A2A2A";
let canvas = document.getElementById("screen");
let ctx = canvas.getContext('2d');
let gameIsPlaying = true;

class Screen {
    constructor(){
        this.screenY = 0;
        this.targetScreenY = 0;
        this.speed = (canvas.width/2)/180;
        this.blocks = [new Block(this, canvas.width/7, 0, canvas.width/2),];
        
        let randX = Math.random()*(canvas.width/2-canvas.width/7)+canvas.width/4;
        this.moving = Math.sign(canvas.width/2-randX);
        this.activeBlock = new Block(this, canvas.width/7, 1, randX);
        this.blocks.push(this.activeBlock);
        
    }
    draw() {

        this.activeBlock.x += this.speed * this.moving;

        if(this.screenY > this.targetScreenY){
            this.screenY -= canvas.height/240;
        }
        
        if(this.activeBlock.x < canvas.width/8 + this.activeBlock.width/2 || this.activeBlock.x > 7*canvas.width/8 - this.activeBlock.width/2){
            this.moving = this.moving * -1;
        }


        for(let block of this.blocks){
            block.draw();
        }
    }
    placeBlock() {
        let belowBlock = this.blocks[this.activeBlock.level-1];
        let block = this.activeBlock;
        let leftX = Math.max(belowBlock.x-belowBlock.width/2, block.x-block.width/2);
        let rightX = Math.min(belowBlock.x+belowBlock.width/2, block.x+block.width/2);

        let randX = Math.random()*(canvas.width/2)+canvas.width/4;
        this.moving = Math.sign(canvas.width/2-randX);
        this.activeBlock = new Block(this, rightX-leftX, this.blocks.length, randX);
        this.blocks.push(this.activeBlock);

        if(canvas.height - (canvas.height/15*this.activeBlock.level)-this.activeBlock.height-this.screenY < canvas.height/2){
            this.targetScreenY -= canvas.height/15;
        }
    }
}

class Block {
    constructor(screen, width, level, x){
        // this.color = "hsl("+(level*15)%360+", 90%, 70%)";
        this.color = "hsl("+(level*10)%360+", 90%, 70%)";
        this.width = width;
        this.level = level;
        this.height = canvas.height/15;
        this.x = x;
        this.screen = screen;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x-this.width/2, canvas.height - (canvas.height/15*this.level)-this.height-this.screen.screenY, this.width, this.height);
    }
}

function initiateFrame(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

initiateFrame();
let screen = new Screen();
screen.draw();
alert("btw this is a wip");

function drawFrame(){
    initiateFrame();
    screen.draw();
}

document.addEventListener("keydown", event => {
    if(event.code === "Space"){
        screen.placeBlock();
    }
});

setInterval(drawFrame, 16)