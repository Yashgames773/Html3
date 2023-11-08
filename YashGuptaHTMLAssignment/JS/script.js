const canvas =document.getElementById('canvas1');
const ctx= canvas.getContext('2d');
const CANVAS_WIDTH= canvas.width =900 ;
const CANVAS_HEIGHT = canvas.height =600;


const playerImage= new Image();
playerImage.src="Player.png";

const spriteWidth=77.2;
const spriteHeight = 83.33;

// let frameX=0;
// let frameY=0;
// let x=0;
// let y= CANVAS_HEIGHT - spriteHeight;
// let vy=0;

// let speed=0;
// let keys=[];
// let weight=32;
// let dog_width=77;
// let dog_height=83;



//let gameFrame =0;
const staggerFrame = 8;
let animation="idle";
const spriteAnimations = [];
const animationStates = [
    {
        name:'idle',
        frame : 10,
    },
    {
        name:'jump',
        frame : 10,
    },
    {
        name:'land',
        frame : 10,
    },
    {
        name:'run',
        frame : 10,
    }
    
];

animationStates.forEach((state,index)=>{

    let frames = {
        loc: [], 
    }

    for (let j=0; j<state.frame ; j++){
        let positionX = j*spriteWidth;
        let positionY = index*spriteHeight;
        frames.loc.push({x:positionX,y:positionY});
    }
    spriteAnimations[state.name] = frames;
});

//console.log(spriteAnimations);


class InputHandler{

    
    constructor(){

        this.keys = [];
        this.touchY=" ";
        this.touchThreshold = 30;
        window.addEventListener('keydown',e =>{
            if (( e.key === 'ArrowDown' || 
                  e.key === 'ArrowUp' ||
                   e.key === 'ArrowLeft' ||
                  e.key === 'ArrowRight') 
                  && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }
    
            
            console.log(e.key,this.keys);
                
        });
    
        window.addEventListener('keyup',e =>{
            if (( e.key === 'ArrowDown' || 
                  e.key === 'ArrowUp' ||
                  e.key === 'ArrowLeft' ||
                  e.key === 'ArrowRight'))
                  
                {
                    this.keys.splice(this.keys.indexOf(e.key),1);
                }
    
            console.log(e.key,this.keys);
        });
    

        window.addEventListener('touchstart',e =>{
            this.touchY=e.changedTouches[0].pageY;
            console.log(e);
        });
        window.addEventListener('touchmove',e =>{
            const swipeDistance=e.changedTouches[0].pageY-this.touchY;
            if(swipeDistance < -this.touchThreshold && this.keys.indexOf("swipe up") == -1) this.keys.push("swipe up")
            //console.log(e.key,this.keys);
            //if(swipeDistance > this.touchThreshold  )
        });
        window.addEventListener('touchend',e =>{
            
            if( this.keys.indexOf("swipe up") > -1) this.keys.splice(this.keys.indexOf("swipe up"),1)
            //console.log(e.key,this.keys);
        });
    }

}


class Player{

    constructor(gameWidth,gameHeight,image){
        this.gameWidth=gameWidth;
        this.gameHeight=gameHeight;
        this.spriteWidth=77.2;
        this.spriteHeight=83.33;
        this.width=200;
        this.height=200;
        this.x=0;
        this.y=this.gameHeight-this.height;
        this.image=image;
        this.frameX=0;
        this.frameY=0;
        this.speed=0;
        this.vy=0;
        this.weight=0.5;
        this.position=0;
        this.rotation =0;
        this.isDestroyed = false;
    }


    draw(context){
        this.position =Math.floor(gameFrame/staggerFrame)%spriteAnimations[animation].loc.length;
        this.frameX=this.position*this.spriteWidth;
        gameFrame++;
        
   
        // Save the current transformation matrix
    context.save();

    // Translate the context to the center of the player's bounding box
    context.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Apply the rotation
    context.rotate((Math.PI / 180) * this.rotation);

    // Draw the player
    context.drawImage(
      this.image,
      this.frameX,
      this.frameY,
      this.spriteWidth,
      this.spriteHeight,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    // Restore the previous transformation matrix
    context.restore();
  
        this.frameY=spriteAnimations[animation].loc[this.position].y;
      //  context.drawImage(this.image,this.frameX , this.frameY, this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
    }

    update(input){

        if(input.keys.indexOf('ArrowRight') > -1 && !this.jump(input)){
            this.speed=5;
          //  animation="run";
        } else if (input.keys.indexOf('ArrowLeft') > -1 && !this.jump(input)){
            this.speed = -5;
          //  animation="run";
        } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround() || input.keys.indexOf("swipe up") >-1 ){
            this.vy=-30; 
            this.rotation = 45 * (this.vy < 0 ? -1 : 1); // Apply 45-degree rotation during the jump
        
         // Reset rotation when not jumping
     
           // animation="jump"
        } else {
            this.speed=0;
           
           
            //animation="idle"
        }



        //horizontal movement
        this.x+=this.speed;
        if(this.x<0) this.x =0;
        else if (this.x>this.gameWidth - this.width) this.x = this.gameWidth - this.width
        
        //vertical movement
        this.y +=this.vy;
        if (!this.onGround()){
           // animation="land"
        
            this.vy+=this.weight;
        } else {
            this.vy=0;
            //animation="idle"
        }
        if(this.y <0) this.y=0;
        if ( this.y > this.gameHeight - this.height){
            console.log(this.y);
            this.rotation = 0; 
            this.y = this.gameHeight - this.height;
        }
        
        
        
    }
    jump(input){
        if(input.keys.indexOf("ArrowUp")>-1 && this.onGround()){
            return true;
        }else{
            return false;
            
        }
    }
    onGround(){
        return this.y >= this.gameHeight - this.height; 
        
    }
     

