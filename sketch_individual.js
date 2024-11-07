// declare all the global variables
// global variables will be used throughout the functions
let skyShape, waterShape, greenShape, boardwalkShape; // colour map overlays for the left image
let skyFlippedShape, waterFlippedShape, greenFlippedShape, boardwalkFlippedShape; // flipped colour map overlays for the right image
let skyCircles = [], waterCircles = [], greenCircles = [], boardwalkCircles = []; // arrays to store circles for each shape
let imgAspectRatio; // aspect ratio for resizing
let skyColour, waterColour, greenColour, boardwalkColour; // define colours for each shape
let frameCounter = 0; // frame counter to control the animation speed
let circleScaleFactor = 1;  // initialized the scale factor for the circles
const MAX_SCALE = 3;  // set maximum scaling factor for circles
const MIN_SCALE = 0.5; // set the minimum scaling factor for circles
let speedFactor = 1;  // normal speed factor
const MAX_SPEED = 5;  // upper limit for the speed of circle animation
const MIN_SPEED = 0.1; // lower bound for the circles' speed
let redFilter = false; // used a boolean to check if the red heatwave is true
let flickerSpeed = 5; // set a speed for the red flicker
let flickerChance = 0.05; // assigned a low chance of the red heatwave appearing
let originalCircleScaleFactor = 1;  // stored the original value for circle scaling
let originalSpeedFactor = 1;        // stored the the original value for speed too
let blueFilter = false; // tracked the blue filter state as well
let screamers = []; // made an empty class to store the screamers from pressing 'o'

//preload the images
//these images will be used as a guide for the color map
function preload() {
    screamImg = loadImage("assets/scream.jpg"); // loads but doesn't display
    skyShape = loadImage("assets/skyColourMap.png"); //file for the sky colour map
    waterShape = loadImage("assets/waterColourMap.png"); //path for the water colour map
    greenShape = loadImage("assets/greenColourMap.png"); //path for the green colour map
    boardwalkShape = loadImage("assets/boardwalkColourMap.png"); //path for the boardwalk
    
    // we're going to create a flipped version of the art
    // to fill up the whole screen
    // added flipped assets using https://flip.imageonline.co/ to add complexity
    skyFlippedShape = loadImage("assets/skyFlippedColourMap.png");
    waterFlippedShape = loadImage("assets/waterFlippedColourMap.png");
    greenFlippedShape = loadImage("assets/greenFlippedColourMap.png");
    boardwalkFlippedShape = loadImage("assets/boardwalkFlippedColourMap.png");

    screamerCoded = loadImage("assets/screamerCoded.png"); //loaded an image of the coded screamer
    //used https://www.remove.bg/upload to remove its background to prevent interference with canvas
}

//
function setup() { //for the animation
    frameRate(30); //adjusted to reduce load time
    imgAspectRatio = screamImg.width / screamImg.height; //gets aspect ratio by dividing width and height of image
    resizeCanvasToFitWindow(); //resized canvas
    screamImg.loadPixels(); //got the pixels for the image 'The Scream' Munch (1983) using https://p5js.org/reference/p5/loadPixels/ for colour mapping
    skyShape.loadPixels(); //got the pixels for the sky
    waterShape.loadPixels(); //got the pixels for the water
    greenShape.loadPixels(); //got the pixels for the green bush
    boardwalkShape.loadPixels(); //got the pixels for the boardwalk

    // loaded the pixels for the flipped images
    skyFlippedShape.loadPixels();  
    waterFlippedShape.loadPixels();
    greenFlippedShape.loadPixels();
    boardwalkFlippedShape.loadPixels();
    
    //sets the colour for the sky, water, green, boardwalk
    skyColour = color(255, 116, 2); //set a blue colour
    waterColour = color(2, 2, 255); //also set blue
    greenColour = color(30, 255, 0); //set green
    boardwalkColour = color(153, 43, 0); //set a brown shade

    // initialized circles for the original and flipped images
    initializeCircles(skyCircles, skyShape, skyColour, 2000, 0.3, 0, 16); //set parameters to control for opacity etc.
    initializeCircles(waterCircles, waterShape, waterColour, 2000, 0.3, -0.15, 14);
    initializeCircles(greenCircles, greenShape, greenColour, 2000, 0.15, -0.25, 12);
    initializeCircles(boardwalkCircles, boardwalkShape, boardwalkColour, 7000, -0.3, -0.4, 10);
}

