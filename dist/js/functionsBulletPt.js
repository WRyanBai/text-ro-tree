/*This module contains functions related to creating, indenting, removing, unindenting,
and editing the text of bullet points.*/

//import classes
import{treeNode} from './treeNode.js';
//import the bulletPtTree
import {bulletPtTree, graphXMargin, graphYMargin} from './main.js';
/*import function for formatting the graph, since editing the text content of a bulletPoint
causes the graph to change as well.*/
import {formatGraph} from './functionsGraph.js';
import{removePx} from './functionUtils.js';

function selectBulletPt(e){
	let target = e.target;
	while(! target.classList.contains('bulletPtSection')){
		target = target.parentNode;
	}
	bulletPtTree.setCurrentNode(bulletPtTree.searchNode(target));
	
	let fontSize = bulletPtTree.getCurrentNode().getTextProperty('fontSize');
	fontSize = removePx(fontSize);
	fontSizeInput.value = fontSize;
	let nodeWidth = bulletPtTree.getCurrentNode().getGraphNode().getGraphWidth();
	nodeWidthInput.value = nodeWidth;
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
	let newNode = new treeNode(newBulletPtSection);
	let i = bulletPtTree.getCurrentNode().getSiblingIndex();
	bulletPtTree.getCurrentNode().getParent().appendChildNode(newNode, i+1);
	bulletPtTree.setCurrentNode(newNode);
	
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
		bulletPtTree.setCurrentNode(bulletPtTree.searchNode(bulletPtTree.getCurrentNode().
			getBulletPtSection().previousSibling));
	}
	else{
		bulletPtTree.setCurrentNode(bulletPtTree.searchNode(bulletPtTree.getCurrentNode().
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

export{selectBulletPt, handleKeyPress, textChange};