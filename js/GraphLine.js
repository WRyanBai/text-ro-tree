//The class GraphLine represents lines connecting an origin and end GraphNode in the tree diagram.

class GraphLine{
	constructor(origin, end){
		//origin and end are two graphNode objects.
		
		this.origin = origin;
		this.end = end;
		
		//create an html element to represent the line connecting between origin and end
		const lineElement = document.createElement('div');
		lineElement.classList.add('graphLine');
		//Ensure that the element is positioned correctly for transformations.
		lineElement.style.transformOrigin = '0px 0px';
		lineElement.style.top = '0px';
		lineElement.style.left = '0px';
		//Append the element to the canvas of the output window.
		const outputCanvas = document.querySelector('#outputCanvas');
		outputCanvas.appendChild(lineElement);
		//Add lineElement to the field of GraphLine
		this.lineElement = lineElement;
		
		//lineFormat is a string to denote how the line connects to the orgin and end nodes
		this.lineFormat = 'rightToLeft';
		
		//Call transformLine function.
		this.transformLine();
	}
	
	transformLine(){
		//This method correctly positions the line to connect from the center of origin to the center of end
		
		//Define the coordinates of the start and end.
		let startX;
		let startY;
		let endX;
		let endY;
		
		if(this.lineFormat === 'rightToLeft'){
			//In the right to left format, the line connects to origin at the center of its right edge
			//and to end at the center of its left edge.
			startX = this.origin.getXCoord() + this.origin.getWidth(); //x coordinate of right edge
			startY = this.origin.getYCoord() + this.origin.getHeight()/2;//y coordinate of vertical center
			endX = this.end.getXCoord();//x coordinate of left edge
			endY = this.end.getYCoord() + this.end.getHeight()/2;//y coordinate of vertical center
		}
		
		//Use javascript's hypotenuse center to find distance between (startX, startY) and (endX, endY)
		let lineLength = Math.hypot(endY - startY, endX - startX);
		//Calculate the angle using arctangent
		let lineAngle = (180/Math.PI) * Math.atan((endY - startY)/(endX - startX));
		if(startX > endX){
			//compensate for limited domain of arctangent
			lineAngle += 180;
		}
		
		//Transform the lineElement according to calculated values.
		this.lineElement.style.width = lineLength.toString() + 'px';
		this.lineElement.style.transform = 'translate(' + startX.toString() +'px,' +
			startY.toString() +'px) rotate(' + lineAngle.toString() + 'deg)';
	}
	
	remove(){
		//removes the element
		this.lineElement.remove();
	}
	
	//Accessor and mutator methods
	getOrigin(){
		return(this.origin);
	}
	
	setOrigin(newOrigin){
		this.Origin = newOrigin;
		//Adjust position of line after origin is changed
		this.transformLine();
	}
	
	getEnd(){
		return(this.end);
	}
	
	setEnd(newEnd){
		this.end = newEnd;
		//Adjust position of line after end is changed
		this.transformLine();
	}
	
	getLineElement(){
		return(this.lineElement);
	}
	
	setLineElement(newElement){
		this.lineElement = newElement;
	}
	
	getLineFormat(){
		return(this.lineFormat);
	}
	
	setLineFormat(newFormat){
		this.lineFormat = newFormat;
		this.transformLine();
	}
}

export {GraphLine};