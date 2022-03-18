/*This module contains the treeNode class. Each treeNode object corresponds to
a bullet point and a graphNode. The treeNode class allows for easy manipulation of
bullet points and corresponding graphNodes*/

//Import classes
import{SelectableNode} from './SelectableNode.js';
import {GraphNode} from './GraphNode.js';
import{GraphLine} from './GraphLine.js';
/*Import functions related to bullet points. Listeners for events on html elements
of bullet points will need to access these functions.*/
import {handleKeyPress, textChange} from './functionsBulletPt.js';
import{removePx} from './functionUtils.js';

import {fontSizeInput, nodeWidthInput} from './main.js';

class TreeNode extends SelectableNode{
	constructor(bulletPtSection){
		super()
		if (bulletPtSection != undefined){
			this.bulletPtSection = bulletPtSection;
			this.bulletPtText = this.bulletPtSection.lastElementChild;
			this.children = [];
			this.graphNode = new GraphNode(this);
			this.margin = window.getComputedStyle(bulletPtSection).marginLeft;
			this.graphLines = [];
			
			super.setNodeElement(this.bulletPtSection);
			super.setTextElement(this.bulletPtText);
			
			this.bulletPtText.addEventListener('keydown', handleKeyPress);
			this.bulletPtText.addEventListener('keyup', textChange);
		}
		else{
			this.margin = '0px';
			this.children = [];
		}
		
	}
	
	setParent(parentNode){
		this.parentNode = parentNode;
		if (parentNode.margin != undefined){
			this.margin = parentNode.getMargin();
			this.addMargin();
		}
	}
	
	getParent (){
		return(this.parentNode);
	}
	
	getBulletPtSection(){
		return(this.bulletPtSection);
	}
	
	getBulletPtText(){
		return(this.bulletPtText);
	}
	
	getChildren(){
		return(this.children);
	}
	
	appendChildNode(childNode, i){
		//this method adds a node to the children array of this node
		childNode.setParent(this);
		//If the second parameter 'i' is not inputted, the node is added to the end of the array.
		if (i === undefined){
			this.children.push(childNode);
			if(this.graphLines != undefined){
				this.graphLines.push(new GraphLine(this, childNode));
			}
		}else{
			//If the parameter 'i' is inputted, the node will be appended at the index i
			this.children.splice(i, 0, childNode)
			if(this.graphLines != undefined){
				this.graphLines.splice(i, 0, new GraphLine(this, childNode));
			}
		}
	}
	
	removeChildNode(input){
		let i = 0;
		let childrenNumber = this.children.length;
		if (typeof input === 'number'){
			i = input;
		}
		else{
			for(i; i<childrenNumber; i++){
				if (this.children[i]===input){
					break;
				}
			}
		}
		if(this.graphLines != undefined){
			this.graphLines[i].removeLine();
		}
		for(i; i<childrenNumber-1; i++){
			this.children[i] = this.children[i+1];
			if(this.graphLines != undefined){
				this.graphLines[i] = this.graphLines[i+1];
			}
		}
		this.children.pop();
		if(this.graphLines != undefined){
			this.graphLines.pop();
		}
	}
	
	getSiblingIndex(){
		//Find the index of this node in its parent's children array
		let i = 0;
		let siblingNumbers = this.parentNode.getChildren().length;
		for(i; i<siblingNumbers; i++){
			if (this.parentNode.getChildren()[i] === this){
				break;
			}
		}
		return (i);
	}
	
	getMargin(){
		return(this.margin);
	}
	
	setMargin(margin){
		this.margin = margin;
		this.bulletPtSection.style.marginLeft = margin;
	}
	
	addMargin(){
		//adds 20 pixels to the left margin of the bulletPtSection html element
		this.margin = (removePx(this.margin) + 20).toString() + 'px';
		this.bulletPtSection.style.marginLeft = this.margin;
	}
	
	getGraphNode(){
		return(this.graphNode);
	}
	
	getGraphLines(){
		return(this.graphLines);
	}
	
	setText(newText){
		super.setText(newText);
		this.graphNode.setText(newText);
	}
	
	setTextProperty(propertyName, propertyValue){
		super.setTextProperty(propertyName, propertyValue);
		this.graphNode.setTextProperty(propertyName, propertyValue);
	}
	
	setFontSize(newFontSize){
		super.setTextProperty('fontSize',newFontSize);
		this.graphNode.setFontSize(newFontSize);
	}
	
	highlight(){
		super.highlight();
		this.graphNode.highlight();
		this.bulletPtText.focus();
	}
	
	unhighlight(){
		super.unhighlight();
		this.graphNode.unhighlight();
		this.bulletPtText.blur();
	}
}

export {TreeNode}
