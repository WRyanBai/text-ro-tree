//The Selectable class represents visual elements in the program that can be selected.

//import the Utils class to use its utility methods.
import{Utils} from '../helperClasses/Utils.js';

class Selectable{
	constructor(pageElement, textElement){
		//The pageElement field is a htmlElement that represents a Selectable on the webpage.
		this.pageElement = pageElement;
		//The textElement field is a htmlElement that displays any text associated with the Selectable
		this.textElement = textElement;
	}
	
	//methods to change the style and display of the Selectable

	getTextProperty(propertyName){
		//returns a specified css property of textElement
		const style = window.getComputedStyle(this.textElement);
		return(style[propertyName]);
	}
	
	setTextProperty(propertyName, propertyValue){
		//changes a specified css property of textElement
		this.textElement.style[propertyName] = propertyValue;
	}
	
	getPageProperty(propertyName){
		//returns a specified css property of pageElement
		const style = window.getComputedStyle(this.pageElement);
		return(style[propertyName]);
	}
	
	setPageProperty(propertyName, propertyValue){
		//changes a specified css property of pageElement
		this.pageElement.style[propertyName] = propertyValue;
	}
	
	highlight(){
		//This method gives pageElement a border to emphasize that the Selectable has been selected
		//This is done by replacing defaultBorder with the highlightBorder in the css class of the element
		this.pageElement.classList.remove('defaultBorder');
		this.pageElement.classList.add('highlightBorder');
		this.updateHeight();
	}
	
	unhighlight(){
		//This method reverts the border of pageElement to the default after it has been deselected
		//This is done by replacing highlightBorder with the defaultBorder in the css class of the element
		this.pageElement.classList.remove('highlightBorder');
		this.pageElement.classList.add('defaultBorder');
		this.updateHeight();
	}
	
	remove(){
		//remove the html elements associated with the Selectable object
		this.pageElement.remove();
		this.textElement.remove();
	}
	
	//Aside from get and set property, there are also methods to get and set frequently used style properties.
	getXCoord(){
		let xCoord = Utils.removePx(this.getPageProperty('left'));
		return(xCoord);
	}
	
	getYCoord(){
		let yCoord = Utils.removePx(this.getPageProperty('top'));
		return(yCoord);
	}

	setCoord(xCoord, yCoord){
		//This method sets the corrdinates of pageElement by changing the left and top properties.
		this.setPageProperty('left', xCoord.toString() + 'px');
		this.setPageProperty('top', yCoord.toString() + 'px');
	}
	
	getWidth(){
		let width = Utils.removePx(this.getPageProperty('width'))
		return(width);
	}
	
	setWidth(newWidth){
		this.setPageProperty('width', newWidth.toString() + 'px');
		this.updateHeight();
	}
	
	getHeight(){
		let height = Utils.removePx(this.getPageProperty('height'))
		return(height);
	}
	
	setHeight(newHeight){
		this.setPageProperty('height', newHeight.toString() + 'px');
	}
	
	getTextHeight(){
		let height = Utils.removePx(this.getTextProperty('height'))
		return(height);
	}
	
	setTextHeight(newHeight){
		this.setTextProperty('height', newHeight.toString() + 'px');
	}
	
	getPadding(){
		let padding = Utils.removePx(this.getPageProperty('padding'))
		return(padding);
	}
	
	setPadding(newPadding){
		this.setPageProperty('padding', newPadding.toString() + 'px');
	}
	
	getMargin(){
		let margin = Utils.removePx(this.getPageProperty('marginLeft'))
		return(margin);
	}
	
	setMargin(newMargin){
		this.setPageProperty('marginLeft', newMargin.toString() + 'px');
	}
	
	getPageColor(){
		//Returns a hexadecimal color code
		let colorCode = Utils.rgbToHex(this.getPageProperty('backgroundColor'));
		return(colorCode);
	}
	
	setPageColor(newColorCode){
		this.setPageProperty('backgroundColor', newColorCode);
	}
	
	getTextColor(){
		//Returns a hexadecimal color code
		let colorCode = Utils.rgbToHex(this.getTextProperty('color'));
		return(colorCode);
	}
	
	setTextColor(newColorCode){
		this.setTextProperty('color',newColorCode);
	}
	
	getText(){
		//returns the textContent of textElement
		return(this.textElement.textContent);
	}
	
	setText(newText){
		//changes the textContent of textElement
		this.textElement.textContent = newText;
		this.updateHeight();
	}
	
	getFontSize(){
		let fontSize = Utils.removePx(this.getTextProperty('fontSize'));
		return(fontSize);
	}
	
	setFontSize(newFontSize){
		this.setTextProperty('fontSize',newFontSize);
		this.updateHeight();
	}
	
	updateHeight(){
		//This function determines if the height of textElement has been changed.
		//If so, the height of pageElement will be adjusted as well.
		let newHeight = this.getTextHeight();
		newHeight += 2 * this.getPadding();
		//Check what the new height of the element should be.
		
		if (newHeight != this.getHeight() && Math.abs(newHeight - this.getHeight()) > 1){
			//If new height is not same as current height, set current height to newheight
			if(newHeight === 2 * this.getPadding()){
				//This adds an extra line of height to pageText in the case that its text is empty
				newHeight += Utils.removePx(this.getTextProperty('lineHeight'));
			}
			this.setHeight(newHeight);
			}
	}
	
	isBold(){
		if(parseInt(this.getTextProperty('fontWeight')) > 400){
			return(true)
		}else{
			return(false)
		}
	}
	
	bold(){
		this.setTextProperty('fontWeight', '700');
	}
	
	undoBold(){
		this.setTextProperty('fontWeight', '400');
	}
	
	isItalicized(){
		if(this.getTextProperty('fontStyle') === 'italic'){
			return(true)
		}else{
			return(false)
		}
	}
	
	italicize(){
		this.setTextProperty('fontStyle', 'italic');
	}
	
	undoItalicize(){
		this.setTextProperty('fontStyle', 'normal');
	}
	
	isUnderlined(){
		if(this.getTextProperty('textDecorationLine') === 'underline'){
			return(true)
		}else{
			return(false)
		}
	}
	
	underline(){
		this.setTextProperty('textDecorationLine', 'underline');
	}
	
	undoUnderline(){
		this.setTextProperty('textDecorationLine', 'none');
	}
	
	//accessor and mutator methods
	getPageElement(){
		return this.pageElement;
	}
	
	setPageElement(newPageElement){
		this.pageElement = newPageElement;
		this.pageElement.classList.add('defaultBorder');
	}
	
	getTextElement(){
		return this.textElement;
	}
	
	setTextElement(newTextElement){
		this.textElement = newTextElement;
	}
}

export{Selectable};