    // isCollidingWithEnemy(enemy) {
    //     return (
    //         this.x < enemy.x + enemy.width &&
    //         this.x + this.width > enemy.x &&
    //         this.y < enemy.y + enemy.height &&
    //         this.y + this.height > enemy.y
    //     );
    // }
    isCollidingWithEnemy(enemy) {
        return (
            this.x + this.width * 0.2 < enemy.x + enemy.width * 0.8 &&  // Adjust the left boundary
            this.x + this.width * 0.8 > enemy.x + enemy.width * 0.2 &&  // Adjust the right boundary
            this.y + this.height * 0.2 < enemy.y + enemy.height * 0.8 &&  // Adjust the top boundary
            this.y + this.height * 0.8 > enemy.y + enemy.height * 0.2  // Adjust the bottom boundary
        );
    }
    

    destroy() {
        this.isDestroyed = true;
        this.x = -500;
     
    }
}

const input = new InputHandler();
const player = new Player(canvas.width,canvas.height,playerImage);



class particle{

    constructor(){
        this.x=player.x;
        this.y=player.y;
        this.size=Math.random()*7 + 3;
        this.speedY=Math.random()*5 - 0.4;
        this.color="red";
    }

    update(){

        this.x-=10;
        this.y=this.speedY;
    }

    draw(){
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI * 0.2);
        ctx.fill();
    }


}

class FireParticle {
    constructor(playerX, playerY) {
        this.x = playerX + player.width / 8; // Start particles from the center of the player
        this.y = playerY + player.height / 1.1;
        this.size = Math.random() * 7 + 3;
        this.speedY = Math.random() * 2 - 1; // Adjust speed for the fire effect
        this.color = "grey"; // Set the color to orange for a fire-like effect
    }