function resetCanvas() {
  // reset the scale and speed factors to their original values
  circleScaleFactor = originalCircleScaleFactor;
  speedFactor = originalSpeedFactor;  // reset the speed factor to normal
  console.log("Animation reset to default values."); //prevents errors
}

function keyPressed() { //added user interaction where pressing right arrow
    if (keyCode === RIGHT_ARROW) { 
    circleScaleFactor *= 1.1; //increases circle size by a factor of 10%
    circleScaleFactor = min(circleScaleFactor, MAX_SCALE); //upper bound
  }

  if (keyCode === LEFT_ARROW) { //added left arrow interaction
    circleScaleFactor *= 0.9; //decreases scale factor by 10% each time
    circleScaleFactor = max(circleScaleFactor, MIN_SCALE); //set lowest limit
  }

  if (keyCode === UP_ARROW) { //added up arrow interaction to increase circle speed
    speedFactor *= 1.1;  // increase speed by 10%
    speedFactor = min(speedFactor, MAX_SPEED);  // ensured a limit to speed
  }

  if (keyCode === DOWN_ARROW) { //down arrow to reduce circle speed
    speedFactor *= 0.9;  // decreased speed by around 10%
    speedFactor = max(speedFactor, MIN_SPEED);  // enforced a minimum speed 
  }

  if (key === 'r' || key === 'R') { //added heatwave red flicker when 'r' pressed or 'R'
    redFilter = true; // enabled the red filter when r is pressed
  }

  if (key === 'b' || key === 'B') { //a blue filter to mimic chills or the cold
    blueFilter = true; // creates a blue filter when "b" or "B" is pressed 
  }

  if (key === "o" || key === "O") { //added multiple screamers when "O" is pressed
    // Create a new screamer object with random x position and fixed y position at the bottom
    screamers.push({
        x: random(width),  // random x position
        y: height,         // fixed y position at the bottom of the canvas
        img: screamerCoded     // image for the screamer from assets path
    }); 
  }

    if (key === 'x' || key === 'X') {
      redFilter = false; // turns off the red filter when "x" is pressed
      blueFilter = false; //switches off the blue filter when pressed
      screamers = []; //clears out the screamers
      resetCanvas(); // Optionally reset the canvas as well
    }
}

function applyFilters() { //adds the blue filter or resets it
  if (blueFilter) {
    background(169, 207, 231); //changes the background color to blue when the blue filter is enabled
  } else {
    background(0); // standard black background when no filter is activated
  }
}
function draw() {
  background(0); // clear canvas
  applyFilters(); //applies the filters was inspired by https://p5js.org/reference/p5/filter/ to add visual interest
  // Random chance for flicker effect
  if (random() < flickerChance && redFilter) {
    fill(255, 0, 0, 100); // applied red color overlay with some transparency
    rect(0, 0, width, height); // covers the entire canvas with the red overlay
  }


  frameCounter++; // frame counter increments to increase the speed

  // creates the image on both the left and right halves
  for (let i = 0; i < 2; i++) {
    push(); // saved the current transformation
    translate(i * width / 2, 0); // shifts to the left or right half of the canvas

    if (i === 0) {
      // draw circles for left half of image (normal) for each object
      moveAndDrawCircles(skyCircles, skyShape, skyColour); //sky
      moveAndDrawCircles(waterCircles, waterShape, waterColour); //water
      moveAndDrawCircles(greenCircles, greenShape, greenColour); //green
      moveAndDrawCircles(boardwalkCircles, boardwalkShape, boardwalkColour); //boardwalk
      
      // drew the screamer figure
      drawScreamer();
    } else {
      // right half (flipped images)
      scale(-1, 1); // flip the objects horizontally
      translate(-width / 2, 0); // moved the origin back into the canvas

      moveAndDrawCircles(skyCircles, skyFlippedShape, skyColour); //flipped sky
      moveAndDrawCircles(waterCircles, waterFlippedShape, waterColour); //flipped water
      moveAndDrawCircles(greenCircles, greenFlippedShape, greenColour); //flipped green
      moveAndDrawCircles(boardwalkCircles, boardwalkFlippedShape, boardwalkColour); // the flipped boardwalk

      // drew the flipped screamer figure
      drawScreamer();
       // drew each screamer in the screamers array
    for (let i = 0; i < screamers.length; i++) {
      let screamer = screamers[i];
      screamer.y -= 2; // moved the screamer upwards over time

      // drew the screamer image at the new position
      image(screamer.img, screamer.x, screamer.y, screamImg.width * 0.1, screamImg.height * 0.1);
  }

      
      
    }

    pop(); // restored state
  }


}

