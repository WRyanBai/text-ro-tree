import{treeNode} from './treeNode.js';
import {formatGraph, bulletPtTree, canvas, graphXMargin, graphYMargin} from './main.js';

export class graphNode{
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
		
		this.graphWidth = graphElementStyles.width;
		this.graphWidth = parseInt(this.graphWidth.substring(0, this.graphWidth.length - 2));
		this.graphHeight = graphElementStyles.height;
		this.graphHeight = parseInt(this.graphHeight.substring(0, this.graphHeight.length - 2));
		this.padding = graphElementStyles.padding;
		this.padding = parseInt(this.padding.substring(0, this.padding.length - 2));
		this.lineHeight = window.getComputedStyle(this.graphText).lineHeight;
		this.lineHeight = parseInt(this.lineHeight.substring(0, this.lineHeight.length - 2));
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
	
	setGraphWidth(graphWidth){
		this.graphWidth = graphWidth;
		this.graphElement.style.width = graphWidth.toString() + 'px';
		
		let newHeight = window.getComputedStyle(this.graphText).height;
		newHeight = parseInt(newHeight.substring(0, newHeight.length - 2));
		newHeight += 2 * this.padding;
		if (newHeight != this.graphHeight){
			this.setGraphHeight(newHeight);
		}
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
		let newHeight = window.getComputedStyle(this.graphText).height;
		newHeight = parseInt(newHeight.substring(0, newHeight.length - 2));
		newHeight += 2 * this.padding;
		if (newHeight != this.graphHeight){
			if(newHeight === 2 * this.padding){
				newHeight += this.lineHeight;
			}
			this.setGraphHeight(newHeight);
			formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
		}
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
		let newHeight = window.getComputedStyle(this.graphText).height;
		newHeight = parseInt(newHeight.substring(0, newHeight.length - 2));
		newHeight += 2 * this.padding;
		if (newHeight != this.graphHeight){
			this.setGraphHeight(newHeight);
			formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
		}
	}
}