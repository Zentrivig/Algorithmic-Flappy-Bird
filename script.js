let birdimg;

let bird = {pos:360, vel:0, dir:0};
let jump = true;

const jumpPower = 8;
const gForce = 0.3;
const birdSpeed = 3;
const seperation = 180; // measured in frames
const gapSize = 130;

let bars = [];

let childFrameCount;
let frameCut = 0;
let child = 1;
let score = 0;
let highscore = 0;

let delta = {x:0,y:0};
let input = {x:0,y:0};
let output = 0;

const fpsBoost = 2; // {x | x >= 1 , x ∈ ℤ }

let updateFrame = 0;




function preload() {
    birdimg = loadImage('assets/bird.png');
}

function setup() {
    createCanvas(1280,720);
    imageMode(CENTER);
    birdimg.resize(50,38);
    angleMode(DEGREES);
    generateBar(round(random(10,1000)));
    
}

function generateBar(barpos) {

    bars.push(1280,0,30,barpos/2);
    bars.push(1280,barpos/2+gapSize,30,720);

}



function update() {
    for (let bigI = 0; bigI < fpsBoost; bigI++) {
        updateFrame++;
        if(jump == true) { bird.vel = jumpPower; jump = false;}
        bird.vel = round(bird.vel-gForce,1); // Apply gravity
        bird.pos = round(bird.pos-bird.vel); // Apply velocities
        bird.dir = -bird.vel/0.8;
        childFrameCount = (updateFrame) - frameCut;
        score = round(childFrameCount); // score system
        delta.x = bars[0] - 70;
        delta.y = (bars[3]+bars[5])/2 - bird.pos;
        input.x = round(map(delta.x, -125, 1210, 1, 0),2);
        input.y = round(map(delta.y, -640, 640, 0, 1),2);

        if(delta.y < -50) {
            jump = true;
        }
        
        if(bars[0] < -60) { for (let i = 0; i < 4; i++) {
            bars.shift();  // deletes unused bars
        } }
        if( /*topbar*/ bird.pos < bars[3] && bars[0] < 90 && bars[0] > 50       || // kill conditions
            /*bottombar*/ bird.pos > bars[5] && bars[0] < 90 && bars[0] > 50    ||
            /*ground*/ bird.pos > 720) { 
            kill();;
        }
        for (let i = 0; i < bars.length; i++) {
            if(i/4 == round(i/4)){
                bars[i] = bars[i] - birdSpeed;
        } }
        if((childFrameCount)/seperation == round((childFrameCount)/seperation)){ // executes every seperation frames
        generateBar(round(random(10,1000)));
        }

    }
}
function kill() {

    
    bird = {pos:360, vel:0, dir:0};
    jump = true;
    bars = [];

    frameCut = (updateFrame);
    child = child+1;

    generateBar(round(random(10,1000)))

    if(highscore < score) {highscore = score}
}

function mousePressed() {
    if(bird.pos > 50){
    jump = true;
    }
    if(mouseButton === RIGHT) {kill();}
}

function displayVariables() {
    fill(0,255,0);
    strokeWeight(0);  
    textSize(12);   
    text('mouseX = ' + mouseX, 10, 20 +15 * 0);
    text('mouseY = ' + mouseY, 10, 20 +15 * 1);
    text('bird.pos = ' + bird.pos, 10, 20 +15 * 2);
    text('bird.vel = ' + bird.vel, 10, 20 +15 * 3);
    text('jump = ' + jump, 10, 20 +15 * 4);
    text('bars = ' + bars, 10, 20 +15 * 5);
    text('frameCount = ' + (updateFrame), 10, 20 +15 * 6);
    text('frameRate = ' + round(frameRate()*fpsBoost), 10, 20 +15 * 7);
    text('fpsBoostEffectiveness = ' + (round(frameRate())), 10, 20 +15 * 8);

    text('childFrameCount = ' + childFrameCount, 10, 20 +15 * 10);
    text('child = ' + child, 10, 20 +15 * 11);
    text('score = ' + score, 10, 20 +15 * 12);
    text('highscore = ' + highscore, 10, 20 +15 * 13);

    text('delta.x = ' + delta.x, 10, 600 +15 * 0);
    text('delta.y = ' + delta.y, 10, 600 +15 * 1);
    text('input.x = ' + input.x, 10, 600 +15 * 2);
    text('input.y = ' + input.y, 10, 600 +15 * 3);
    text('output = ' + round(output,2), 10, 600 +15 * 4);
}

function displayAiEyes() {
    stroke(50);
    strokeWeight(5);

    line(70,bird.pos,70,(bars[3]+bars[5])/2);
    line(70,(bars[3]+bars[5])/2, bars[0], (bars[3]+bars[5])/2);

    textSize(15);
    fill(255,255,0);
    strokeWeight(0);
    text(delta.y, 75, (bird.pos+(bars[3]+bars[5])/2)/2)
    text(delta.x, (70+bars[0])/2, (bars[3]+bars[5])/2-10)
}

function draw() {

        update();
        
        background(60,80,250);

        displayVariables();

        displayAiEyes();

        stroke(50,230,32);



        for (let i = 0; i < bars.length/4; i++) {
            fill(43, 161, 0);
            strokeWeight(5);
            stroke(0);
            rect(bars[0+4*i],bars[1+4*i],bars[2+4*i],bars[3+4*i]);
        } 


        //draw environment
        stroke(161,105,0);
        point(0,0);
        strokeWeight(60);
        line(0,720,1280,720);
        stroke(133, 240, 0);
        strokeWeight(8);
        line(0,690,1280,690);
        strokeWeight(7);

        // draw bird
        translate(70, bird.pos);
        rotate(bird.dir);
        image(birdimg, 0, 0);
}