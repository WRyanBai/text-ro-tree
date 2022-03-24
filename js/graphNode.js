//GraphNode is a subclass of Selectable that represents nodes in the tree diagram.

import{Selectable} from './Selectable.js';
//import the Utils class to use its utility methods.
import{Utils} from './Utils.js';
import{Main} from './Main.js';

class GraphNode extends Selectable {
	constructor(){
		//call Selectable constructor
		super();
		
		//Currently the only template for nodes in the tree diagram is a rectangle with rounded corners,
		//whose stlye is specified through the rectangleNode css class. In the future, more templates
		//may be added, thus the styleClass attribute is used to account for future extensions.
		//More templates can be added in the future by allowing styleclass to be modified.
		this.nodeStyle = 'rectangleNode';
		
		//Create an html element to represent the node in the tree diagram.
		const graphElement = document.createElement('div');
		graphElement.classList.add('graphElement');
		graphElement.classList.add(this.nodeStyle);
		//Add an html element to display text in graphElement.
		const graphText = document.createElement('div');
		graphText.classList.add('graphText');
		graphElement.appendChild(graphText);
		//Append the element to the canvas of the output window.
		const outputCanvas = document.querySelector('#outputCanvas');
		outputCanvas.appendChild(graphElement);
		//Add graphElement and graphText to the field of GraphNode
		this.graphElement = graphElement;
		this.graphText = graphText;
		
		//set graphElement and graphText to be the pageElement and textElement of Selectable
		super.setPageElement(this.graphElement);
		super.setTextElement(this.graphText);
	}
	
	//accessor and mutator methods
	getNodeStyle(){
		return this.nodeStyle;
	}
	
	setNodeStyle(newNodeStyle){
		//This function is not yet fully implemented since only one nodeStyle is currently available
		//it is present here to improve extensibility for more potential style templates.
		this.nodeStyle = newNodeStyle;
	}
	
	getGraphElement(){
		return(this.graphElement);
	}
	
	setGraphElement(newGraphElement){
		this.graphElement = newGraphElement;
		super.setPageElement(newGraphElement);
	}
	
	getGraphText(){
		return(this.graphText);
	}
	
	setGraphText(newGraphText){
		this.graphText = newGraphText;
		super.setTextElement(newGraphText);
	}
	
	setWidth(newWidth){
		//This method overrides the updateHeight method of Selectable.
		//A graphCHanged event is dispatched.
		super.setWidth(newWidth);
		window.dispatchEvent(Main.getGraphChangedEvent());
	}
	
	updateHeight(){
		//This method overrides the updateHeight method of Selectable.
		//THe functionality is the same, with the exception that the overided method
		//Dispatches a graphChanged event, which allows the graph in the output window
		//to be reformated once the height of a graphNode is changed.
		
		let newHeight = this.getTextHeight();
		newHeight += 2 * this.getPadding();
		if (newHeight != this.getHeight() && Math.abs(newHeight - this.getHeight()) > 1){
			if(newHeight === 2 * this.getPadding()){
				newHeight += Utils.removePx(this.getTextProperty('lineHeight'));
			}
			this.setHeight(newHeight);
			window.dispatchEvent(Main.getGraphChangedEvent());
			}
	}
}

export {GraphNode};