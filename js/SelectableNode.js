import {nodeClicked} from './functionsBulletPt.js';

class SelectableNode{
	constructor(){
		
	}
	
	setNodeElement(nodeElement){
		this.nodeElement = nodeElement;
		this.nodeElement.addEventListener('click', nodeClicked);
	}
	
	setTextElement(textElement){
		this.textElement = textElement;
	}
	
	getText(){
		return(this.textElement.textContent);
	}
	
	setText(newText){
		this.textElement.textContent = newText;
	}
	
	getTextProperty(propertyName){
		const style = window.getComputedStyle(this.textElement);
		return(style[propertyName]);
	}
	
	setTextProperty(propertyName, propertyValue){
		this.textElement.style[propertyName] = propertyValue;
	}
	
	highlight(selectableNode){
		this.nodeElement.style.border = '3px solid red';
	}
	
	unhighlight(){
		this.nodeElement.style.border = 'none';
	}
}

export{SelectableNode};