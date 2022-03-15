/*This module contains the graphNode class, which represents the elements that form
the nodes of the tree diagram.*/

//import{treeNode} from './treeNode.js';

/*After properties or content of a graphNode is edited the graph needs to be formatted again.
Variables and functions related to formatting the graph is imported.*/
import{formatGraph} from './functionsGraph.js';
import {bulletPtTree, canvas, graphXMargin, graphYMargin} from './main.js';
import{removePx} from './functionUtils.js';

class graphNode{
	constructor(treeNode){
		this.graphElement = document.createElement('div');
		this.graphElement.classList.add('graphNode');
		canvas.appendChild(this.graphElement);
		this.graphText = document.createElement('div');
		this.graphText.classList.add('graphText');
		this.graphElement.appendChild(this.graphText);
		this.xCoord = 0;
		this.yCoord = 0;
		
		let graphElementStyles = window.getComputedStyle(this.graphElement);
		
		this.graphWidth = removePx(graphElementStyles.width);
		this.graphHeight = removePx(graphElementStyles.height);
		this.padding = removePx(graphElementStyles.padding);
		this.lineHeight = removePx(window.getComputedStyle(this.graphText).lineHeight);
	}
	
	getGraphElement(){
		return(this.graphElement);
	}
	
	setGraphCoord(xCoord, yCoord){
		this.xCoord = xCoord;
		this.yCoord = yCoord;
		this.graphElement.style.left = xCoord.toString() + 'px';
		this.graphElement.style.top = yCoord.toString() + 'px';
	}
	
	getXCoord(){
		return(this.xCoord);
	}
	
	getYCoord(){
		return(this.yCoord);
	}
	
	getGraphWidth(){
		return(this.graphWidth);
	}
	
	updateHeight(willFormatGraph){
		let newHeight = removePx(window.getComputedStyle(this.graphText).height);
		newHeight += 2 * this.padding;
		if (newHeight != this.graphHeight){
			if(newHeight === 2 * this.padding){
				newHeight += this.lineHeight;
			}
			this.setGraphHeight(newHeight);
			if(willFormatGraph){
				formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
			}
		}
	}
	
	setGraphWidth(graphWidth){
		this.graphWidth = graphWidth;
		this.graphElement.style.width = graphWidth.toString() + 'px';
		this.updateHeight(false);
		formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
	}
	
	getGraphHeight(){
		return(this.graphHeight);
	}
	
	setGraphHeight(graphHeight){
		this.graphHeight = graphHeight;
		this.graphElement.style.height = graphHeight.toString() + 'px';
	}
	
	getText(){
		return(this.graphText.textContent);
	}
	
	setText(newText){
		this.graphText.textContent = newText;
		this.updateHeight(true);
	}
	
	getTextProperty(propertyName){
		const style = window.getComputedStyle(this.graphText);
		return(style[propertyName]);
	}
	
	setTextProperty(propertyName, propertyValue){
		this.graphText.style[propertyName] = propertyValue;
	}
	
	setFontSize(newFontSize){
		this.setTextProperty('fontSize',newFontSize);
		this.updateHeight(true);
	}
}

export {graphNode};