//This class contains utility functions to serve other classes. This avoids repetition of code.

class Utils{
	
	static removePx (targetString){
		//This function takes in a string containing a number followed by 'px' and returns the number.
		const result = parseInt(targetString.substring(0, targetString.length - 2));
		return (result);
	}
	
	static findNextIndexOf (longString, targetChar){
		//This function is given a longString to find the next index in the string that contains
		//the character targetChar.
		let i = 0;
		for (i; i < longString.length; i++){
			//iterate through indices in the string until an index is encountered where
			//the character at that index is targetChar
			if(longString.charAt(i) === targetChar){
				break;
			}
		}
		if (i === longString.length){
			//if the method iterated to the end of the string without finding targetChar, return null.
			return(null);
		}else{
			return(i);
		}
	}
	
	static parentContains (targetElement, targetIdentifier,){
		//This method is given an html element targetElement and a targetIdentifier, which coudl be
		//a class or id. This method checks if any of the parents of targetElement in the html file
		//contains the class or id specified in targetIdentifier. If so, it returns that parent.
		
		const body = document.querySelector('body');
		let containsClass = false;
		while(targetElement != body){
			//A loop iterates through the parents of targetElement.
			
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
	
	static rgbToHex(rgbString){
		//This method converts a color code in the format 'rgb(x, x, x)'
		//to a hex string in the format #XXXXXX
		let i;
		rgbString = rgbString.substring(4); //remove 'rgb(' from the string
		i = Utils.findNextIndexOf(rgbString, ',');
		let red = parseInt(rgbString.substring(0, i));//Get the integer value of red
		if (red < 16){//Convert to double digit hex
			red = '0' + red.toString(16)
		}else{
			red = red.toString(16)
		}
		rgbString = rgbString.substring(i + 1);//remove comma and space from string
		
		i = Utils.findNextIndexOf(rgbString, ',');
		let green = parseInt(rgbString.substring(0, i));//Get the integer value of green
		if (green < 16){//Convert to double digit hex
			green = '0' + green.toString(16)
		}else{
			green = green.toString(16)
		}
		rgbString = rgbString.substring(i + 1);//remove comma and space from string
		
		i = Utils.findNextIndexOf(rgbString, ')');
		let blue = parseInt(rgbString.substring(0, i));//Get the integer value of blue
		if (blue < 16){//Convert to double digit hex
			blue = '0' + blue.toString(16)
		}else{
			blue = blue.toString(16)
		}
		return('#' + red + green + blue)
	}
}

export{Utils};