//defined a function to built and drive circles with specific features added to an array  
function initializeCircles(circles, shape, colour, count, xSpeed, ySpeed, size) {
    for (let i = 0; i < count; i++) { 
        let { x: xPos, y: yPos } = findRandomColourPosition(shape, colour, false); //finds xy coordinate within the shape with that colour
        let initialColour = getCachedColour(screamImg, int(xPos), int(yPos)); //retrieves original colour from screamImg as seen in https://p5js.org/reference/p5/get/

        circles.push({ //adds the circle to the array
            x: xPos,
            y: yPos,
            size: size + random(5), //randomly adds
            opacity: 0, //beginning opacity for glittery effect
            fadeIn: true, //circles fade in
            delay: int(random(30, 150)), //added delay
            opacityDecayRate: random(1, 3), //smooth darkening
            currentColour: initialColour, //set initial colour
            targetColour: initialColour, //also set as initial colour
            xSpeed: xSpeed, //x-speed value
            ySpeed: ySpeed //y-speed value
        });
    }
}

//function to find coordinate where colour is matched
function findRandomColourPosition(shape, colour, isFlipped = false) { 
  let x, y;
  let attempts = 0;
  const maxAttempts = 1000;  //set a maximum attempt to prevent lag

  do { //generates random coordinates, checks colour match, and if max attempts are reached
      x = int(random(isFlipped ? width / 2 : 0, isFlipped ? width : width / 2));
      y = int(random(height));
      attempts++;
      if (attempts >= maxAttempts) {
          console.error("max attempts reached: unable to find matching colour");
          break;
      }
  } while (!isShapeColour(getCachedColour(shape, x, y), colour) || isPositionNearScreamer(x, y)); //checks if near screamer
  return { x, y }; 
}

function isPositionNearScreamer(x, y) {
    //adjusts the bounding box of the screamer shape to avoid overlap
    const screamerBounds = {
        xMin: 188, xMax: 374,  //horizontal bounds
        yMin: 487, yMax: 880   //vertical bounds 
    };
    return x > screamerBounds.xMin && x < screamerBounds.xMax && y > screamerBounds.yMin && y < screamerBounds.yMax;
} 

