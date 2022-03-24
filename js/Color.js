class Color{
	constructor(red, green, blue){
		this.red = red;
		this.green = green;
		this.blue = blue;
	}
	
	setColorType(newColorType){
		this.colorType = newColorType;
	}
	
	getColorType(){
		return(this.colorType);
	}
	
	setRed(newRed){
		this.red = newRed;
	}
	
	getRed(){
		return(this.red)
	}
	
	setGreen(newGreen){
		this.green = newGreen;
	}
	
	getGreen(){
		return(this.green)
	}
	
	setBlue(newBlue){
		this.blue = newBlue;
	}
	
	getBlue(){
		return(this.blue)
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
			this.setGreen(newGreen);
			this.setBlue(newBlue);
		}
		
		return(isValidCode);
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

export{Color};