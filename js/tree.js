import {treeNode} from './treeNode.js';

export class tree{
	constructor(firstNode){
		this.rootNode = new treeNode();
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
		this.currentNode.getBulletPtText().focus();
	}
	
	searchNode(bulletPtSection, searchCurrent){
		if (searchCurrent === undefined){
			searchCurrent = this.rootNode.getChildren()[0];
		}
		
		// If the current Node is the selectedNode, return current Node
		if(searchCurrent.getBulletPtSection() === bulletPtSection){
			return(searchCurrent);
		}
		// else, if current node has children, search its children
		else if(searchCurrent.getChildren().length != 0){
			let searchResult = this.searchNode(bulletPtSection, searchCurrent.getChildren()[0])
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
			return(this.searchNode(bulletPtSection, searchCurrent.getParent().getChildren()[i+1]));
		}
	}
}