// to animate each circle within a specific shape
// we use this function
// this function updates the position, color, and opacity
// of each circle and reposition circles that have faded out completely
// function to animate each circle within a specific shape
function moveAndDrawCircles(circles, shape, shapeColour) {
  let buffer = 16; // allow circles to move slightly beyond the screen edges before resetting

for (let i = 0; i < circles.length; i++) {
  let circle = circles[i];

  // start moving and fading in after delay
  if (frameCounter >= circle.delay) {
    // only modify the position update based on the speed factor
    circle.x += circle.xSpeed * speedFactor; // Apply speedFactor to the x-position update
    circle.y += circle.ySpeed * speedFactor; // Apply speedFactor to the y-position update

    // update color every few frames
    if (frameCounter % 5 === 0) {
      let newTargetColour = getCachedColour(screamImg, int(circle.x), int(circle.y));
      circle.targetColour = newTargetColour; // set new target colour
    }

    // interpolate between current and target colour
    // reference: https://p5js.org/reference/p5/lerpColor/ 
    circle.currentColour = lerpColor(circle.currentColour, circle.targetColour, 0.1);

    // handled fade in and fade out
    if (circle.fadeIn) {
      circle.opacity += 12.5; // increase opacity more slowly (was 25)
      if (circle.opacity >= 255) {
        circle.opacity = 255;
        circle.fadeIn = false; // switch to fading out
      }
    } else {
      circle.opacity -= circle.opacityDecayRate; // fade out more slowly
      if (circle.opacity <= 0) {
        // reset circle when fully faded out
        let newPosition = findRandomColourPosition(shape, shapeColour);
        circle.x = newPosition.x; // reset x position
        circle.y = newPosition.y; // reset y position
        circle.opacity = 0; // reset opacity
        circle.fadeIn = true; // start fading in again
        circle.delay = frameCounter + int(random(30, 300)); // set new delay with greater randomness
        circle.currentColour = getCachedColour(screamImg, int(circle.x), int(circle.y));
        circle.targetColour = circle.currentColour; // reset colours
      }
    }

    // apply scale factor to circle size
    let scaleFactor = height / 812;
    fill(red(circle.currentColour), green(circle.currentColour), blue(circle.currentColour), circle.opacity);
    noStroke();
    ellipse(circle.x, circle.y, circle.size * scaleFactor * circleScaleFactor, circle.size * scaleFactor * circleScaleFactor);
  }

  // reset if circle moves off screen, with a 20px buffer
  if (circle.x < -buffer || circle.x > width + buffer || circle.y < -buffer || circle.y > height + buffer) {
    let newPosition = findRandomColourPosition(shape, shapeColour);
    circle.x = newPosition.x;
    circle.y = newPosition.y;
    circle.opacity = 0;
    circle.fadeIn = true;
    circle.delay = frameCounter + int(random(30, 300));
    circle.currentColour = getCachedColour(screamImg, int(circle.x), int(circle.y));
    circle.targetColour = circle.currentColour;
  }
}
}


// we need to find the colour the random position in a given shape
// where the pixel colour matches a specific colour
// the purpose is to place the circles in areas of a specific colour
function findRandomColourPosition(shape, colour, isFlipped = false) {
  let x, y; // declare variables for x & y coordinates
  let attempts = 0; // initialize attempts
  const maxAttempts = 1000; // set the max attempts allowed to find matching colour
 
  // repeat until the pixel matches a specified colour or attempts exceeds limit
  // the do-while loop is used because we want to run the code at least once
  // reference: https://www.w3schools.com/jsref/jsref_dowhile.asp
  do {
      x = int(random(isFlipped ? width / 2 : 0, isFlipped ? width : width / 2));
      y = int(random(height));
      attempts++;
      if (attempts >= maxAttempts) {
          console.error("max attempts reached: unable to find matching colour");
          break;
      }
  } while (!isShapeColour(getCachedColour(shape, x, y), colour));
  return { x, y };
}

//to check if pixelColour matches shapeColour
function isShapeColour(pixelColour, shapeColour) {
    return red(pixelColour) === red(shapeColour) &&
           green(pixelColour) === green(shapeColour) &&
           blue(pixelColour) === blue(shapeColour);
}
//retrieves colour from coordinates through pixels
function getCachedColour(image, x, y) {
    let index = (x + y * image.width) * 4;
    return color(image.pixels[index], image.pixels[index + 1], image.pixels[index + 2]);
}

