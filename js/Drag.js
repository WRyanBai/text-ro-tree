import{Selectable} from './Selectable.js';

class Drag extends Selectable{
	constructor(pageElement){
		super(pageElement);
	}
	
	setXCoord(newX){
		this.xCoord = newX;
	}
	
	getXCoord(){
		return(this.xCoord)
	}
	
	setYCoord(newY){
		this.yCoord = newY;
	}
	
	getYCoord(){
		return(this.yCoord);
	}
}

export{Drag};