/*This module contains functions related to altering properties of the text content
of a bullet point and the properties of the corresponding node.*/

//import the bulletPtTree
import {bulletPtTree} from './main.js';

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

export{italicizeText, boldText, underlineText, changeFontSize, changeNodeWidth};