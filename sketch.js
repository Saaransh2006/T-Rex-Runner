var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage,groundImage2;
var cloudsGroup,cloudImage,moonImg;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var gameOver, restart,level;

localStorage["HighestScore"] = 0;

function preload(){
  jump = loadSound("jump.mp3");
  error = loadSound("error.mp3");
  checkPoint = loadSound("checkPoint.mp3");

  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  groundImage2 = loadImage("ground3.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  moonImg = loadImage("moon.png");
}

function setup() {
  createCanvas(600, 190);
    
  ground = createSprite(-1000,180,2375,12);
  ground.addImage(groundImage);

  ground2 = createSprite(1375,180,2375,12);
  ground2.addImage(groundImage);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.velocityX = (6 + 2*score/100);
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  level = 0;
}

function draw() {
  //trex.debug = true;
  background("lightBlue");

  invisibleGround.x = trex.x;
  console.log(ground.x);

  if(ground.x + ground.width/2 < trex.x - 100) {
    ground.x = ground2.x + ground2.width/2;
  }

  if(ground2.x + ground2.width/2 < trex.x - 100) {
    ground2.x = ground.x + ground.width/2;
  }

  if (gameState === PLAY){
    score = score = score + Math.round((Math.round(getFrameRate()/60))*0.5);
    trex.velocityX = (6 + 2*score/100);
  
    if(trex.y >= 159) {
      if(keyDown(UP_ARROW)) {
        trex.velocityY = -14;
        jump.play();
      }
    }

    if(trex.y >= 159) {
      if(keyDown("space")) {
        trex.velocityY = -11;
        jump.play();
      }
    }

    if(score > 800) {
      background("black");
      ground.addImage(groundImage2);
      ground2.addImage(groundImage2);
      moon = createSprite(camera.position.x - 250,40,10,10);
      moon.addImage(moonImg);
      moon.scale = 0.4;
      moon.lifetime = 2;
      moon.depth = trex.depth;
      trex.depth = trex.depth + 1;
    }
  
    if (score > 0 && score % 200 === 0) {
      checkPoint.play();
      level = score/200;
    }

    trex.velocityY = trex.velocityY + 0.8
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      error.play();
    }
  }

  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    gameOver.x = camera.position.x;
    restart.x = camera.position.x;

    if(score > 800) {
      background("black");
      ground.addImage(groundImage2);
      ground2.addImage(groundImage2);
      moon = createSprite(camera.position.x - 250,40,10,10);
      moon.addImage(moonImg);
      moon.scale = 0.4;
      moon.lifetime = 2;
      moon.depth = trex.depth;
      trex.depth = trex.depth + 1;
    }
    
    //set velcity of each game object to 0
    trex.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || keyDown("space") || keyDown(UP_ARROW)) {
      reset();
    }
  }
  
  drawSprites();

  fill("red")
  textSize(20);
  textStyle(BOLD);
  textFont("cursive");
  text("Score: "+ score, camera.position.x + 185,30);
  camera.position.x = trex.x + 200;
  text("Levels completed: " + level, camera.position.x - 50,30);
  if(score < 800) {
    fill("black");
    textSize(15);
    text("Press Up Arrow for",camera.position.x - 285,20);
    text("a high jump and",camera.position.x - 285,40);
    text("'Space' for a",camera.position.x - 285,60);
    text("short jump",camera.position.x - 285,80);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 30 === 0) {
    var cloud = createSprite(trex.x + 550,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    cloud.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(trex.x + 550,165,10,40);
    //obstacle.debug = true;

    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }

  else if(frameCount % 50 === 0 && score > 800) {
    var obstacle0 = createSprite(trex.x + 550,165,10,40);
    //obstacle0.debug = true;

    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle0.addImage(obstacle1);
              break;
      case 2: obstacle0.addImage(obstacle2);
              break;
      case 3: obstacle0.addImage(obstacle3);
              break;
      case 4: obstacle0.addImage(obstacle4);
              break
      case 5: obstacle0.addImage(obstacle5);
              break;
      case 6: obstacle0.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle0.scale = 0.5;
    obstacle0.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle0);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  ground.addImage(groundImage);
  ground2.addImage(groundImage);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  level = 0;
}