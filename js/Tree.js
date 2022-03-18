/*This module contains the tree class, which is constructed from treeNode objects.
The tree class represents the parent-child relationship between nodes in the tree diagram.*/

import {TreeNode} from './TreeNode.js';
import{removePx} from './functionUtils.js';

class Tree{
	constructor(firstNode){
		this.rootNode = new TreeNode();
		this.currentNode = firstNode;
		this.rootNode.appendChildNode(firstNode);
	}
	
	getRootNode(){
		return(this.rootNode);
	}
	
	getCurrentNode(){
		return this.currentNode;
	}
	
	setCurrentNode(newCurrentNode){
		this.currentNode = newCurrentNode;
	}
	
	searchNode(searchElement, searchCurrent){
		if (searchCurrent === undefined){
			searchCurrent = this.rootNode.getChildren()[0];
		}
		
		// If the current Node is the selectedNode, return current Node
		if(searchCurrent.getBulletPtSection() === searchElement ||
			searchCurrent.getGraphNode().getGraphElement() === searchElement){
			return(searchCurrent);
		}
		// else, if current node has children, search its children
		else if(searchCurrent.getChildren().length != 0){
			let searchResult = this.searchNode(searchElement, searchCurrent.getChildren()[0])
			//If the selectedNode is found in the children, return results from children
			if(searchResult != null){
				return(searchResult);
			}
		}
		/* At this point, the current node is not the selectedNode and it either has no children
		or a search of children returned nothing. Thus, search siblings, if any exist.*/
		let siblingNumbers = searchCurrent.getParent().getChildren().length;
		//If current node has no siblings or is the last sibling, return null.
		if (searchCurrent.getSiblingIndex() === searchCurrent.getParent().getChildren().length - 1){
			return(null);
		}
		// otherwise, search next sibling.
		else{
			let i = searchCurrent.getSiblingIndex();
			return(this.searchNode(searchElement, searchCurrent.getParent().getChildren()[i+1]));
		}
	}
	
	convertString(list, treeLayer){
		if (list === undefined){
			return("<!confirmation header!>"
				+ this.convertString(this.rootNode.getChildren(), 1));
		}
		let treeString = "";
		let i = 0;
		for (i; i<list.length; i++){
			treeString = treeString + "layer:" + treeLayer.toString() + ";";
			treeString = treeString + "textLength:" + list[i].getText().length + ";";
			treeString = treeString + "text:" + list[i].getText() + ";";
			treeString = treeString + "width:" + list[i].getGraphNode().getGraphWidth() + ";";
			treeString = treeString + "fontSize:" +
				removePx(list[i].getGraphNode().getTextProperty('fontSize')) + ";";
			treeString = treeString + "fontStyle:" +
				list[i].getGraphNode().getTextProperty('fontStyle') + ";";
			treeString = treeString + "fontWeight:" +
				list[i].getGraphNode().getTextProperty('fontWeight') + ";";
			treeString = treeString + "textDecoration:" +
				list[i].getGraphNode().getTextProperty('textDecoration') + ";";
			treeString = treeString + 'textColor:' + list[i].getTextProperty('color') + ';';
			treeString = treeString + 'nodeColor:' + list[i].getGraphNode().getGraphColor() + ';';
			treeString = treeString + "<node>";
			
			if (list[i].getChildren().length != 0){
				treeString = treeString + this.convertString(list[i].children,treeLayer+1);
			}
		}
		return(treeString);
	}
}

export {Tree};
