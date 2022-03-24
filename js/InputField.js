// The InputField class is responsible for handling inputs typed in the bullet point field

import{Main} from './Main.js';
import{Utils} from './Utils.js';
import{TreeNode} from './TreeNode.js';

class InputField {
	
	constructor (){
		//create the static variable inputFieldElement
		InputField.inputFieldElement = document.querySelector('#inputField');
		//Add event listeners to the firstNode of the tree, which is currently the only node.
		let firstNode = Main.getTree().getRootNode().getChildren()[0];
		//Clicking on a bulletPtElement or graphElement selects it and double clicking deselects it.
		//Both types of events are handled by the handleClick method.
		firstNode.getBulletPoint().getBulletPtElement().addEventListener('click', InputField.handleClick);
		firstNode.getBulletPoint().getBulletPtElement().addEventListener('dblclick', InputField.handleClick);
		firstNode.getGraphNode().getGraphElement().addEventListener('click', InputField.handleClick);
		firstNode.getGraphNode().getGraphElement().addEventListener('dblclick', InputField.handleClick);
		//On input a method is called to update the text.
		firstNode.getBulletPoint().getBulletPtText().addEventListener('input', InputField.textChange);
		//On a keypress event in a bulletPtText a method is called to check for special key commands
		firstNode.getBulletPoint().getBulletPtText().addEventListener('keydown', InputField.handleKeyDown);
	}
	
	static handleClick(e){
		//This method is called when a bulletPtElement or graphElement is clicked.
		// A node should be selected\deselected. The appropriate method is called to handle the action
		
		//Check if a bulletPtElement was clicked.
		let target = Utils.parentContains(e.target, 'bulletPtElement');
		if (target === null){
			//If not, a graphElement must have been clicked.
			target = Utils.parentContains(e.target, 'graphElement');
		}
		//Find the TreeNode that contains the element which was clicked.
		const clickedNode = Main.getTree().searchNode(target);
	
		if (e.type === 'click' && clickedNode != Main.getTree().getCurrentNode()){
			//If the node that was clicked is not currently selected and the event is a single click
			//select the clicked node.
			InputField.selectNode(clickedNode);
		}
		else if (e.type === 'dblclick' && clickedNode === Main.getTree().getCurrentNode()){
			//If the node clicked is already selected and the event is double click, deselect it.
			InputField.deselectNode(clickedNode);
		}
	}
	
	static selectNode(targetNode){
		//This method selects the targetNode.
		
		if (Main.getTree().getCurrentNode() != null){
			//If another node is currently selected, unselect it.
			InputField.deselectNode(Main.getTree().getCurrentNode());
		}
		//Set the currentNode of the data tree to be targetNode.
		Main.getTree().setCurrentNode(targetNode);
		//Dispatch an event indicating the selected node has changed.
		window.dispatchEvent(Main.getSelectedChangedEvent());
		//highlight the node to emphasize that it is selected.
		targetNode.highlight();
	}
	
	static deselectNode(targetNode){
		//This method deselects the targetNode.
		Main.getTree().setCurrentNode(null);
		//Dispatch an event indicating the selected node has changed.
		window.dispatchEvent(Main.getSelectedChangedEvent());
		targetNode.unhighlight();
	}
	
	static textChange(e){
		//Get the textContent from bulletPtText
		let textContent = Main.getTree().getCurrentNode().getText();
		//Set the text of graphText to match
		Main.getTree().getCurrentNode().setText(textContent);
	}
	
	static handleKeyDown(e){
		//This method handles the creatuon and indentation of bullet points through the
		//enter, tab, and backspace keys.
		//There is no need to get the target of the keypress event since only the currentNode
		//can be typed into, so the target is always the currentNode of the tree.
		
		//Use the window.getSelection method to find the position of the caret in the text.
		let sel = window.getSelection();
		if (e.keyCode === 13){
			//In the case that the enter key is pressed, create a new bullet point.
			e.preventDefault();
			InputField.createNode();
		}
		else if (e.keyCode === 9){
			//In the case that the tab key is pressed, indent the bullet point.
			e.preventDefault();
			InputField.indentCurrentNode();
		}
		else if (e.keyCode === 8 && sel.anchorOffset === 0){
			//If backspace is pressed and the caret is at the start of the textcontent,
			//The bullet point will be unindented or deleted.
			if(Main.getTree().getCurrentNode().getParentNode().getIsRoot() === true &&
				Main.getTree().getRootNode().getChildren().length != 1){
				//If the currentNode has rootNode as its parent and is not the only node, remove it.
				InputField.removeCurrentNode();
			}
			else{
				//Otherwise simply unindent the current node.
				InputField.unindentCurrentNode();
			}
		}
	}
	
