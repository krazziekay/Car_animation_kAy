var height = document.getElementById('main-wrapper').offsetHeight;
var width = document.getElementById('main-wrapper').offsetWidth;
var gameObstacles = [];
var obstaclesNo = 6;
var gameVelocity = 50;
var movementCriteria = 50;
var distanceCriteria = 25;
var score = 0;
var flag = 0;
var lowestTopObstacleIndex = 0;


window.onload = function() {
	window.addEventListener('keydown', moveSelection);
}

function obstacles() {
	this.x = 0;
	this.y = 0;
	this.crossedFlag = 0;
	this.pixelMovement = 10;
	this.element;

	this.init = function() {
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'obstacles');
		this.element.style.top = this.y + 'px';
		this.element.style.left = this.x + 'px';
		document.getElementById('main-wrapper').appendChild(this.element);
	}

	this.redrawObstacles = function() {
		this.element.style.top = this.y + 'px';
		this.element.style.left = this.x + 'px';
	}
}

function createObstacle() {
	var obs = new obstacles();
	obs.x = getRandom(0, width);
	obs.y = 0;
	obs.crossedFlag = 0;
	obs.pixelMovement = getRandom(5,10);
	obs.init();
	return obs;
}

function gameStart() {
	gameObstacles = [];
	for(var i=0; i < obstaclesNo; i++){
		var newObstacle = createObstacle();
		gameObstacles.push(newObstacle);
	}

	animationStart = setInterval(moveObstacles, gameVelocity);
}

function clearDivs(){
	delete newsObstacle;//delete the already created object
	//Clearing the divs
	while ( document.getElementById('main-wrapper').firstChild ) {
		document.getElementById('main-wrapper').removeChild(document.getElementById('main-wrapper').firstChild );
	}
}

function checkOverlapp(){
	for(var i = 0; i < obstaclesNo; i++){
		for(j = i+1; j<obstaclesNo; j++){
			if(gameObstacles[i].y==0 && gameObstacles[j].y == 0){
				obstacleDistance = getObstacleDistance(gameObstacles[i], gameObstacles[j]);
				if(obstacleDistance <= 55){
					clearInterval(animationStart);//Clear the interval first
					clearDivs();
					gameStart();//Restart the process
				}
			}
		}
	}

}

function moveObstacles() {

	checkOverlapp();

	if(score > 500){//change the game velocity
		if(gameVelocity != 20){
			gameVelocity--;
		}
		if(score > 1000){
			gameVelocity = 15;
		}
		if(score > 1500){
			gameVelocity = 10;
		}
	}

	for(var i = 0; i < obstaclesNo; i++) {
		gameObstacles[i].y += gameObstacles[i].pixelMovement;

		if(gameObstacles[i].y > height){//checking if the obstacle has crossed the container or not
			// gameObstacles[i].crossedFlag = 1;//setting flag if the obstacle has crossed the container
			document.getElementById('main-wrapper').removeChild(gameObstacles[i].element);
			gameObstacles[i].x = getRandom(0, width);
			gameObstacles[i].y = 0;
			// gameObstacles[i].pixelMovement = getRandom(5,10);
			gameObstacles[i].init();
		}

		if( getDistanceFromCar(gameObstacles[i]) <= distanceCriteria ){// game over
			clearInterval(animationStart);
			clearDivs();	
			document.getElementById('over').innerHTML = "GAME OVER!";
			window.removeEventListener('keydown', moveSelection);
		}
		gameObstacles[i].redrawObstacles();
	}
	
	document.getElementById('score').innerHTML = score;
	score++;
}

gameStart();


function restart() {
	window.addEventListener('keydown', moveSelection);
	gameVelocity = 50;
	score = 0;
	document.getElementById('over').innerHTML = "";
	clearDivs();
	if(animationStart != undefined) {
		clearInterval(animationStart);
	}
	gameStart();
}

//Key events
function moveSelection(evt) {
	e.preventDefault();
	switch (evt.keyCode) {
		case 37: {
			if(!checkOutOfBounds(parseInt(document.getElementById('car').offsetLeft) - movementCriteria + "px")){
				document.getElementById('car').style.left= parseInt(document.getElementById('car').offsetLeft) - movementCriteria + "px";
			}
			break;
		}
		case 39: {	
			if(!checkOutOfBounds(parseInt(document.getElementById('car').offsetLeft) + movementCriteria + "px")){
				document.getElementById('car').style.left = parseInt(document.getElementById('car').offsetLeft) + movementCriteria + "px";
			}
			break;

		}
	}
}

function checkOutOfBounds(value) {
	if(parseInt(value) < 0 || parseInt(value) >= width){
		console.log("out of bounds");
		return true;
	}
	return false;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Helper functions
function getRandom(max, min){
	return Math.random() * (max - min) + min;
}

function getCenterX(obstacle) {
	if(!obstacle.element){
		return obstacle.offsetLeft + obstacle.offsetWidth/2;
	}
	return obstacle.element.offsetLeft + obstacle.element.offsetWidth/2;
}

function getCenterY(obstacle) {
	if(!obstacle.element){
		return obstacle.offsetLeft + obstacle.offsetHeight/2;
	}
	return obstacle.element.offsetLeft + obstacle.element.offsetHeight/2;
}

function getObstacleDistance(obstacle1, obstacle2) {
	obstacle1CenterX = obstacle1.element.offsetLeft + obstacle1.element.offsetWidth/2;
	obstacle1CenterY = obstacle1.element.offsetTop + obstacle1.element.offsetHeight/2;	
	obstacle2CenterX = obstacle2.element.offsetLeft + obstacle2.element.offsetWidth/2;
	obstacle2CenterY = obstacle2.element.offsetTop + obstacle2.element.offsetHeight/2;
	var distance = Math.sqrt(
		Math.abs(obstacle1CenterY - obstacle2CenterY) * Math.abs(obstacle1CenterY - obstacle2CenterY) 
		+ Math.abs(obstacle1CenterX - obstacle2CenterX) * Math.abs(obstacle1CenterX - obstacle2CenterX) 
		);
	return distance;

}

function getDistanceFromCar(obstacle){
	obstacleCenterX = obstacle.element.offsetLeft + obstacle.element.offsetWidth/2;
	obstacleCenterY = obstacle.element.offsetTop + obstacle.element.offsetHeight/2;
	carCenterX = document.getElementById('car').offsetLeft + document.getElementById('car').offsetWidth/2;
	carCenterY = document.getElementById('car').offsetTop + document.getElementById('car').offsetHeight/2;
	var distance = Math.sqrt(
		Math.abs(obstacleCenterY - carCenterY) * Math.abs(obstacleCenterY - carCenterY) 
		+ Math.abs(obstacleCenterX - carCenterX) * Math.abs(obstacleCenterX - carCenterX) 
		);
	return distance;
}