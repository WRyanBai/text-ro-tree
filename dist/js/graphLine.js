/*This module contains the graphLine class, which is a wrapper class for the lines connecting
nodes in the tree diagram.*/

import {bulletPtTree, canvas} from './main.js';

class GraphLine{
	constructor(parentNode, childNode){
		this.parentNode = parentNode;
		this.childNode = childNode;
		this.lineElement = document.createElement('div');
		this.lineElement.classList.add('graphLine');
		this.lineElement.style.transformOrigin = '0px 0px';
		this.lineElement.style.top = '0px';
		this.lineElement.style.left = '0px';
		canvas.appendChild(this.lineElement);
	}
	
	transformLine(){
		let startX = this.parentNode.getGraphNode().getXCoord() +
			this.parentNode.getGraphNode().getGraphWidth();
		let startY = this.parentNode.getGraphNode().getYCoord() +
			this.parentNode.getGraphNode().getGraphHeight()/2;
		let endX = this.childNode.getGraphNode().getXCoord();
		let endY = this.childNode.getGraphNode().getYCoord() +
			this.childNode.getGraphNode().getGraphHeight()/2;
		let lineLength = Math.hypot(endY - startY, endX - startX);
		let lineAngle = (180/Math.PI) * Math.atan((endY - startY)/(endX - startX));
		if(startX > endX){
			lineAngle += 180;
		}
		
		this.lineElement.style.width = lineLength.toString() + 'px';
		this.lineElement.style.transform = 'translate(' + startX.toString() +'px,' +
			startY.toString() +'px) rotate(' + lineAngle.toString() + 'deg)';
	}
	
	removeLine(){
		this.lineElement.remove();
	}
}

export {GraphLine};