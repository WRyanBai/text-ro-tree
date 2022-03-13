import {graphNode} from './graphNode.js';
import{graphLine} from './graphLine.js';
import {selectBulletPt, handleKeyPress, textChange} from './main.js';

export class treeNode{
	constructor(bulletPtSection){
		if (bulletPtSection != undefined){
			this.bulletPtSection = bulletPtSection;
			this.bulletPtText = this.bulletPtSection.lastElementChild;
			this.children = [];
			this.graphNode = new graphNode(this);
			this.margin = window.getComputedStyle(bulletPtSection).marginLeft;
			this.graphLines = [];
			
			this.bulletPtSection.addEventListener('click', selectBulletPt);
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
	
	appendChildNode(childNode, i){
		//this method adds a node to the children array of this node
		childNode.setParent(this);
		//If the second parameter 'i' is not inputted, the node is added to the end of the array.
		if (i === undefined){
			this.children.push(childNode);
			if(this.graphLines != undefined){
				this.graphLines.push(new graphLine(this, childNode));
			}
		}else{
			//If the parameter 'i' is inputted, the node will be appended at the index i
			this.children.splice(i, 0, childNode)
			if(this.graphLines != undefined){
				this.graphLines.splice(i, 0, new graphLine(this, childNode));
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
	
	getChildren(){
		return(this.children);
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
		this.margin = (parseInt(this.margin.substring(0,this.margin.length - 2))+ 20).toString() + 'px';
		this.bulletPtSection.style.marginLeft = this.margin;
	}
	
	getGraphNode(){
		return(this.graphNode);
	}
	
	getGraphLines(){
		return(this.graphLines);
	}
	
	getText(){
		return(this.bulletPtText.textContent);
	}
	
	setText(newText){
		this.bulletPtText.textContent = newText;
		this.graphNode.setText(newText);
	}
}