	static createNode(){
		//Create a new treeNode.
		const newNode = new TreeNode();
		
		//add event listeners to elements of the newNode.
		newNode.getBulletPoint().getBulletPtElement().addEventListener('click', InputField.handleClick);
		newNode.getBulletPoint().getBulletPtElement().addEventListener('dblclick', InputField.handleClick);
		newNode.getGraphNode().getGraphElement().addEventListener('click', InputField.handleClick);
		newNode.getGraphNode().getGraphElement().addEventListener('dblclick', InputField.handleClick);
		newNode.getBulletPoint().getBulletPtText().addEventListener('input', InputField.textChange);
		newNode.getBulletPoint().getBulletPtText().addEventListener('keydown', InputField.handleKeyDown);
		
		//insert newNode after the tree's currentNode.
		InputField.insertAfter(newNode, Main.getTree().getCurrentNode());
		
		//Let the newly created node be selected.
		InputField.selectNode(newNode);
		
		//Dispatch the graphChanged event to reformat the graph.
		window.dispatchEvent(Main.getGraphChangedEvent());
	}
	
	static indentCurrentNode(){
		//This method indents the currentNode according to the logic of bullet points.
		const currentNode = Main.getTree().getCurrentNode();
		const i = currentNode.getIndex();
		if(i != 0 && currentNode.getBulletPoint().getMargin() <= 220){
			//Indent the node if it is not a first child i.e. index is not 0
			//Nodes that are first child cannot be indented.
			
			//get the node's previous sibling in the data tree.
			const previousSibling = currentNode.getParentNode().getChildren()[i-1];
			//Append currentNode as a child to previousSibling.
			previousSibling.appendChildNode(currentNode);
			if(currentNode.getChildren().length != 0){
				//if currentNode has children, they are transfered to previousSibling.
				InputField.transferChildren(currentNode, previousSibling, 0);
			}
			
			//Dispatch the graphChanged event to reformat the graph.
			window.dispatchEvent(Main.getGraphChangedEvent());
		}
	}
	
	static unindentCurrentNode(){
		//This method unindents the currentNode according to the logic of bullet points.
		
		const currentNode = Main.getTree().getCurrentNode();
		const currentParent = currentNode.getParentNode();
		
		let inheritChildren = false;
		const currentNodeIndex = currentNode.getIndex();
		if(currentNodeIndex != currentParent.getChildren().length - 1){
			//If currentNode is not the last child of currentParent, currentNode will inheritChildren
			//The remaining children after it is unindented.
			inheritChildren = true;
		}
		
		const currentParentIndex = currentParent.getIndex();
		//Insert the currentNode as a sibling to currentParent in the index after currentParent.
		currentParent.getParentNode().appendChildNode(currentNode, currentParentIndex+1);
		//update the margin of currentNode's descendents.
		InputField.updateChildMargin(currentNode);
		
		if(inheritChildren === true){
			//currentNode will inherit all of currentParent's children after currentNodeIndex
			InputField.transferChildren(currentParent, currentNode, currentNodeIndex);
		}
		
		//Dispatch the graphChanged event to reformat the graph.
		window.dispatchEvent(Main.getGraphChangedEvent());
	}
	
