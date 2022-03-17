/*This module contains functions related to creating, indenting, removing, unindenting,
and editing the text of bullet points.*/

//import classes
import{TreeNode} from './TreeNode.js';
//import the bulletPtTree
import {bulletPtTree, graphXMargin, graphYMargin, fontSizeInput, nodeWidthInput, body} from './main.js';
/*import function for formatting the graph, since editing the text content of a bulletPoint
causes the graph to change as well.*/
import {formatGraph} from './functionsGraph.js';
import{removePx, parentContains} from './functionUtils.js';

function nodeClicked(e){
	let target = parentContains(e.target, 'bulletPtSection');
	if (target === null){
		target = parentContains(e.target, 'graphNode');
	}
	let clickedNode = bulletPtTree.searchNode(target);
	
	if (clickedNode != bulletPtTree.getCurrentNode()){
		selectNode(clickedNode);
	}
	else{
		unselectNode(clickedNode);
	}
}

function selectNode(newNode){
	if (bulletPtTree.getCurrentNode() != null){
		unselectNode(bulletPtTree.getCurrentNode());
	}
	bulletPtTree.setCurrentNode(newNode);
	newNode.highlight();
	fontSizeInput.value = removePx(newNode.getTextProperty('fontSize'));
	nodeWidthInput.value = newNode.getGraphNode().getGraphWidth();
}

function unselectNode(newNode){
	bulletPtTree.setCurrentNode(null);
	newNode.unhighlight();
	fontSizeInput.value = '';
	nodeWidthInput.value = '';
}

function preventBlur(e){
	if (parentContains(e.target, 'bulletPtSection')=== null &&
		parentContains(e.target, 'graphNode')=== null){
			bulletPtTree.getCurrentNode().getBulletPtText().focus();
		}
}

function handleKeyPress (e){
	let specialCommand = false;
	if (e.keyCode === 13){
		specialCommand = true;
		e.preventDefault();
		createNewBulletPt();
	}
	else if (e.keyCode === 9){
		specialCommand = true;
		e.preventDefault();
		if(bulletPtTree.getCurrentNode().getSiblingIndex() != 0){
			indentBulletPt();
		}
	}
	else if (e.keyCode === 8 && e.target.textContent.length===0){
		specialCommand = true;
		if(bulletPtTree.getCurrentNode().getParent() === bulletPtTree.getRootNode() &&
			bulletPtTree.getRootNode().getChildren().length != 1){
			removeBulletPt();
		}
		else{
			undoIndentBulletPt();
		}
	}
}

function textChange(e){
	bulletPtTree.getCurrentNode().getGraphNode().setText(
		bulletPtTree.getCurrentNode().getText());
}

function createNewBulletPt(){
	let newBulletPtSection = document.createElement('li');
	newBulletPtSection.classList.add('bulletPtSection');
	let newBulletPtText = document.createElement('div');
	newBulletPtText.classList.add('bulletPtText');
	newBulletPtText.contentEditable = "true";
	newBulletPtSection.appendChild(newBulletPtText);
	//Find the next html element in the dom tree after the current bulletPtSection
	bulletPtContainer.insertBefore(newBulletPtSection,
		bulletPtTree.getCurrentNode().getBulletPtSection().nextSibling);
	let newNode = new TreeNode(newBulletPtSection);
	let i = bulletPtTree.getCurrentNode().getSiblingIndex();
	bulletPtTree.getCurrentNode().getParent().appendChildNode(newNode, i+1);
	selectNode(newNode);
	
	formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
	
}

function indentBulletPt(){
	let previousParent = bulletPtTree.getCurrentNode().getParent();
	let i = bulletPtTree.getCurrentNode().getSiblingIndex();
	bulletPtTree.getCurrentNode().getParent().getChildren()[i-1].appendChildNode(bulletPtTree.getCurrentNode());
	previousParent.removeChildNode(bulletPtTree.getCurrentNode());
	
	formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
}

function undoIndentBulletPt(){
	let previousParent = bulletPtTree.getCurrentNode().getParent();
	let i = previousParent.getSiblingIndex();
	previousParent.getParent().appendChildNode(bulletPtTree.getCurrentNode(), i+1);
	previousParent.removeChildNode(bulletPtTree.getCurrentNode());
	console.log(bulletPtTree);
	
	formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
}

function removeBulletPt(){
	console.log('remove called');
	// The bullet point to be removed is reffered to as previousNode.
	let previousNode = bulletPtTree.getCurrentNode();
	/*The currentNode is set to the node corresponding to the previous html element in the DOM tree, if it exists.
	If not, the currentNode is set to the node corresponding to the next html element in the DOM tree*/
	if (bulletPtTree.getCurrentNode().getBulletPtSection().previousElementSibling != null){
		selectNode(bulletPtTree.searchNode(bulletPtTree.getCurrentNode().
			getBulletPtSection().previousSibling));
	}
	else{
		selectNode(bulletPtTree.searchNode(bulletPtTree.getCurrentNode().
			getBulletPtSection().nextSibling));
	}
    // The html element for the previousNode and all its children are removed with the removeHtml function.
	removeHtml(previousNode);
	// The previous currentNode is removed from the children array of its parents
	previousNode.getParent().removeChildNode(previousNode);
	
	formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
}

function removeHtml(targetNode){
	/*A recursive function to remove the bulletPtSection html element for the targetNode and all its
	children and grandchildren */
	for(let i = 0; i < targetNode.getChildren().length; i++){
        removeHtml(targetNode.getChildren()[i]);
    }
	targetNode.getBulletPtSection().remove();
	targetNode.getGraphNode().getGraphElement().remove();
}

export{nodeClicked, handleKeyPress, textChange, preventBlur};