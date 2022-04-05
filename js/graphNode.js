//GraphNode is a subclass of Selectable that represents nodes in the tree diagram.

import{Selectable} from './Selectable.js';
//import the Utils class to use its utility methods.
import{Utils} from './Utils.js';
import{Main} from './Main.js';

class GraphNode extends Selectable {
	constructor(){
		//call Selectable constructor
		super();
		
		//Create an html element to represent the node in the tree diagram.
		const graphElement = document.createElement('div');
		graphElement.classList.add('graphElement');
		graphElement.classList.add('graphNode');
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
	
	setWidth(newWidth){
		//This method overrides the setWidth method of Selectable.
		//A graphChanged event is dispatched.
		super.setWidth(newWidth);
		window.dispatchEvent(Main.getGraphChangedEvent());
	}
	
	setHeight(newHeight){
		//This method overrides the setHeight method of Selectable.
		//A graphChanged event is dispatched.
		super.setHeight(newHeight);
		window.dispatchEvent(Main.getGraphChangedEvent());
	}
	
	//accessor and mutator methods
	
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
}

export {GraphNode};