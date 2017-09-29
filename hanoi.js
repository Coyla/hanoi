var dd = function(message){
	console.log("[debug] "+ message);
}

var drawStack = function(){
	dd("drawStack");
	var socleHtml;
	for(var i=1;i<=3;i++){
		socleHtml = document.createElement('div');
		socleHtml.className ='socle row';
		document.getElementById('pile-'+i).appendChild(socleHtml);
	}
}

var getHtmlStackDics = function(nombreDisques){
	dd("getHtmlStackDics");
	var discs = []
	let taille = 130;
	for (var i = 0; i < nombreDisques; i++) {
		divDisque = document.createElement('div');
		divDisque.style.height = '30px'
		divDisque.style.width = taille + 'px';
		divDisque.id = 'disque-'+(i+1);
		divDisque.className = 'row disques';
		discs.push(divDisque);
		taille -= 20;
	}
	return discs;
}

var drawDics = function(disques){
	dd("drawDics");
	let socles = document.getElementsByClassName('socle');
	while(disques.length > 0){
		document.getElementById('pile-1').insertBefore(disques.pop(),
		socles[0]);
	}
		
}

var loadDiscs = function (){
	dd("loadDiscs");
	let dicsNumber = getNumberOfDicsSelected();
	let stackDics = getHtmlStackDics(dicsNumber);
	drawDics(stackDics);
		
}

var showMinimalMovesToSolve = function(){
	document.getElementById('minimum-moves').textContent =getMinimalMovesToSolve(getNumberOfDicsSelected());
}

var getNumberOfDicsSelected = function(){
	let nombreDsiquesSelected = document.getElementById('i-disques-nombre').value;
	return Number(nombreDsiquesSelected);
	
}
var disableSelectBox = function(){
	document.getElementById('i-disques-nombre').disabled = true;
}

var onSelectDisques = function(){
	loadDiscs();
	updateDiscDragPermission();
	showMinimalMovesToSolve();
	disableSelectBox();
}

var upCounterOfMoves = function(){
	movesCounter++;
}

var setDragPermissionDisc = function(disc,permission){
	disc.draggable = permission;
}
 
var updateDiscDragPermission = function(){
	//allow only first disc over stack to be draggable
	//the rest of disc are not draggable
	dd('allowDragLastDisque');
	for (var i = 1; i <= 3; i++) {
		let pile = document.getElementById('pile-'+i);
		let elementsPile = pile.children;
		if(elementsPile.length > 1){
			//allow over stack dics draggable
			setDragPermissionDisc(elementsPile[0], true)
			for (var j = 1; j < elementsPile.length; j++) {
				//desable others stack dics draggable
				setDragPermissionDisc(elementsPile[j],false);
			}
		}
	}
}

var getMinimalMovesToSolve = function(nombreDisques){
	let result = Math.pow(2,nombreDisques)-1;
	return result
}

var showNumberMoves  = function(){
	document.getElementById('player-moves').textContent = movesCounter;
}

var getNumberOfDiscById = function(idDisc){
	var hash = idDisc.substring(7,8);
	return Number(hash);
}

var getStackByNumber = function(numberOfStack){
	let stack = []
	switch(numberOfStack){
		case 1: 
			stack = pileA;
			break;
		case 2:
			stack = pileB;
			break;
		case 3:
			stack = pileC;
			break;
	}
	return stack;
}

var moveDisc = function(originStack,destinationStack){
	console.log("moveDisc");
	originDisc = originStack.children[0];
	destinationStack.insertBefore(originDisc,destinationStack.children[0]);
}

var isBigger = function(originNumber, destinationNumber){
	if(originNumber > destinationNumber){
		return true;
	}
	return false;
}

var isDiscAllowedToDropOverStack = function(disc, stackDestination){
	if(isBigger(getNumberOfDiscById(disc.id),getNumberOfDiscById(stackDestination.children[1].id))){
			return true;
	}
	return false;
}

