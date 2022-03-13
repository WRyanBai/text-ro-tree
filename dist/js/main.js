//classes
import{treeNode} from './treeNode.js';
import{graphNode} from './graphNode.js';
import{graphLine} from './graphLine.js';
import{tree} from './tree.js';

//Elements
const bulletPtContainer = document.querySelector('#bulletPtContainer');
export const canvas = document.querySelector('#canvas');
export let bulletPtTree = new tree(new treeNode(bulletPtContainer.firstElementChild));
export const graphXMargin = 50;
export const graphYMargin = 25;
const loadButton = document.querySelector('#loadFiles');
const saveButton = document.querySelector('#saveFiles');
loadButton.addEventListener('click', loadFile);
saveButton.addEventListener('click', saveFile);

formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);

//Functions
export function selectBulletPt(e){
	let target = e.target;
	while(! target.classList.contains('bulletPtSection')){
		target = target.parentNode;
	}
	bulletPtTree.setCurrentNode(bulletPtTree.searchNode(target));
	console.log(bulletPtTree);
}

export function handleKeyPress (e){
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

export function textChange(e){
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
	console.log(bulletPtTree);
	
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

export function formatGraph (nodeList,startX, startY, graphXMargin, graphYMargin){
	//console.log(nodeList);
	startX += graphXMargin;
	let graphTotalHeight = startY
	let i = 0;
	let totalHeight;
	for (i; i < nodeList.length; i++){
		startY += graphYMargin;
		if (nodeList[i].getChildren().length === 0){
			nodeList[i].getGraphNode().setGraphCoord(startX, startY);
			startY += nodeList[i].getGraphNode().getGraphHeight();
		}else{
			totalHeight = formatGraph(nodeList[i].getChildren(),
				startX + nodeList[i].getGraphNode().getGraphWidth(),
				startY - graphYMargin, graphXMargin, graphYMargin);
			if(totalHeight > nodeList[i].getGraphNode().getGraphHeight()){
				nodeList[i].getGraphNode().setGraphCoord(startX,
					startY + (totalHeight - nodeList[i].getGraphNode().getGraphHeight())/2);
			}else{
				formatGraph(nodeList[i].getChildren(),
					startX + nodeList[i].getGraphNode().getGraphWidth(), startY - graphYMargin
					+ (nodeList[i].getGraphNode().getGraphHeight() - totalHeight)/2, graphXMargin,
					graphYMargin);
				totalHeight = nodeList[i].getGraphNode().getGraphHeight();
				nodeList[i].getGraphNode().setGraphCoord(startX, startY);
			}
			for(let j = 0; j<nodeList[i].getGraphLines().length; j++){
				nodeList[i].getGraphLines()[j].transformLine();
			}
			startY += totalHeight;
		}
	}
	graphTotalHeight = startY - graphTotalHeight - graphYMargin;
	return(graphTotalHeight);
}

/* async function loadFile(){
	const selectedFile = loadButton.firstElementChild.files[0];
	const fileText = await selectedFile.text();
	console.log(fileText);
} */

async function loadFile(){
	const [fileHandle] = await window.showOpenFilePicker();
	const selectedFile = await fileHandle.getFile();
	const fileText = await selectedFile.text();
	treeFromString(fileText);
}

async function saveFile(){
	/*This function is fired after the user clicks on the saveFiles button. It allows the user
	to create a new file in their local storage to save the current tree diagram*/
	
	//The options variable spcifies that only '.txt' files will be accepted for saving to.
	const options = {
		types:[
			{
				description:'Text Files',
				accept:{
					'text/plain':['.txt']
				},
			},
		],
	};
	//Prompts a file picker dialog box for users to create a file in their local storage to save to.
	const saveFileHandle = await window.showSaveFilePicker();
	//Create writable file stream to write to the file created by user.
	const writable = await saveFileHandle.createWritable();
	/*The contents of the file is a string representation of the tree diagram,
	created using the convertString() method.*/
	const fileContent = bulletPtTree.convertString();
	//Write the content and close the writable file stream.
	await writable.write(fileContent);
	await writable.close();
}

function treeFromString(treeString){
	//This function takes a string representation of a tree as input and creates a tree object from the string.
	
	//Check if string starts with the valid confirmation header.
	if(treeString.substring(0, 23) === "<!confirmation header!>"){
		//Remove all current elements in the inner HTML of the canvas and bulletPtContainer.
		//They will be overwritten when a new tree is loaded.
		canvas.innerHTML = "";
		bulletPtContainer.innerHTML = "";
		
		//Get substring after header.
		treeString = treeString.substring(23);
		
		let i = 0;
		let currentLayer = 0;
		
		while(treeString.length != 0){
			//Get the substring after 'layer:'
			treeString = treeString.substring(6);
			//Use a for loop to find the index of next semicolon
			for (i=0; i<treeString.length;i++){
				if(treeString.charAt(i) === ';'){
					break;
				}
			}
			//The value of treeLayer is the substring up until the semicolon
			let treeLayer = parseInt(treeString.substring(0, i));
			//Get the substring after the semicolon and 'textLength:'
			treeString = treeString.substring(i+12);
			//Find the index of next semicolon
			for (i=0; i<treeString.length;i++){
				if(treeString.charAt(i) === ';'){
					break;
				}
			}
			//The value of textLength is the substring up until the semicolon
			let textLength = parseInt(treeString.substring(0, i));
			//Get the substring after the semicolon and 'text:'
			treeString = treeString.substring(i+6);
			//Get nodeText using the textLength;
			let nodeText = treeString.substring(0, textLength);
			//Get substring after text and ';<node>'
			treeString = treeString.substring(textLength + 7);
			
			//Create new treeNode based on information read from string.
			//Create the a bulletPtSection and BulletPtText.
			let newBulletPtSection = document.createElement('li');
			newBulletPtSection.classList.add('bulletPtSection');
			let newBulletPtText = document.createElement('div');
			newBulletPtText.classList.add('bulletPtText');
			newBulletPtText.contentEditable = "true";
			newBulletPtSection.appendChild(newBulletPtText);
			bulletPtContainer.appendChild(newBulletPtSection);
			//Create a new node.
			let newNode = new treeNode(newBulletPtSection);
			//set the text of the newNode.
			newNode.setText(nodeText);
			if(textLength === 0){
				console.log(newNode)
				console.log(newNode.getBulletPtText());
			}
			
			if(currentLayer === 0){
				//If currentLayer is 0, thenew node corresponds to the first node of the tree.
				//Create a new tree with the first node set to the newly created node.
				bulletPtTree = new tree(newNode);
				currentLayer = treeLayer;
			}else if(treeLayer > currentLayer){
				if(treeLayer === currentLayer + 1){
					bulletPtTree.getCurrentNode().appendChildNode(newNode);
					bulletPtTree.setCurrentNode(newNode, false);
					currentLayer = treeLayer;
				}else{
					//throw error
				}
			}else if(treeLayer === currentLayer){
				bulletPtTree.getCurrentNode().getParent().appendChildNode(newNode);
				bulletPtTree.setCurrentNode(newNode, false);
				currentLayer = treeLayer;
			}else if(treeLayer < currentLayer){
				for(let j = 0; j < currentLayer - treeLayer + 1; j++){
					bulletPtTree.setCurrentNode(bulletPtTree.getCurrentNode().getParent(), false);
				}
				bulletPtTree.getCurrentNode().appendChildNode(newNode);
				
				bulletPtTree.setCurrentNode(newNode, false);
				currentLayer = treeLayer;
			}
		}
		formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
	}else{
		console.log('error');
	}
}