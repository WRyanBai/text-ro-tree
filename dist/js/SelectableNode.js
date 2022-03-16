import {selectNode, unselectNode} from './functionsBulletPt.js';

class SelectableNode{
	constructor(){
		
	}
	
	setNodeElement(nodeElement){
		this.nodeElement = nodeElement;
		this.nodeElement.addEventListener('click', selectNode);
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
		this.nodeElement.removeEventListener('click', selectNode);
		this.nodeElement.addEventListener('click', unselectNode);
	}
	
	unhighlight(){
		this.nodeElement.style.border = 'none';
		this.nodeElement.removeEventListener('click', unselectNode);
		this.nodeElement.addEventListener('click', selectNode);
	}
}

export{SelectableNode};