//StyleOptions is responsible for handling user inputs that edits the style of a node.

import{Main} from '../helperClasses/Main.js';
import{Color} from '../helperClasses/Color.js';
import{Drag} from '../helperClasses/Drag.js';

class StyleOptions{
	constructor(){
		//Listen for the event that the selectedNode has changed, and update options interface elements
		//to display data of the selected node.
		window.addEventListener('selectedChanged', (e) => StyleOptions.updateOptions());
		
		//Create private static vairables for elements in the style interface.
		StyleOptions.fontSizeInput = document.querySelector('#fontSizeInput');
		StyleOptions.nodeWidthInput = document.querySelector('#nodeWidthInput');
		
		StyleOptions.italicButton = document.querySelector('#italicButton');
		StyleOptions.boldButton = document.querySelector('#boldButton');
		StyleOptions.underlineButton = document.querySelector('#underlineButton');
		
		StyleOptions.textColorButton = document.querySelector('#textColorButton');
		StyleOptions.textColorDisplay = document.querySelector('#textColorDisplay');
		StyleOptions.nodeColorButton = document.querySelector('#nodeColorButton');
		StyleOptions.nodeColorDisplay = document.querySelector('#nodeColorDisplay');
		
		StyleOptions.colorPanel = document.querySelector('#colorPanel');
		StyleOptions.colorCodeInput = document.querySelector('#colorCodeInput');
		StyleOptions.redSlider = document.querySelector('#redSlider');
		StyleOptions.greenSlider = document.querySelector('#greenSlider');
		StyleOptions.blueSlider = document.querySelector('#blueSlider');
		
		//A static color object for changing color properties
		StyleOptions.color = new Color();
		
		//add event listeners to interface elements
		fontSizeInput.addEventListener('change', StyleOptions.setFontSize);
		nodeWidthInput.addEventListener('change', StyleOptions.setNodeWidth);
		
		italicButton.addEventListener('click', StyleOptions.italicize);
		boldButton.addEventListener('click', StyleOptions.bold);
		underlineButton.addEventListener('click', StyleOptions.underline);
		
		textColorButton.addEventListener('click', (e) => StyleOptions.toggleTextColorPanel('textColor'));
		nodeColorButton.addEventListener('click', (e) => StyleOptions.toggleTextColorPanel('nodeColor'));
		
		redSlider.addEventListener('input', StyleOptions.setRed)
		greenSlider.addEventListener('input', StyleOptions.setGreen)
		blueSlider.addEventListener('input', StyleOptions.setBlue)
		colorCodeInput.addEventListener('change', StyleOptions.setColorCode);
		
		window.addEventListener('deselection', StyleOptions.deactivateDrag);
		
		StyleOptions.dragButton = new Drag(document.querySelector('#dragButton'));
		document.querySelector('#dragButton').addEventListener('click', StyleOptions.activateDrag);
		StyleOptions.autoformatButton = new Drag(document.querySelector('#autoformatButton'));
		document.querySelector('#autoformatButton').addEventListener('click', StyleOptions.revertAutoformat);
	}
	
	static updateOptions(){
		//update the interface elements to display style properties of currently selected node.
		const currentNode = Main.getTree().getCurrentNode();
		StyleOptions.updateDragButtons();
		if(currentNode === null){
			//In the case that the selectedNode is null, certain inputs should be disabled
			// and have their values set to null.
			fontSizeInput.value = '';
			fontSizeInput.disabled = true;
			nodeWidthInput.value = '';
			nodeWidthInput.disabled = true;
			//color displays should have their color set to white
			textColorDisplay.style.backgroundColor = '#FFFFFF';
			nodeColorDisplay.style.backgroundColor = '#FFFFFF';
			//The colorPanel will have its display set to hidden and color is set to null.
			colorPanel.style.visibility = 'hidden';
			StyleOptions.color = null;
		}else{
			//In the case that there is a selectedNode, adjust values of interface elements
			fontSizeInput.value = currentNode.getFontSize();
			fontSizeInput.disabled = false;
			nodeWidthInput.value = currentNode.getWidth();
			nodeWidthInput.disabled = false;
			//color displays should have their color set to white
			textColorDisplay.style.backgroundColor = currentNode.getTextColor();
			nodeColorDisplay.style.backgroundColor = currentNode.getNodeColor();
		}
	}
	