function drawScreamer() {
  noStroke(); // ensures no outlines are drawn around shapes

  // the screamer was originally made without accounting for window resize,
  // the scale factor was created based on the windows height in comparison
  // to the height of the original proportions of the screamer at the optimal height
  // with scaleFactor being added to each element ensuring correct sizing for current window height
  let scaleFactor = height / 830;
  let verticalOffset = 80 * scaleFactor;

  // Draw bodies main shape with curves
  fill(76, 63, 55); // body color
  beginShape();
  curveVertex(202 * scaleFactor, height); // start from bottom left of the screen
  curveVertex(202 * scaleFactor, 752 * scaleFactor); // curve down towards body base
  curveVertex(206 * scaleFactor, 692 * scaleFactor); // upward curve to define waist
  curveVertex(188 * scaleFactor, 651 * scaleFactor); // curve inwards for shape contour
  curveVertex(209 * scaleFactor, 593 * scaleFactor); // define shoulder area
  curveVertex(222 * scaleFactor, 533 * scaleFactor); // further shape upper body
  curveVertex(271 * scaleFactor, 509 * scaleFactor); // neck and head start
  curveVertex(249 * scaleFactor, 434 * scaleFactor); // further curve for neck
  curveVertex(300 * scaleFactor, 387 * scaleFactor); // head curve start
  curveVertex(365 * scaleFactor, 427 * scaleFactor); // complete head shape
  curveVertex(345 * scaleFactor, 520 * scaleFactor); // outline back to body
  curveVertex(374 * scaleFactor, 610 * scaleFactor); // lower body
  curveVertex(305 * scaleFactor, 738 * scaleFactor); // return to lower body area
  curveVertex(305 * scaleFactor, height); // complete body outline at bottom right
  endShape(CLOSE);

  // draw his hand - positioned near upper part of the body
  fill(211, 164, 103); // hand color
  beginShape();
  curveVertex(246 * scaleFactor, 567 * scaleFactor); // hand start
  curveVertex(271 * scaleFactor, 509 * scaleFactor); // move to lower hand section
  curveVertex(249 * scaleFactor, 434 * scaleFactor); // curve up to hand contour
  curveVertex(300 * scaleFactor, 387 * scaleFactor); // hand wrist area
  curveVertex(365 * scaleFactor, 427 * scaleFactor); // base of fingers
  curveVertex(345 * scaleFactor, 520 * scaleFactor); // up along fingers
  curveVertex(374 * scaleFactor, 610 * scaleFactor); // back down along hand
  curveVertex(353 * scaleFactor, 617 * scaleFactor); // close off hand shape
  curveVertex(318 * scaleFactor, 542 * scaleFactor); // hand thumb area
  curveVertex(340 * scaleFactor, 450 * scaleFactor); // fingers continue
  curveVertex(285 * scaleFactor, 457 * scaleFactor); // top of hand contour
  curveVertex(296 * scaleFactor, 505 * scaleFactor); // lower back of hand
  curveVertex(263 * scaleFactor, 587 * scaleFactor); // base of hand near wrist
  endShape(CLOSE);

  // draw face: contour of the face structure
  fill(163, 144, 105); // face color
  beginShape();
  curveVertex(295 * scaleFactor, 514 * scaleFactor); // face outline start
  curveVertex(284 * scaleFactor, 484 * scaleFactor); // top of face
  curveVertex(263 * scaleFactor, 447 * scaleFactor); // curve down left side of face
  curveVertex(293 * scaleFactor, 389 * scaleFactor); // lower chin area
  curveVertex(351 * scaleFactor, 422 * scaleFactor); // right side of face
  curveVertex(342 * scaleFactor, 469 * scaleFactor); // return to top right of face
  curveVertex(329 * scaleFactor, 492 * scaleFactor); // finish contour
  curveVertex(313 * scaleFactor, 513 * scaleFactor); // end at chin
  endShape(CLOSE);

  //  eyes and mouth to define facial expression
  fill(216, 181, 117); // color for expression details
  ellipse(290 * scaleFactor, 440 * scaleFactor, 20 * scaleFactor, 30 * scaleFactor); // left eye
  ellipse(325 * scaleFactor, 440 * scaleFactor, 20 * scaleFactor, 30 * scaleFactor); // right eye
  ellipse(308 * scaleFactor, 490 * scaleFactor, 15 * scaleFactor, 30 * scaleFactor); // mouth
}
  
//resized canvas to fit the windowbased on height and aspect ratio
function resizeCanvasToFitWindow() {
  let newWidth = windowWidth; // Use window width instead of calculating from height
  let newHeight = windowHeight;

  resizeCanvas(newWidth, newHeight);
  
  // Calculate the width for each half of the screen
  let halfWidth = newWidth / 2;
  
  // Resize all images to fill half the screen width while maintaining aspect ratio
  screamImg.resize(halfWidth, newHeight);
  skyShape.resize(halfWidth, newHeight); 
  waterShape.resize(halfWidth, newHeight); 
  greenShape.resize(halfWidth, newHeight); 
  boardwalkShape.resize(halfWidth, newHeight);
  
  // Resize flipped images
  skyFlippedShape.resize(halfWidth, newHeight); 
  waterFlippedShape.resize(halfWidth, newHeight); 
  greenFlippedShape.resize(halfWidth, newHeight); 
  boardwalkFlippedShape.resize(halfWidth, newHeight);
}