/*This module contains utility functions that can be used by all other modules*/

function removePx (targetString){
	//This function takes in a string containing a number followed by 'px' and returns the number.
	const result = parseInt(targetString.substring(0, targetString.length - 2));
	return (result);
}

export{removePx};