	static setFontSize(e){
		//Set font size of currentNode to newly inputed value.
		const currentNode = Main.getTree().getCurrentNode();
		const newFontSize = parseInt(e.target.value);
		//if a currentNode is selected and newFontSize is within allowed range, set font size
		//of current node to newFontSize.
		if(currentNode != null && newFontSize >= 5 && newFontSize <= 50){
			currentNode.setFontSize(newFontSize);
		}
	}
	
	static setNodeWidth(e){
		//Set node width of currentNode to newly inputed value.
		const currentNode = Main.getTree().getCurrentNode();
		const newWidth = parseInt(e.target.value);
		//if a currentNode is selected and newWidth is within allowed range, set font size
		//of current node to newFontSize.
		if(currentNode != null && newWidth >= 50 && newWidth <= 1000){
			currentNode.setWidth(newWidth);
		}
	}
	
	static italicize(){
		//This method italicizes currentNode.
		const currentNode = Main.getTree().getCurrentNode();
		if(currentNode != null){
			//if a currentNode is selected, check if it is italicized. Undo italicize if it is
			if(currentNode.isItalicized()){
				currentNode.undoItalicize();
			}else{
				//and vice versa
				currentNode.italicize();
			}
		}
	}
	
	static bold(){
		//This method bolds currentNode.
		const currentNode = Main.getTree().getCurrentNode();
		if(currentNode != null){
			//if a currentNode is selected, check if it is bold. Undo bold if it is
			if(currentNode.isBold()){
				currentNode.undoBold();
			}else{
				//and vice versa
				currentNode.bold();
			}
		}
	}
	
	static underline(){
		//This method underlines currentNode.
		const currentNode = Main.getTree().getCurrentNode();
		if(currentNode != null){
			//if a currentNode is selected, check if it is underlined. Undo underline if it is
			if(currentNode.isUnderlined()){
				currentNode.undoUnderline();
			}else{
				//and vice versa
				currentNode.underline();
			}
		}
	}
	
	static toggleTextColorPanel(colorType){
		//This method toggles the visibility of a panel for user to select text color.
		
		//The colorType indicates if its the node color or text color being changed.
		const currentNode = Main.getTree().getCurrentNode();
		let visibility = window.getComputedStyle(colorPanel).visibility;
		if(currentNode != null && visibility === 'hidden'){
			//If the colorpanel is currently hidden, make it visible
			colorPanel.style.visibility = 'visible';
			
			//The textColor and nodeColor css classes positions the colorPanel
			//next to the textColorButton and nodeColorButton, respectively.
			
			//If colorType is textColor, remove nodeCOlor from classlist of colorPanel, adn vice versa.
			if(colorType === 'textColor'){
				colorPanel.classList.remove('nodeColor');
			}else{
				colorPanel.classList.remove('textColor');
			}
			//Add the correct css class
			colorPanel.classList.add(colorType);
			//Create a new color object and set its color to the currentNode's text color
			StyleOptions.color = new Color();
			if(colorType === 'textColor'){
				StyleOptions.color.setColorCode(currentNode.getTextColor());
			}else{
				StyleOptions.color.setColorCode(currentNode.getNodeColor());
			}
			//Set the type of color to textColor.
			StyleOptions.color.setColorType(colorType);
			//Adjust value of sliders.
			redSlider.value = StyleOptions.color.getRed();
			greenSlider.value = StyleOptions.color.getGreen();
			blueSlider.value = StyleOptions.color.getBlue();
			colorCodeInput.value = StyleOptions.color.getColorCode();
			
		}else if(currentNode != null && visibility === 'visible'){
			//If the panel is visible, make it hidden.
			colorPanel.style.visibility = 'hidden';
			StyleOptions.color = null;
		}
	}
	
