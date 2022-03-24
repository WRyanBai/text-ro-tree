//The Main class contains data for the FileOptions, TextOptions, NodeOptions, InputField and OutputWindow
//classes to access.

import{Tree} from './Tree.js';
import{TreeNode} from './TreeNode.js';

//The Main class is associated with the following classes that handle user interactions
//import{FileOptions} from './FileOptions.js';

//The Main class is responsible for intitializing the program, it does so by instantiating
//classes that handles various parts of the interface. The data field of Main contains
//constants and objects that are accessed by multiple classes.
class Main{
	constructor() {
		//The data tree
		Main.tree = new Tree();
		Main.tree.getRootNode().appendChildNode(new TreeNode());
		Main.graphChangedEvent =  new Event('graphChanged');
		Main.selectedChangedEvent = new Event('selectedChanged');
		Main.marginX = 50;
		Main.marginY = 25;
	}
	
	static tree;
	static graphChangedEvent;
	static marginX;
	static marginY;
	
	static getTree(){
		return(this.tree)
	}
	
	static setTree(newTree){
		this.tree = newTree;
	}
	
	static getGraphChangedEvent(){
		return(this.graphChangedEvent);
	}
	
	static setGraphChangedEvent(newEvent){
		this.graphChangedEvent = newEvent;
	}
	
	static getSelectedChangedEvent(){
		return(this.selectedChangedEvent);
	}
	
	static setSelectedChangedEvent(newEvent){
		this.selectedChangedEvent = newEvent;
	}
	
	static getMarginX(){
		return(this.marginX)
	}
	
	static setMarginX(newMargin){
		this.marginX = newMargin;
	}
	
	static getMarginY(){
		return(this.marginY)
	}
	
	static setMarginY(newMargin){
		this.marginY = newMargin;
	}
}

export{Main};
