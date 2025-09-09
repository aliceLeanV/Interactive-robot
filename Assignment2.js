// Author: Alice Lean
// Date: January 2025
// Description: Script for the Assignment 2 page

"use strict";

////////////functions////////////

//clear whole canvas
function clear(){
  context.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawFullRobot(){
	clear();
	
	//calls the function to draw rectangles
	drawRect("rgb(0,0,225)",220,40,150,100); 
	drawRect("rgb(0,0,225)",195,145,200,150);

	//Image reference: PNG MART (no date) Robot Arm, Motion, Control, Automation, Engineering PNG [https://www.pngmart.com/image/518307] (Accessed: 3 January 2025)
	context.drawImage(loadedImgs.armR,400,150,100,200);
	//Image reference: PNG MART (no date) Robot Arm, Motion, Control, Automation, Engineering PNG [https://www.pngmart.com/image/518307] (Accessed: 3 January 2025)
	context.drawImage(loadedImgs.armL,90,150,100,200);
	//Image reference: Futuer (no date) Prosthesis icon|Freepik [https://www.freepik.com/icon/prosthesis_6856330] (Accessed: 3 January 2025)
	context.drawImage(loadedImgs.legL,265,295,200,200);
	//Image reference: Futuer (no date) Prosthesis icon|Freepik [https://www.freepik.com/icon/prosthesis_6856330] (Accessed: 3 January 2025)
	context.drawImage(loadedImgs.legR,120,295,200,200);

	if (onBool == 0){
		//default colour of the eyes
		context.fillStyle = "rgb(128,128,128)"; //grey (off)
		context.beginPath();
		context.arc(330,80,25,0, 2*Math.PI);
		context.arc(260,80,25,0, 2*Math.PI);
		context.fill();
	}
	else
		//switch on colour of the eyes
		context.fillStyle = "rgb(255,255,0)"; //yellow (on)
		context.beginPath();
		context.arc(330,80,25,0, 2*Math.PI);
		context.arc(260,80,25,0, 2*Math.PI);
		context.fill();
		
	if (chargeBool == 1){
		drawCharge();
	}
}

//to draw rectangles/squares
function drawRect(rectCol, x, y, width, height){ 
	context.beginPath();
	context.fillStyle = rectCol;
	context.rect(x, y, width, height);
	context.fill();
}

//to draw the eyes (when on, yellow)
function drawArcOn(arcCol){ 
	if (tasksDone < 3){
		context.fillStyle = arcCol;
		context.beginPath();
		context.arc(330,80,25,0, 2*Math.PI);
		context.arc(260,80,25,0, 2*Math.PI);
		context.fill();
		
		onBool = 1;
		
		//reassign the button so change when clicked again
		power.removeEventListener("click", drawArcOn);
		power.addEventListener("click", function() { drawArcOff("rgb(128,128,128)") });
		return onBool;
	}
	else{
		power.removeEventListener("click", drawArcOn);
		power.addEventListener("click", function() { drawArcOff("rgb(128,128,128)") });
	}	
}

//to draw the eyes (when off, grey)
function drawArcOff(arcCol){ 
	context.fillStyle = arcCol;
	context.beginPath();
	context.arc(330,80,25,0, 2*Math.PI);
	context.arc(260,80,25,0, 2*Math.PI);
	context.fill();
	
	onBool = 0;
	
	//reassign the button so change when clicked again
	power.removeEventListener("click", drawArcOff);
	power.addEventListener("click", function() { drawArcOn("rgb(255,255,0)") });
	return onBool;
}

function imageArray(){
	//save the images as a word
	const imgs = {armR: "pics/armR.png", armL: "pics/armL.png", legR: "pics/legR.png", legL: "pics/legL.png"};
	
	//runs the method for every image in the array
	for (let value in imgs){ 
		loadedImgs[value] = new Image();
		loadedImgs[value].src = imgs[value];
	}
	//setTimeout function to give time for images to load
	setTimeout(function(){
		console.log("images loading...");
		//draw full robot
		drawFullRobot();
	}, 1500); //wait 1.5 seconds before load robot
	
	console.log("images loaded");
}	

//image to indicate charging
function drawCharge(){
	let img = new Image();
	img.onload = function(){
		context.drawImage(img,550,495,50,50);
	}
	//Image reference: FLATICON (no date) Plugging free icon [https://www.flaticon.com/free-icon/plugging_349186] (Accessed: 3 January 2025)
	img.src = "pics/chargeCable.png";
}

//image to hide the charging image (show not charging)
function drawBlank(){
	let img = new Image();
	img.onload = function(){
		context.drawImage(img,550,495,50,50);
	}
	img.src = "pics/blank.jpg";
}

function stringing(outputTask){
	let taskStr = document.getElementById("Task");
	//creates a new element (<p>)
	let newElement = document.createElement("p");
	//textNode contains the string to be outputted
	let textNode = document.createTextNode(outputTask);
	newElement.appendChild(textNode);
	
	//checks if the <div> element (in Task) has child elements already
	if (taskStr.firstChild){
		//if child exists already, replaces
		taskStr.replaceChild(newElement, taskStr.firstChild);
	}
	else {
		taskStr.appendChild(newElement);
	}
}

function actionsLeft(){
	let outputTask = "Tasks remaining: " + (3 - tasksDone);
	if (tasksDone == 3){
		outputTask = "Tasks remaining: " + (3 - tasksDone) + ". (Need charging)";
	}
	console.log (outputTask);
	stringing(outputTask);
}

function charging(){ 
	drawCharge();
	
	let date = new Date();
	startTime = date.getTime(); //time when button was pressed
	
	chargeBool = 1;
	
	//to charge
	if (tasksDone > 0){
		let outputTask = "Charging...";
		console.log (outputTask);
		stringing(outputTask);
		let now = date.getTime()
		
		//setTimeout function to have better control of time
		setTimeout(function(){
			tasksDone = 0;
			let outputTask = "Tasks remaining: " + (3 - tasksDone) + ". Please press charge button again.";
			console.log (outputTask);
			stringing(outputTask);
		}, 4000); //do in 4 seconds
	}
	
	charge.removeEventListener("click", charging);
	charge.addEventListener("click", function() { notCharging() });
	return chargeBool;
}

function notCharging(){
	drawBlank();
	
	chargeBool = 0;
	
	charge.removeEventListener("click", notCharging);
	charge.addEventListener("click", function() { charging() });
	return chargeBool;
}

function findCoord(e){
	//return size and position of canvas
	let boundingRect = canvas.getBoundingClientRect();
	
	//use the predefined method to find top left coords of canvas
	let offsetX = boundingRect.left;
	let offsetY = boundingRect.top;
	
	//scale factor after window resize
    let scaleX = WIDTH / boundingRect.width;
    let scaleY = HEIGHT / boundingRect.height;
	
    //calculates the coords clicked, relative to the top left of the canvas
    coordX = Math.round(e.clientX - offsetX) * scaleX;
    coordY = Math.round(e.clientY - offsetY) * scaleY;
	  
	console.log("coord of mouse click: " + coordX + ", " + coordY);
	
	if ((400 < coordX && coordX < 500) && (150 < coordY && coordY < 320)){ 
		console.log("rotate right arm");
		rotateRight();
	}
	else if ((90 < coordX && coordX < 190) && (150 < coordY && coordY < 320)){ 
		console.log("rotate left arm");
		rotateLeft();
	}
	else if (coordX > 500){
		console.log("robot move right");
		moveRight();
	}
	else if (coordX < 100){
		console.log("robot move left");
		moveLeft();
	}
	else{
		laser();
	}	
}

//to fire laser at clicked position
function laser(){
	//only shoots if robot is on and enough charge
	if (onBool == 1){
		drawFullRobot();
		context.strokeStyle = "rgb(255,0,0)";
		context.lineWidth = "10";
		context.beginPath();
		context.moveTo(259,81);
		context.lineTo(coordX, coordY);
		context.moveTo(330,81);
		context.lineTo(coordX, coordY);
		context.stroke();
		
		tasksDone += 1;
		console.log(tasksDone);
		
		actionsLeft();
		
		//if out of charge, turn off
		if (tasksDone == 3){
			drawArcOff("rgb(128,128,128)");
		}
	}
}

////////////shift the bot////////////

function stopMove(){
	if (requestId){
		cancelAnimationFrame(requestId);
	}
	console.log("stopped shift");

	tasksDone += 1;
	console.log(tasksDone);
	shift = 0;
	
	actionsLeft();
		
	//if out of charge, turn off
	if (tasksDone == 3){
		drawArcOff("rgb(128,128,128)");
	}
}

function nextFrameS(startTime, timePeriod){
	let date = new Date();
	let now = date.getTime();
	let elapsedTime = now - startTime; 
	
	requestId = requestAnimationFrame(function(){
		nextFrameS(startTime, timePeriod); 
	});
	drawShift();
	if (elapsedTime > timePeriod){
		stopMove();
	}
}

function animationShift(){
	let timePeriod = 3000; //3 seconds
	let date = new Date();
	let startTime = date.getTime(); //time of click
	drawShift();
	nextFrameS(startTime, timePeriod);  
}

function drawShift(){
	if (rightOrLeft == 1){ //shift to the right
		shift += 1;
		if (shift > 50){
			stopMove();
		}
	}
	if (rightOrLeft == 0){ //shift to the left
		shift -= 1;
		if ((shift * -1) > 50){
			stopMove();
		}
	}
	
	clear();
	
	//Image reference: PNG MART (no date) Robot Arm, Motion, Control, Automation, Engineering PNG [https://www.pngmart.com/image/518307] (Accessed: 3 January 2025)
	context.drawImage(loadedImgs.armR,(400 + shift),150,100,200);
	//Image reference: PNG MART (no date) Robot Arm, Motion, Control, Automation, Engineering PNG [https://www.pngmart.com/image/518307] (Accessed: 3 January 2025)
	context.drawImage(loadedImgs.armL,(90 + shift),150,100,200);
	//Image reference: Futuer (no date) Prosthesis icon|Freepik [https://www.freepik.com/icon/prosthesis_6856330] (Accessed: 3 January 2025)
	context.drawImage(loadedImgs.legL,(265 + shift),295,200,200);
	//Image reference: Futuer (no date) Prosthesis icon|Freepik [https://www.freepik.com/icon/prosthesis_6856330] (Accessed: 3 January 2025)
	context.drawImage(loadedImgs.legR,(120 + shift),295,200,200);
	
	drawRect("rgb(0,0,225)",(220 + shift),40,150,100); 
	drawRect("rgb(0,0,225)",(195 + shift),145,200,150);

	if (onBool == 1){
		context.fillStyle = "rgb(255,255,0)";
	}
	else{
		context.fillStyle = "rgb(128,128,128)";
	}
	context.beginPath();
	context.arc((330 + shift),80,25,0, 2*Math.PI);
	context.arc((260 + shift),80,25,0, 2*Math.PI);
	context.fill();
}

function moveRight(){
	if (onBool == 1){
		drawFullRobot();
		rightOrLeft = 1;
		animationShift();
	}
}

function moveLeft(){
	if (onBool == 1){
		drawFullRobot();
		rightOrLeft = 0;
		animationShift();
	}
}

////////////rotate arm////////////

function stopRotate(){
	if (requestId){
		cancelAnimationFrame(requestId);
	}
	console.log("stopped rotate");

	tasksDone += 1;
	console.log(tasksDone);
	angle = 0;
	
	actionsLeft();
		
	//if out of charge, turn off
	if (tasksDone == 3){
		drawArcOff("rgb(128,128,128)");
	}
}

function animationRotate(){
	let timePeriod = 2000; //2 seconds
	let date = new Date();
	let startTime = date.getTime(); //time of click
	drawRotate();
	nextFrameR(startTime, timePeriod);  
}

function drawRotate(){
	clear();
	
	//draw all parts but rotating ones
	drawRect("rgb(0,0,225)",220,40,150,100); 
	drawRect("rgb(0,0,225)",195,145,200,150);
	
	//Image reference: Futuer (no date) Prosthesis icon|Freepik [https://www.freepik.com/icon/prosthesis_6856330] (Accessed: 3 January 2025)
	context.drawImage(loadedImgs.legL,265,295,200,200);
	//Image reference: Futuer (no date) Prosthesis icon|Freepik [https://www.freepik.com/icon/prosthesis_6856330] (Accessed: 3 January 2025)
	context.drawImage(loadedImgs.legR,120,295,200,200);
	
	if (onBool == 1){
		context.fillStyle = "rgb(255,255,0)";
	}
	else{
		context.fillStyle = "rgb(128,128,128)";
	}
	context.beginPath();
	context.arc(330,80,25,0, 2*Math.PI);
	context.arc(260,80,25,0, 2*Math.PI);
	context.fill();
	
	if (rightOrLeft == 1){ //rotate right arm
		//Image reference: PNG MART (no date) Robot Arm, Motion, Control, Automation, Engineering PNG [https://www.pngmart.com/image/518307] (Accessed: 3 January 2025)
		context.drawImage(loadedImgs.armL,90,150,100,200);

		context.save(); //saves the current statements
		context.translate(402,159) //point of rotation 
		context.rotate(angle); //rotate the image
		context.drawImage(loadedImgs.armR,0,0,100,200); //top-left
		context.restore(); //restore the original state
	}
	else{ //rotate left arm
		//Image reference: PNG MART (no date) Robot Arm, Motion, Control, Automation, Engineering PNG [https://www.pngmart.com/image/518307] (Accessed: 3 January 2025)
		context.drawImage(loadedImgs.armR,400,150,100,200);

		context.save(); //saves the current statements
		context.translate(187,159) //point of rotation
		context.rotate(angle * -1); //rotate the image (otherway)
		context.drawImage(loadedImgs.armL,-100,0,100,200); //top-right
		context.restore(); //restore the original state
	}
	
	angle += (10 * Math.PI) / 180; //(add 10 degrees onto every rotation) radians
}

function nextFrameR(startTime, timePeriod){
	let date = new Date();
	let now = date.getTime();
	let elapsedTime = now - startTime; 
	
	requestId = requestAnimationFrame(function(){
		nextFrameR(startTime, timePeriod); 
	});
	drawRotate();
	if (elapsedTime > timePeriod){
		stopRotate();
	}
}

function rotateRight(){
	if (onBool == 1){
		drawFullRobot();
		rightOrLeft = 1;
		animationRotate();
	}
}
	
function rotateLeft(){
if (onBool == 1){
		drawFullRobot();
		rightOrLeft = 0;
		animationRotate();
	}
}


////////////main////////////

//global variables
let canvas = document.getElementById("robot");
let context = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const loadedImgs = {};

let onBool = 0;
let chargeBool = 0;
let tasksDone = 0;
let startTime;
let requestId;

let coordX = 0;
let coordY = 0;
let shift = 0; //max 50
let rightOrLeft = 2;

let angle = 0;

//loads all images already
imageArray();

actionsLeft();

let power = document.getElementById("Power");
let charge = document.getElementById("Charge");

power.addEventListener("click", function() { drawArcOn("rgb(255,225,0)") });
charge.addEventListener("click", function() { charging() });

canvas.addEventListener('click', function(e) { findCoord(e); });
