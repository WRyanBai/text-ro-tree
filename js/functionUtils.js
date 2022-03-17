/*This module contains utility functions that can be used by all other modules*/
import {body} from './main.js';

function removePx (targetString){
	//This function takes in a string containing a number followed by 'px' and returns the number.
	const result = parseInt(targetString.substring(0, targetString.length - 2));
	return (result);
}

function findNextIndexOf (longString, targetChar){
	let i = 0;
	for (i; i < longString.length; i++){
		if(longString.charAt(i) === targetChar){
			break;
		}
	}
	return(i);
}

function parentContains (targetElement, targetIdentifier){
	//This function searches if any of the parents of the targetElement contains the targetIdentifier
	//in their html class or id, and if so returns the parent that does.
	let containsClass = false;
	while(targetElement != body){
		//If no parent of targetElement up till the body element contains the class,
		//the loop ends with containsClass set to false.
		if(targetElement.classList.contains(targetIdentifier) || targetElement.id === targetIdentifier){
			//If a parent of target Element contains the target class, break the loop
			//with containsClass set to true.
			containsClass = true;
			break;
		}
		//Otherwise, search the next parent.
		targetElement = targetElement.parentNode;
	}
	if (containsClass){
		return(targetElement)
	}else{
		return(null);
	}
}

export{removePx, findNextIndexOf, parentContains};