	static setRed(e){
		//This method sets a color according to the input of redSlider
		const currentNode = Main.getTree().getCurrentNode();
		//Change the red value of the color object
		StyleOptions.color.setRed(parseInt(e.target.value));
		let newColor = StyleOptions.color.getColorCode()
		//Set the value of colorCodeInput to the new value.
		colorCodeInput.value = newColor;
		if(StyleOptions.color.getColorType() === 'textColor'){
			//If the type of color being changed is textColor, update
			//the text color and textColorDisplay.
			textColorDisplay.style.background = newColor;
			currentNode.setTextColor(newColor);
		}else if(StyleOptions.color.getColorType() === 'nodeColor'){
			//If the type of color being changed is nodeColor, update
			//the node color and nodeColorDisplay.
			nodeColorDisplay.style.background = newColor;
			currentNode.setNodeColor(newColor);
		}
	}
	
	static setGreen(e){
		//This method sets a color according to the input of greenSlider
		const currentNode = Main.getTree().getCurrentNode();
		//Change the green value of the color object
		StyleOptions.color.setGreen(parseInt(e.target.value));
		let newColor = StyleOptions.color.getColorCode()
		//Set the value of colorCodeInput to the new value.
		colorCodeInput.value = newColor;
		if(StyleOptions.color.getColorType() === 'textColor'){
			//If the type of color being changed is textColor, update
			//the text color and textColorDisplay.
			textColorDisplay.style.background = newColor;
			currentNode.setTextColor(newColor);
		}else if(StyleOptions.color.getColorType() === 'nodeColor'){
			//If the type of color being changed is nodeColor, update
			//the node color and nodeColorDisplay.
			nodeColorDisplay.style.background = newColor;
			currentNode.setNodeColor(newColor);
		}
	}
	
	static setBlue(e){
		//This method sets a color according to the input of blueSlider
		const currentNode = Main.getTree().getCurrentNode();
		//Change the blue value of the color object
		StyleOptions.color.setBlue(parseInt(e.target.value));
		let newColor = StyleOptions.color.getColorCode()
		//Set the value of colorCodeInput to the new value.
		colorCodeInput.value = newColor;
		if(StyleOptions.color.getColorType() === 'textColor'){
			//If the type of color being changed is textColor, update
			//the text color and textColorDisplay.
			textColorDisplay.style.background = newColor;
			currentNode.setTextColor(newColor);
		}else if(StyleOptions.color.getColorType() === 'nodeColor'){
			//If the type of color being changed is nodeColor, update
			//the node color and nodeColorDisplay.
			nodeColorDisplay.style.background = newColor;
			currentNode.setNodeColor(newColor);
		}
	}
	
	static setColorCode(e){
		const currentNode = Main.getTree().getCurrentNode();
		const isValidCode = StyleOptions.color.setColorCode(e.target.value);
		if(isValidCode){
			let newColor = StyleOptions.color.getColorCode()
			if(StyleOptions.color.getColorType() === 'textColor'){
				textColorDisplay.style.background = newColor;
				currentNode.setTextColor(newColor);
			}else if(StyleOptions.color.getColorType() === 'nodeColor'){
				nodeColorDisplay.style.background = newColor;
				currentNode.setNodeColor(newColor);
			}
			//Adjust value of sliders.
			redSlider.value = StyleOptions.color.getRed();
			greenSlider.value = StyleOptions.color.getGreen();
			blueSlider.value = StyleOptions.color.getBlue();
		}else{
			colorCodeInput.value = StyleOptions.color.getColorCode();
		}
	}
	
	static updateDragButtons(){
		//This method updates the position of the dragButton and autoformatButton so that they appear next to the selected node.
		const currentNode = Main.getTree().getCurrentNode();
		if (currentNode != null){
			//If a currentNode is selected, make dragButton and autoformatButton visible and move them next to the node.
			StyleOptions.dragButton.setPageProperty('visibility', 'visible');
			const dragX = currentNode.getXCoord() + currentNode.getWidth() + 3;
			const dragY = currentNode.getYCoord();
			StyleOptions.dragButton.setCoord(dragX, dragY);
			StyleOptions.autoformatButton.setCoord(dragX, dragY + 33);
			if(currentNode.getAutoformat() === false){
				//Only show the autoformatButton if the autoformat boolean of the node is false
				StyleOptions.autoformatButton.setPageProperty('visibility', 'visible');
			}
		}else{
			//If no currentNode is selected, make the buttons hidden
			StyleOptions.dragButton.setPageProperty('visibility', 'hidden');
			StyleOptions.autoformatButton.setPageProperty('visibility', 'hidden');
		}
	}
	
