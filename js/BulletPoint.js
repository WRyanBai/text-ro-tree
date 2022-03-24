//BulletPoint is a subclass of Selectable that represents bullet points in the input field.

import{Selectable} from './Selectable.js';
//import the Utils class to use its utility methods.
import{Utils} from './Utils.js';

class BulletPoint extends Selectable{
	constructor(){
		//call Selectable constructor
		super();
		
		//Create an html element to represent the bullet point in the input field.
		const bulletPtElement = document.createElement('li');
		bulletPtElement.classList.add('bulletPtElement');
		//Add an html element to display text in the bullet point.
		const bulletPtText = document.createElement('div');
		bulletPtText.classList.add('bulletPtText');
		bulletPtElement.appendChild(bulletPtText);
		//APpend the element to the input field.
		const inputField = document.querySelector('#inputField');
		inputField.appendChild(bulletPtElement);
		//Add bulletPtElement and bulletPtText to the field of GraphNode
		this.bulletPtElement = bulletPtElement;
		this.bulletPtText = bulletPtText;
		
		//set bulletPtElement and bulletPtText to be the pageElement and textElement of Selectable
		super.setPageElement(this.bulletPtElement);
		super.setTextElement(this.bulletPtText);
	}
	
	addMargin(){
		//This method increases the left margin of the bulletPoint by 20px to indent it.
		let margin = super.getMargin();
		margin += 20;
		super.setMargin(margin);
	}
	
	//accessor and mutator methods
	getBulletPtElement(){
		return(this.bulletPtElement);
	}
	
	setBulletPtElement(newElement){
		this.bulletPtElement = newElement;
		super.setPageElement(this.bulletPtElement);
	}
	
	getBulletPtText(){
		return(this.bulletPtText);
	}
	
	setBulletPtText(newElement){
		this.bulletPtText = newElement;
		super.setTextElement(this.bulletPtText);
	}
	
	highlight(){
		super.highlight();
		this.bulletPtText.contentEditable = true;
		this.bulletPtText.focus();
	}
	
	unhighlight(){
		super.unhighlight();
		this.bulletPtText.contentEditable = false;
		this.bulletPtText.blur();
	}
}

export{BulletPoint};