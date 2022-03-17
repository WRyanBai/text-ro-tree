/*This module contains functions related to altering properties of the text content
of a bullet point and the properties of the corresponding node.*/

//import the bulletPtTree
import {bulletPtTree, body,
	colorAdjustPanel, textColorButton, redSlider,
	greenSlider, blueSlider, colorDisplay, colorCodeInput, colorButton} from './main.js';
import {findNextIndexOf, parentContains} from './functionUtils.js';

function italicizeText(){
	const textFontStyle = bulletPtTree.getCurrentNode().getTextProperty('fontStyle');
	if(textFontStyle === 'normal'){
		bulletPtTree.getCurrentNode().setTextProperty('fontStyle', 'italic');
	}else if(textFontStyle === 'italic'){
		bulletPtTree.getCurrentNode().setTextProperty('fontStyle', 'normal');
	}
}

function boldText(){
	const textFontWeight = bulletPtTree.getCurrentNode().getTextProperty('fontWeight');
	if(textFontWeight === '400'){
		bulletPtTree.getCurrentNode().setTextProperty('fontWeight', '700');
	}else if(textFontWeight === '700'){
		bulletPtTree.getCurrentNode().setTextProperty('fontWeight', '400');
	}
}

function underlineText(){
	let textDecoration = bulletPtTree.getCurrentNode().getTextProperty('textDecoration');
	const textLine = textDecoration.split(' ')[0];
	textDecoration = textDecoration.substring(textLine.length);
	if(textLine === 'none'){
		bulletPtTree.getCurrentNode().setTextProperty('textDecoration', 'underline ' + textDecoration);
	}else if(textLine === 'underline'){
		bulletPtTree.getCurrentNode().setTextProperty('textDecoration', 'none ' + textDecoration);
	}
}

function changeFontSize (e){
	bulletPtTree.getCurrentNode().setFontSize(e.target.value + 'px');
}

function changeNodeWidth (e){
	bulletPtTree.getCurrentNode().getGraphNode().setGraphWidth(parseInt(e.target.value));
}

function initializeColor(){
	const colorObject = new Color(redSlider.value, greenSlider.value, blueSlider.value)
	redSlider.addEventListener('input', (e) => {colorObject.setRed(e.target.value)});
	greenSlider.addEventListener('input', (e) => {colorObject.setGreen(e.target.value)});
	blueSlider.addEventListener('input', (e) => {colorObject.setBlue(e.target.value)});
	colorCodeInput.addEventListener('change', (e) => {colorObject.setColorCode(e.target.value)});
	colorButton.addEventListener('click', (e) => confirmColor(colorObject));
	return(colorObject);
}

function changeColor(colorType, colorObject){
	//The colorType variable specifies whether the color being set is the text color
	//or color of node element.
	colorAdjustPanel.style.visibility = 'visible';
	if(colorType === 'text'){
		colorObject.setColorCodeRGB(bulletPtTree.getCurrentNode().getTextProperty('color'));
	}
	colorObject.setColorType(colorType);
	body.addEventListener('click', hideColorPanel);
}

function confirmColor(colorObject){
	if(colorObject.getColorType() === 'text'){
		bulletPtTree.getCurrentNode().setTextProperty('color', colorObject.getColorCode());
	}
	colorAdjustPanel.style.visibility = 'hidden';
}

function hideColorPanel(e){
	if(parentContains(e.target, 'colorAdjustPanel') === null &&
		parentContains(e.target, 'textColorButton') === null){
		colorAdjustPanel.style.visibility = 'hidden';
		body.removeEventListener('click', hideColorPanel);
	}
}

class Color{
	constructor(red, green, blue){
		this.red = parseInt(red);
		this.green = parseInt(green);
		this.blue = parseInt(blue);
	}
	
	setColorType(newColorType){
		this.colorType = newColorType;
	}
	
	getColorType(){
		return(this.colorType);
	}
	
	setRed(newRed){
		this.red = parseInt(newRed);
		this.updateColorDisplay();
	}
	
	setGreen(newGreen){
		this.green = parseInt(newGreen);
		this.updateColorDisplay();
	}
	
	setBlue(newBlue){
		this.blue = parseInt(newBlue);
		this.updateColorDisplay();
	}
	
	updateColorDisplay(){
		colorCodeInput.value = this.getColorCode();
		colorDisplay.style.backgroundColor = this.getColorCode();
	}
	
	setColorCode(newColorCode){
		let isValidCode = true;
		let newRed;
		let newGreen;
		let newBlue;
		if(newColorCode.charAt(0) != '#' || newColorCode.length != 7){
			isValidCode = false;
		}else{
			newRed = parseInt(newColorCode.substring(1,3), 16);
			newGreen = parseInt(newColorCode.substring(3,5), 16);
			newBlue = parseInt(newColorCode.substring(5,7), 16);
			if(isNaN(newRed)||isNaN(newGreen)||isNaN(newBlue)){
				isValidCode=false;
			}
		}
		if(isValidCode){
			this.setRed(newRed);
			redSlider.value = newRed;
			this.setGreen(newGreen);
			greenSlider.value = newGreen;
			this.setBlue(newBlue);
			blueSlider.value = newBlue;
		}else{
			colorCodeInput.value = this.getColorCode();
		}
	}
	
	setColorCodeRGB(rgbString){
		let i;
		rgbString = rgbString.substring(4);
		i = findNextIndexOf(rgbString, ',');
		let newRed = parseInt(rgbString.substring(0, i));
		rgbString = rgbString.substring(i + 1);
		i = findNextIndexOf(rgbString, ',');
		let newGreen = parseInt(rgbString.substring(0, i));
		rgbString = rgbString.substring(i + 1);
		i = findNextIndexOf(rgbString, ')');
		let newBlue = parseInt(rgbString.substring(0, i));
		this.setRed(newRed);
		redSlider.value = newRed;
		this.setGreen(newGreen);
		greenSlider.value = newGreen;
		this.setBlue(newBlue);
		blueSlider.value = newBlue;
	}
	
	
	getColorCode(){
		let colorCode;
		
		let redHex = this.red.toString(16);
		if(this.red < 16){redHex = '0' + redHex};
		
		let greenHex = this.green.toString(16);
		if(this.green < 16){greenHex = '0' + greenHex};
		
		let blueHex = this.blue.toString(16);
		if(this.blue < 16){blueHex = '0' + blueHex};
		colorCode = '#' + redHex + greenHex + blueHex;
		return(colorCode);
	}
}

export{italicizeText, boldText, underlineText, changeFontSize, changeNodeWidth, initializeColor, changeColor};