    update() {
        this.x -= 5; // Adjust the horizontal speed of the fire particles
        this.y += this.speedY;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
const fireParticles = [];
class WaterDroplet {
    constructor() {
        this.x = Math.random() * CANVAS_WIDTH; // Start droplets at a random horizontal position
        this.y = 0; // Start droplets at the top of the canvas
        this.size = Math.random() * 1 + 0.5;
        this.speedY = Math.random() * 1 + 0.5; // Adjust speed for the dripping water effect
        this.color = "lightblue"; // Set the color to blue for a water-like effect
    }

    update() {
        this.y += this.speedY;

        // Reset the position of the droplet if it goes off the bottom of the canvas
        if (this.y > CANVAS_HEIGHT) {
            this.x = Math.random() * CANVAS_WIDTH;
            this.y = 0;
            this.speedY = Math.random() * 2.5 + 2;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}



const waterDroplets = [];
let isGameOver = false; // Variable to track the game over state
let gameOverMessage = "Game Over"; // Initial game over message

const restartButton = {
    x: CANVAS_WIDTH / 2 - 50,
    y: CANVAS_HEIGHT / 2,
    width: 150,
    height: 40,
};

function handleRestartClick(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    if (
        mouseX >= restartButton.x &&
        mouseX <= restartButton.x + restartButton.width &&
        mouseY >= restartButton.y &&
        mouseY <= restartButton.y + restartButton.height
    ) {
        // Restart the game
        isGameOver = false;
        player.isDestroyed = false;
        player.x = 0;
        player.y = CANVAS_HEIGHT - player.height;
        gameFrame = 0;
        score = 0; // Reset the score to 0

        // Remove the click event listener
        canvas.removeEventListener("click", handleRestartClick);
    }
}

let gameSpeed = -2;
let gameFrame = 0;
const backgroundLayer1 = new Image();
backgroundLayer1.src = 'layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'layer-5.png';

console.log()
class Layer {
    constructor(image, speedModifier) {

        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;

        
    }

    update() {
        this.speed = gameSpeed * this.speedModifier;
        this.x = gameFrame * this.speed % this.width;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x +this.width, this.y, this.width, this.height);
    }

}

const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.6);
const layer4 = new Layer(backgroundLayer4, 0.8);
const layer5 = new Layer(backgroundLayer5, 1);

const gameObjects = [layer1, layer2, layer3, layer4, layer5];
let score = 0;

// Create a function to draw the score
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, CANVAS_WIDTH - 150, 30);
}
let isGameRunning = true; // Variable to control whether the game is running
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (isGameRunning) { // Check if the game is running
    gameObjects.forEach(object => {
        object.update();
        object.draw();
        player.draw(ctx);
      enemy.draw(ctx);
     enemy.update();
     if (!isGameOver) {
        // Increase the score in every frame
        score++;
    }
     // Update the score
  drawScore();

       // Update and draw the fire particles
    for (let i = fireParticles.length - 1; i >= 0; i--) {
        fireParticles[i].update();
        fireParticles[i].draw();

        // Remove fire particles that are off-screen
        if (fireParticles[i].x < 0) {
            fireParticles.splice(i, 1);
        }
    }

    // Create new fire particles at a specific interval
    if (gameFrame % 5 === 0) {
        fireParticles.push(new FireParticle(player.x, player.y));
    }
       // Update and draw the water droplets
       for (let i = waterDroplets.length - 1; i >= 0; i--) {
        waterDroplets[i].update();
        waterDroplets[i].draw();

        // Remove water droplets that are off-screen
        if (waterDroplets[i].x < 0) {
            waterDroplets.splice(i, 1);
        }
    }

    // Create new water droplets at a specific interval
    if (gameFrame % 10 === 0) {
        waterDroplets.push(new WaterDroplet(player.x, player.y));
    }
     if (!player.isDestroyed) {
        player.draw(ctx);
        player.update(input);

        if (player.isCollidingWithEnemy(enemy)) {
            // Destroy the player
            player.destroy();
            
        }
    }
    if (player.isDestroyed && !isGameOver) {
        isGameOver = true;
        // Set the game over message
        gameOverMessage = "You collided with the enemy!";
    
        // Add event listener for clicking the restart button
        canvas.addEventListener("click", handleRestartClick);
    } 
    
});
//player.update(input);

    gameFrame--;
   
    if (isGameOver) {
        ctx.fillStyle = "white";
        ctx.font = "36px Arial";
        ctx.fillText(gameOverMessage, CANVAS_WIDTH / 2 - 180, CANVAS_HEIGHT / 2 - 50);

        // Draw the restart button
        ctx.fillStyle = "green";
        ctx.fillRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);
        ctx.fillStyle = "white";
        ctx.fillText("Restart", restartButton.x + 20, restartButton.y + 30);
    }

    requestAnimationFrame(animate);
}}
class Enemy {
    constructor(gameWidth, gameHeight, image) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.spriteWidth = 127;
        this.spriteHeight = 128;
        this.width = 200;
        this.height = 200;
        this.x =this.gameWidth; // Start from the right side of the screen
        this.y = this.gameHeight - this.height;
        this.image = image;
        this.speed = -1; // Move from right to left
        this.animationStates = {
            idle: { frames: 6, frameX: 0, frameY: 10 },
            // Add more animation states for the enemy here
        };
        this.currentState = 'idle'; // Initial state
        this.animationFrame = 6;
        this.animationSpeed = 1; // Adjust this value to control animation speed (lower is slower)
        this.frameCounter =0;
    }

    draw(context) {
        const { frameX, frameY } = this.animationStates[this.currentState];
        if (this.speed < 0) {
            // If the enemy is moving to the right, flip the sprite horizontally
            context.save();
            context.scale(-1, 1); // Flip horizontally
            context.drawImage(
                this.image,
                frameX,
                frameY,
                this.spriteWidth,
                this.spriteHeight,
                -this.width - this.x, // Negative x-coordinate to flip horizontally
                this.y,
                this.width,
                this.height
            );
            context.restore(); // Restore the context to its original state
        } else {
            // Enemy is moving to the left or idle, no need to flip
            context.drawImage(
                this.image,
                frameX,
                frameY,
                this.spriteWidth,
                this.spriteHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }


    update() {
        this.x += this.speed;

        // Check if the enemy has moved off the left side of the screen and reset its position to the right side
        if (this.x + this.width < 0) {
            this.x = this.gameWidth;
        }

        // Update the animation frame
        this.frameCounter++;
        if (this.frameCounter/20 >= this.animationSpeed) {
            this.animationFrame = (this.animationFrame + 1) % this.animationStates[this.currentState].frames;
            const frameIndex = Math.floor(this.animationFrame);
            this.animationStates[this.currentState].frameX = frameIndex * this.spriteWidth;
            this.frameCounter = 0; // Reset the frame counter
        }
    }
}

// Load the enemy image
const enemyImage = new Image();
enemyImage.src = 'Run.png'; // Replace 'enemy.png' with the actual image source

// Initialize the enemy
const enemy = new Enemy(canvas.width, canvas.height, enemyImage);

animate();