	static activateDrag(){
		//This method activates drag-move on the currentNode whent eh dragButton is clicked
		const currentNode = Main.getTree().getCurrentNode();
		if(StyleOptions.dragButton.getPageElement().classList.contains('selected')){
			//If the dragButton is clicked but it is already selected, deactivateDrag instead.
			StyleOptions.deactivateDrag();
		}else{
			if(currentNode.getAutoformat() === true){
				//If autoformat is true for currentNode, set it to false and make the autoformatButton visible.
				currentNode.setAutoformat(false);
				StyleOptions.autoformatButton.setPageProperty('visibility', 'visible');
			}				
			//Add selected style class to dragButton
			StyleOptions.dragButton.getPageElement().classList.add('selected');
			//Activate dragging for currentNode.
			currentNode.getGraphNode().setPageProperty('cursor', 'move');
			currentNode.getGraphNode().getGraphElement().addEventListener('mousedown', StyleOptions.dragStart);
			currentNode.getGraphNode().getGraphElement().addEventListener('mouseup', StyleOptions.dragEnd);
		}
	}
	
	static deactivateDrag(){
		const currentNode = Main.getTree().getCurrentNode();
		//Remove seelcted style class from dragButton.
		StyleOptions.dragButton.getPageElement().classList.remove('selected');
		//deactivate drag-move
		currentNode.getGraphNode().setPageProperty('cursor', 'auto');
		currentNode.getGraphNode().getGraphElement().removeEventListener('mousedown', StyleOptions.dragStart);
		currentNode.getGraphNode().getGraphElement().removeEventListener('mouseup', StyleOptions.dragEnd);
	}
	
	static dragStart(e){
		//After a mouseDown event on the currentNode, this method begins a drag-move sequence.
		const outputWindow = document.querySelector('#outputWindow');
		//Listen for a mouseMove event in the outputWindow.
		outputWindow.addEventListener('mousemove', StyleOptions.moveCurrentNode);
		//Store the current coordinates of the mouse.
		StyleOptions.dragButton.setXCoord(e.clientX);
		StyleOptions.dragButton.setYCoord(e.clientY);
		//Dispatch an event to indicate that unsaved changes are made to the file.
		window.dispatchEvent(Main.getFileChangedEvent());
	}
	
	static dragEnd(){
		//After a mouseup event on the currentNode, this method ends a drag-move sequence.
		const outputWindow = document.querySelector('#outputWindow');
		outputWindow.removeEventListener('mousemove', StyleOptions.moveCurrentNode);
	}
	
	static moveCurrentNode(e){
		//When the mouse moves in the output window during a drag-move sequence, update coordinates of currentNode.
		const currentNode = Main.getTree().getCurrentNode();
		//Get the amount by which the mouse has moved.
		const deltaX = e.clientX - StyleOptions.dragButton.getXCoord();
		const deltaY = e.clientY - StyleOptions.dragButton.getYCoord();
		//Let the currentNode change coordinates by the same amount.
		currentNode.setCoord(currentNode.getXCoord() + deltaX, currentNode.getYCoord() + deltaY);
		//Formnat lines connecting from the parent to this node.
		if(currentNode.getParentNode().getIsRoot() === false){
			currentNode.getParentNode().transformLines();
		}
		//Store current coordinates
		StyleOptions.dragButton.setXCoord(e.clientX);
		StyleOptions.dragButton.setYCoord(e.clientY);
		//Update coordinates of dragButton and autoformatButton
		StyleOptions.updateDragButtons();
	}
	
	static revertAutoformat(){
		//clicking on the autoformatButton next to a node that has been drag-moved
		//will restore its autoformat to true and position it back where the autoformat
		//algorithm will put it.
		
		//hide the autoformatButton again
		StyleOptions.autoformatButton.setPageProperty('visibility', 'hidden');
		const currentNode = Main.getTree().getCurrentNode();
		//deactivate dragging.
		StyleOptions.deactivateDrag();
		//set autoformat to true
		currentNode.setAutoformat(true);
		//position the node according to autoformat algorithm.
		window.dispatchEvent(Main.getGraphChangedEvent());
	}
}

export{StyleOptions};