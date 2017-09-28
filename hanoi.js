



//------------ MAIN -------------------------------
var movesCounter = 0;
drawStack();


//--------------------------------------------------
dd = function(message){
	console.log(`[debug] - ${mesage}`);
}

drawStack = function(){
	dd("drawStack");
	var socleHtml;
	for(var i=1;i<=3;i++){
		socleHtml = document.createElement('div');
		socleHtml.className ='socle row';
		document.getElementById('pile-'+i).appendChild(socleHtml);
	}
}

getHtmlStackDics = function(nombreDisques){
	dd("getHtmlStackDics");
	var dics = []
	let taille = 130;
	for (var i = 0; i < nombreDisques; i++) {
		divDisque = document.createElement('div');
		divDisque.style.height = '30px'
		divDisque.style.width = taille + 'px';
		divDisque.id = 'disque-'+(i+1);
		divDisque.className = 'row disques';
		dics.push(divDisque);
		taille -= 20;
	}
	return disques;
}

drawDics = function(disques){
	dd("drawDics");
	let socles = document.getElementsByClassName('socle');
	while(disques.length > 0){
		document.getElementById('pile-1').insertBefore(disques.pop(),
		socles[0]);
	}
		
}

loadDiscs = function (){
	dd("loadDiscs");
	let dicsNumber = getNumberOfDicsSelected();
	let stackDics = getHtmlStackDics(dicsNumber);
	drawDics(stackDics);
		
}

showMinimalMovesToSolve = function(){
	document.getElementById('minimum-moves').textContent =getMinimalMovesToSolve(getNumberOfDicsSelected());
}

var getNumberOfDicsSelected = function(){
	let nombreDsiquesSelected = document.getElementById('i-disques-nombre').value;
	return nombreDsiquesSelected;
	
}

var onSelectDisques = function(){
	loadDiscs();
	updateDiscDragPermission();
	showMinimalMovesToSolve();
}

var upMovesCounter = function(){
	movesCounter++;
}

var setDragPermissionDisc = function(disc,permission){
	disc.draggle = permission;
}
 
var updateDiscDragPermission = function(){
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

var getNumberOfStack = function(htmlNameId){
	var hash = htmlNameId.substring(7,8);
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

var moveDisc = function(origin,destinationStack){
	destinationStack.insertBefore(disc,destinationStack.children[0]);
}

var isBigger = function(originNumber, destinationNumber){
	if(originNumber > destinationNumber){
		return true;
	}
	return false;
}

var isDiscAllowedToDropOverStack = function(disc, stackDestination){
	if(isBigger(getNumberOfStack(disc.id),getNumberOfStack(parentTarget.children[1].id))){
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

var isDiscTemporary = function(){
	if(event.target.className == "disques disque-temporaire"){
		return true;
	}
	return false;
} 



//**********___________DRAG______________******************

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
	if(isDiscTemporary){
		event.target.style.border = "1px dotted #39EB24";
	}
});

document.addEventListener('dragleave',function(event){
	if(isDiscTemporary){
		event.target.style.border = '1px solid #39EB24';	
	}
})

document.addEventListener('drop',function(event){
	event.preventDefault();
	let idOriginDisc = event.dataTransfer.getData("Text");
	let originDisc = document.getElementById(idOriginDisc);
	let stackTarget = event.target.parentElement;
	if(event.target.className == 'disques disque-temporaire'){
		if(stackTarget.children.length <= 2){
			moveDisc(originDisc, stackTarget);
			upMovesCounter();
			showNumberMoves();
		}
		else{
			//check 
			if(isDiscAllowedToDropOverStack(originDisc,stackTarget)){
				moveDisc(originDisc, stackTarget);
				upMovesCounter();
				showNumberMoves();
			}
			else{
				alert("no permission, respect rules please :) ");
			}

		}
	}
});