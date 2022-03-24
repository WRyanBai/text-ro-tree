//The Tree class represents a data tree composed of TreeNode objects.

import {TreeNode} from './TreeNode.js';
import{Utils} from './Utils.js';
import{Main} from './Main.js';

class Tree{
	constructor(){
		//The rootNode is only a logical node, it has no html element manifestations on the page.
		this.rootNode = new TreeNode(true);
		
		//The currentNode is set to null by default.
		this.currentNode = null;
	}
	
	getRootNode(){
		return(this.rootNode);
	}
	
	getCurrentNode(){
		return this.currentNode;
	}
	
	setCurrentNode(newCurrentNode){
		this.currentNode = newCurrentNode;
		//Dispatch an event to signal that the selected node has changed, so that the interface can
		//respond correspondingly.
	}
	
	searchNode(searchElement, searchCurrent){
		//This element traverses the tree recursively to find a treeNode which contains
		//searchElement as either its graphElement or bulletPtElement.
		//searchCurrent refers to the TreeNode currently being searched.
		
		if (searchCurrent === undefined){
			//When searchCurrent is not entered, begin with the first child of rootNode by default.
			searchCurrent = this.rootNode.getChildren()[0];
		}
		
		// If the searchCurrent contains searchElement, return current Node
		if(searchCurrent.getBulletPoint().getBulletPtElement() === searchElement ||
			searchCurrent.getGraphNode().getGraphElement() === searchElement){
			return(searchCurrent);
		}
		// else, if searchCurrent has children, search its children
		else if(searchCurrent.getChildren().length != 0){
			let searchResult = this.searchNode(searchElement, searchCurrent.getChildren()[0])
			//If the searchELement is found in the children, return results from children
			if(searchResult != null){
				return(searchResult);
			}
		}
		//This branch of code is reached if searchCurrent does not contain searchElement and
		//it either has no children or its children returned null.
		//Check is searchCurrent is the last of its siblings.
		let siblingNumbers = searchCurrent.getParentNode().getChildren().length;
		//If current node has no siblings or is the last sibling, return null.
		if (searchCurrent.getIndex() === searchCurrent.getParentNode().getChildren().length - 1){
			return(null);
		}
		// otherwise, search next sibling and return its results.
		else{
			let i = searchCurrent.getIndex();
			return(this.searchNode(searchElement, searchCurrent.getParentNode().getChildren()[i+1]));
		}
	}
	
	toString(list, treeLayer){
		//A recusrive function to generate string representation of a tree.
		//list is an array of TreeNode objects who are siblings in the tree. Every TreeNode
		//in the list and their children will be included in the string representation.
		//treeLayer indicates which layer of the tree these siblings occupy.
		
		if (list === undefined){
			//The parameters are undefined in the first layer of recursion.
			
			//The recursion is initiated by setting the treeLayer to 1 and calling on this
			//method with list set to the first layer of the tree, which are the direct children
			//of the root node.
			let treeLayer = 1;
			let treeString = this.toString(this.rootNode.getChildren(), treeLayer);
			//add a header to confirm that this string is in correct format.
			treeString = '<!confirmation header!>' + treeString;
			return(treeString)
		}else{
			let treeString = "";
			let i = 0;
			for (i; i<list.length; i++){
				//In the recursive case, iterate through each TreeNode in the list
				//Add an extra attribute layer to preserve the hierarchical structure in the string.
				treeString = treeString + "layer:" + treeLayer.toString() + ";";
				//Get the string representation of each TreeNode
				treeString = treeString + list[i].toString();
				if (list[i].getChildren().length != 0){
					//if a node has children, call toString on its children array.
					treeString = treeString + this.toString(list[i].children, treeLayer+1);
				}
			}
			return(treeString);
		}
	}
}

export {Tree};