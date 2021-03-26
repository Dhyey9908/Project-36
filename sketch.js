var dog, dogImage, happyDog;
var database;
var foodS, foodStock;
var feedPet, addFood;
var fedTime, lastFed;
var foodObj;

function preload() {
   dogImage = loadImage("Dog.png");
   happyDog = loadImage("happy dog.png");
  }

//Function to set initial environment
function setup() {
  database = firebase.database();
  createCanvas(800,800);
  
  foodObj = new Food();

  dog = createSprite(650,300,150,150);
  dog.addImage(dogImage);
  dog.scale = 0.2;

  
  foodStock = database.ref('Food');
  foodStock.on("value",  readStock);
  //textSize(20); 

  feed = createButton("Feed the Dog 🥛");
  feed.position(500, 100);
  feed.mousePressed(feedPet);

  addfood = createButton("Add Food");
  addfood.position(615, 100);
  addfood.mousePressed(addFood);
}

function draw() {
  background(46,139,87);
  foodObj.display();
 
  fedTime = database.ref('FeedTime');
  fedTime.on('value', function(data){
  lastFed = data.val();
});
fill("darkred");
if(lastFed >=12){
  text("Last Feed:" + lastFed % 12 + 'PM', 630, 30);
} else if(lastFed == 0){
  text("Last Feed: 12 AM", 630, 30);
}else {
  text("Last Feed:" + lastFed +'AM', 630, 30);
}

  drawSprites();
  fill("darkred");
  stroke("black");
  text("Food Left: " + foodS, 50, 100);
 // textSize(13);
  //text("Hint: Feed the Dog 🥛 by Pressing the Up Arrow!", 130, 10, 300, 20);
}

//Function to read values from database
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//Function to write values in database
/* function writeStock(x) {
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  } 
  database.ref('/').update({
    Food: x
  })
} */

function addFood() {
  foodS++
  database.ref('/').update({
    Food: foodS
  })
}

function feedPet(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock() -1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(), 
    FeedTime: hour()
  })
}