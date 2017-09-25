let pileA = [];
let pileB = [];
let pileC = [];

let piles = [];
piles.push(pileA);
piles.push(pileB);
piles.push(pileC);




var loaderGraphicGame = function(){
	//components liste de composants

	this.chargePile = function(){
		console.log("chargePile");
		var socleHtml;
		for(var i=1;i<4;i++){
			socleHtml = document.createElement('div');
			socleHtml.style.width = '150px';
			socleHtml.style.height = '30px';
			socleHtml.className ='socle row'
			document.getElementById('pile-'+i).appendChild(socleHtml);
		}
	}

	this.createDisques = function(nombreDisques){
		console.log("createDisques");
		//return liste de div
		var disques = []
		let taille = 130;

		for (var i = 0; i < nombreDisques; i++) {
			divDisque = document.createElement('div');
			divDisque.style.height = '30px'
			divDisque.style.width = taille + 'px';
			
			divDisque.id = 'disque-'+(i+1);
			divDisque.className = 'row disques';
			disques.push(divDisque);
			taille -= 20;
		}
		return disques;
	}

	this.drawDisques = function(disques){
		console.log("drawDisques");
		var disques = disques;
		var socles = document.getElementsByClassName('socle');
		while(disques.length > 0){
			document.getElementById('pile-1').insertBefore(disques.pop(),
				socles[0]);

		}
		
	}

	this.chargeDisques = function (){
		console.log("chargeDisques");

		var nombreDisques = getDataFromSelect();
		var disques = this.createDisques(nombreDisques);//liste 
		fillStack(nombreDisques)
		this.drawDisques(disques);
		allowDragLastDisque();
		this.showMinimumMoves(nombreDisques);
		console.log("nombre disque : ", piles);
		
	}
	this.showMinimumMoves = function(nombreDisques){
		document.getElementById('minimum-moves').textContent = getMinimumMoveSolve(nombreDisques);
	}


}

var getDataFromSelect = function(){
	var nombreDsiquesSelected= document.getElementById('i-disques-nombre').value;
	return nombreDsiquesSelected;
	
	//loaderGraphic.chargeDisques(nombreDsiquesSelected);
	
}
var onSelectDisques = function(){
	loaderGraphic.chargeDisques();

}


//var black = document.createElement("div")
//black.style.cssText = 'background:black;width:100px;height:30px;margin:0 auto;';


document.addEventListener('drag',function(event){
	
});


//drag 
document.addEventListener('dragstart',function(event){
	console.log('dragstart');
	event.dataTransfer.setData("Text",event.target.id);
	event.target.style.opacity = "0.4";
	//creation div dans les autres disques dotted

	let divDisque = document.getElementById(event.target.id);
	let divPile = divDisque.parentElement;
	let disqueHeight = divDisque.style.height;
	let disqueWidth = divDisque.style.width;
	
	for (var i = 0; i < 3; i++) {
		var currentPile = 'pile-'+(i+1);
		if(divPile.id != currentPile){
			
			let divDotted  = document.createElement('div');
			divDotted.style.height = disqueHeight;
			divDotted.style.width = disqueWidth;
			divDotted.className = "disques disque-temporaire";
			divDotted.style.border = '1px solid #39EB24';
			
			let divTarget = document.getElementById('pile-'+(i+1));
			divTarget.insertBefore(divDotted,divTarget.children[0]);
			
		}
		
	}
	
});

document.addEventListener('dragend',function(event){
	console.log("test end");
	var disqueTemporaires = document.getElementsByClassName('disques disque-temporaire');
	while(disqueTemporaires.length > 0){
		disqueTemporaires[0].remove();
	}
	event.target.style.opacity = '100';
	allowDragLastDisque();
	
});

document.addEventListener("dragover", function(event) {
   event.preventDefault();
    
});
document.addEventListener('dragenter',function(event){

	if(event.target.className == "disques disque-temporaire"){
		event.target.style.border = "1px dotted #39EB24";
	
	}

})

document.addEventListener('dragleave',function(event){
	if(event.target.className == "disques disque-temporaire"){
		event.target.style.border = '1px solid #39EB24';	
	}
})

document.addEventListener('drop',function(event){
	event.preventDefault();
	var originDisc = document.getElementById(event.dataTransfer.getData("Text"));

	let data = event.dataTransfer.getData("Text");
	let disque = document.getElementById(data);

	let parentTarget = event.target.parentElement;
	if(event.target.className == 'disques disque-temporaire'){
		console.log(parentTarget.children);
		if(parentTarget.children.length <= 2){
			
			parentTarget.insertBefore(disque,parentTarget.children[0]);
			compteur++;
			showNumberMoves(compteur);
		}
		else{
			console.log("id ",parentTarget.children[1].id);
			console.log("id ",getNumberOfStack(event.dataTransfer.getData("Text")));
			//check 
			if(isBigger(getNumberOfStack(event.dataTransfer.getData("Text")),getNumberOfStack(parentTarget.children[1].id))){
				alert("permission");
				
				let data = event.dataTransfer.getData("Text");
				let disque = document.getElementById(data);
				console.log("parent",parentTarget);
				parentTarget.insertBefore(disque,parentTarget.children[0]);
				compteur++;
				showNumberMoves(compteur);
			}
			else{
				alert("no permission");
			}

		}
		
		//console.log(disque.parentElement.children.length);
		//console.log(document.getElementById('pile-1').children);
	}


});

var  allowDragLastDisque = function (){
	console.log('allowDragLastDisque');
	for (var i = 1; i <= 3; i++) {
		let pile = document.getElementById('pile-'+i);
		let elementsPile = pile.children;
		if(elementsPile.length > 1){
			for (var j = 0; j < elementsPile.length; j++) {
			if(j > 0){
				elementsPile[j].draggable =  false;

				console.log(elementsPile[j]);
			}
			else{
				elementsPile[j].draggable = true;
			}
		}

	}
	}
	
}


loaderGraphic = new loaderGraphicGame();

loaderGraphic.chargePile();

var getMinimumMoveSolve = function (nombreDisques){
	let result = Math.pow(2,nombreDisques)-1;
	return result
}

var showNumberMoves  = function(movesNumber){
	document.getElementById('player-moves').textContent = movesNumber;
}
var compteur = 0;


var fillStack = function(nombreDisques){
	let number = Number(nombreDisques);
	while(number > 0){
		piles[0].push(number);
		number--;
	}
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

/** 
**/
var moveDisc = function(origin,destination){
	getStackByNumber(destination).push(getStackByNumber(origin).pop());
}

var isBigger = function(originNumber, destinationNumber){
	if(originNumber > destinationNumber){
		return true;
	}
	return false;
}