var drawTemporaryDiscOverStacks = function(originDisc){
	for (var i = 1; i < 4; i++) {
		var idStack = 'pile-'+i;
		let originStack = originDisc.parentElement;
		if(originStack.id != idStack){
			let temporaryDisc  = document.createElement('div');
			temporaryDisc.style.height = originDisc.style.height;
			temporaryDisc.style.width = originDisc.style.width;;
			temporaryDisc.className = "disques disque-temporaire";
			temporaryDisc.style.border = '1px solid #39EB24';
			let stackTarget = document.getElementById(idStack);
			stackTarget.insertBefore(temporaryDisc,stackTarget.children[0]);
		}
	}
}
var removeAllTemporaryDiscs = function(){
	var disqueTemporaires = document.getElementsByClassName('disques disque-temporaire');
		while(disqueTemporaires.length > 0){
			disqueTemporaires[0].remove();
	}
}

var setOpacityOfElement = function(element,opacity){
	element.style.opacity = opacity;
}

var isDiscTemporary = function(disc){
	if(disc.className == "disques disque-temporaire"){
		return true;
	}
	return false;
} 
var isStackTargetEmpty = function(stack){
	//base and temprary disc count as 2 elements
	if(stack.length <= 2){
		return true;
	}
	return false;
}

var isStackDestinationFull = function(){
	if((document.getElementById('pile-3').children.length - 2)  === getNumberOfDicsSelected()){
		return true;
	}
	return false;
}

var isPlayerWinner = function(){
	if(isStackDestinationFull()){
		return true;
	}
	return false;
}

var loadGraphicComponents = function(){
	drawStack();
}

var onAutomaticSolution = function(){
	let origin = document.getElementById('pile-1');
	let destination = document.getElementById('pile-3');
	let tempo = document.getElementById('pile-2');
	autoMove(getNumberOfDicsSelected(), origin, destination, tempo)
}


//_______________auto solution_____________________

var autoMove = function(nDiscToMov, origin, destination, tempo){
	if(nDiscToMov == 1){
		moveDisc(origin,destination);
		alert('next step');
		wait(2000);
	}
	else{
		autoMove(nDiscToMov-1, origin, tempo , destination);
		moveDisc(origin,destination);
		alert('next step');
		wait(2000);
		autoMove(nDiscToMov-1, tempo, destination, origin);
	}
}

function wait(ms){
	var d = new Date();
	var d2 = null;
	do { d2 = new Date(); }
	while(d2-d < ms);
}

//________________DRAG DROP EVENTS______________________

document.addEventListener('drag',function(event){
	setOpacityOfElement(event.target, "0.4");
});

document.addEventListener('dragstart',function(event){
	dd('dragstart');
	event.dataTransfer.setData("Text",event.target.id);
	let originDisc = document.getElementById(event.target.id);
	drawTemporaryDiscOverStacks(originDisc)
	
});

document.addEventListener('dragend',function(event){
	dd("test end");
	removeAllTemporaryDiscs()
	setOpacityOfElement(event.target, "100");
	updateDiscDragPermission();
	
});

document.addEventListener("dragover", function(event) {
   event.preventDefault();
    
});

document.addEventListener('dragenter',function(event){
	if(isDiscTemporary(event.target)){
		event.target.style.border = "2px dotted blue";
	}
});

document.addEventListener('dragleave',function(event){
	if(isDiscTemporary(event.target)){
		event.target.style.border = '1px solid #39EB24';	
	}
})

document.addEventListener('drop',function(event){
	event.preventDefault();
	let idOriginDisc = event.dataTransfer.getData("Text");
	let originDisc = document.getElementById(idOriginDisc);
	let stackTarget = event.target.parentElement;
	if(isDiscTemporary(event.target)){
		if(isStackTargetEmpty(stackTarget) || isDiscAllowedToDropOverStack(originDisc,stackTarget)){
			moveDisc(originDisc.parentElement, stackTarget);
			upCounterOfMoves();
			showNumberMoves();
			if(isPlayerWinner()){
				alert("Vous avez terminé. Bravo !!");
			}
		}
		else{
			alert("no permission, respect rules please :) ");
		}
	}
});

let movesCounter = 0;
loadGraphicComponents();