	static removeCurrentNode(){
		//This method removes the current node and transfers all its children to its parent.
		const currentNode = Main.getTree().getCurrentNode();
		const currentParent = currentNode.getParentNode();
		const currentIndex = currentNode.getIndex();
		//remove CurrentNode from the children of its parent.
		currentParent.removeChildNode(currentNode);
		//Transfer all of currentNode's children to currentParent.
		InputField.transferChildren(currentNode, currentParent, 0, currentIndex);
		
		for(let i = currentIndex; i < currentParent.getChildren().length; i++){
			//iterate through all the newly transfered nodes and update their margin.
			InputField.updateChildMargin(currentParent.getChildren()[i]);
		}
		//Remove currentNode's html elements.
		currentNode.remove();
		Main.getTree().setCurrentNode(null);
		//Dispatch an event indicating the selected node has changed.
		window.dispatchEvent(Main.getSelectedChangedEvent());
		
		//Dispatch the graphChanged event to reformat the graph.
		window.dispatchEvent(Main.getGraphChangedEvent());
	}
	
	static transferChildren(fromNode, toNode, startIndex, toIndex){
		//This method transfers all the children of fromNode starting with the startIndex
		//to the children array of toNode at toIndex.
		
		let end = fromNode.getChildren().length;
		for(let i = startIndex; i < end; i++){
			//This loop will interate for n times, where n is the number of items
			//at or after startIndex.
			if(toIndex === undefined){
				toNode.appendChildNode(fromNode.getChildren()[startIndex]);
			}else{
				toNode.appendChildNode(fromNode.getChildren()[startIndex], toIndex);
				toIndex += 1;
			}
			//The child at startIndex is appended to the children array of toNode.
			//The appendChildNode function automatically removes the node at startIndex from
			//the children array of fromNode, so a different node will be at startIndex in the next
			//iteration. After n iterations, all elements originally at or after startIndex will
			//be moved to the children array of toNode.
		}
	}
	
	static updateChildMargin(targetNode){
		//When a node is unindented, its margin has changed, and so must the margin of its children.
		//This method recursively updates the margin of all of targetNode's descendents.
		const childrenList = targetNode.getChildren();
		let i = 0;
		for(i; i < childrenList.length; i++){
			//This line updates the margin of each children using the setParentNode method.
			childrenList[i].setParentNode(childrenList[i].getParentNode());
			
			if(childrenList[i].getChildren().length != 0){
				//If a node in childrenList also has children, recursively update their children as well.
				InputField.updateChildMargin(childrenList[i]);
			}
		}
	}
	
	static insertAfter(newNode, referenceNode){
		//This method is given two TreeNode objects as inputs.
		//It inserts newNode after referenceNode according to the logic of bullet points.
		
		//Insert the bulletPtElement of newNode directly after the bulletPtElement of referenceNode.
		const referenceBulletPt = referenceNode.getBulletPoint().getBulletPtElement();
		const newBulletPt = newNode.getBulletPoint().getBulletPtElement();
		//Use javascript's built in insertBefore method for DOM tree elements, insert before
		//the next sibling of referenceBulletPt.
		InputField.inputFieldElement.insertBefore(newBulletPt, referenceBulletPt.nextElementSibling);
		
		//newNode is inserted into the children list of referenceNode's parentNode in the index
		//after referenceNode.
		const i = referenceNode.getIndex();
		referenceNode.getParentNode().appendChildNode(newNode, i+1);
		//If referenceNode has children, they should now be inherited by the newNode.
		if(referenceNode.getChildren().length != 0){
			//If referenceNode has children, they will be transfered to become children of newNode.
			InputField.transferChildren(referenceNode, newNode, 0)
		}
	}
	
	static insertBefore(newNode, referenceNode){
		//This method is given two TreeNode objects as inputs.
		//It inserts newNode before referenceNode according to the logic of bullet points.
		//Not to be confused with JavaScript's built-in insertBefore method for nodes in the DOM tree.
		
		//Insert the bulletPtElement of newNode directly before the bulletPtElement of referenceNode.
		const referenceBulletPt = referenceNode.getBulletPoint().getBulletPtElement();
		const newBulletPt = newNode.getBulletPoint().getBulletPtElement();
		InputField.inputFieldElement.insertBefore(newBulletPt, referenceBulletPt);
		
		//newNode is inserted into the children list of referenceNode's parentNode in the index
		//of referenceNode.
		const i = referenceNode.getIndex();
		referenceNode.getParentNode().appendChildNode(newNode, i);
	}
}

export{InputField}