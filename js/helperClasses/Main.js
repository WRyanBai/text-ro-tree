//The Main class contains data to be accessed by controller classes.

import{Tree} from '../dataStructure/Tree.js';
import{TreeNode} from '../dataStructure/TreeNode.js';

class Main{
	constructor() {
		//Setting value for constants and objects
		Main.tree = new Tree();
		Main.tree.getRootNode().appendChildNode(new TreeNode());
		Main.graphChangedEvent =  new Event('graphChanged');
		Main.selectedChangedEvent = new Event('selectedChanged');
		Main.deselectionEvent = new Event('deselection');
		Main.fileChangedEvent = new Event('fileChanged');
		Main.marginX = 50;
		Main.marginY = 25;
		
		//Setting default attributes for elements
		const iconArray = document.querySelectorAll('.icon');
		for(let i = 0; i < iconArray.length; i++){
			iconArray[i].draggable = false;//Set draggable of all icons to false
		};
	}
	
	static getTree(){
		return(this.tree)
	}
	
	static setTree(newTree){
		this.tree = newTree;
	}
	
	static getGraphChangedEvent(){
		return(this.graphChangedEvent);
	}
	
	static getSelectedChangedEvent(){
		return(this.selectedChangedEvent);
	}
	
	static getDeselectionEvent(){
		return(this.deselectionEvent);
	}
	
	static getFileChangedEvent(){
		return(this.fileChangedEvent);
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
