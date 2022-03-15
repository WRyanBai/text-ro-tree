/*This file contains functions related to opening a file and saving to files.
When a file is saved, the current bulletPtTree is converted into a string representation
and stored in a .txt file. When a .txt file containing a valid string representation is opened,
a tree will be constructed from the string */

//import classes
import{treeNode} from './treeNode.js';
import{tree} from './tree.js';
//import function
import{formatGraph} from './functionsGraph.js';
//import the bulletPtTree
import {bulletPtTree, graphXMargin, graphYMargin, setTree} from './main.js';

async function loadFile(){
	/*This function is fired when the user clicks on the load button. The user will be
	prompted to select a local file, and if the file contains a valid string representation
	of a tree diagram, the tree diagram will be loaded into the page.*/
	try{
		/* window.alert('Loading a new file will cause current file to be overwritten.'
		+ ' To prevent losing progress, make sure the current file is saved.') */
		// File picker dialog for user to select file to open.
		const [fileHandle] = await window.showOpenFilePicker();
		
		//Read text content of file in fileText.
		const selectedFile = await fileHandle.getFile();
		const fileText = await selectedFile.text();
		
		/*Create string representation of previous tree.*/
		const previousTree = bulletPtTree.convertString();
		try{
			//Construct a new tree in the page from the fileText.
			treeFromString(fileText);
		}catch(e){
			console.log(e);
			//In the case of an error, recover the previous tree.
			treeFromString(previousTree);
		}
	}catch(e){
		//This catch block handles the error thrown if the user aborts the file picker dialog.
	}
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
	let newTree;
	//Check if string starts with the valid confirmation header, throw error if header is incorrect.
	if(treeString.substring(0, 23) != "<!confirmation header!>"){
		throw("invalid file");
	}
	//Remove all current elements in the inner HTML of the canvas and bulletPtContainer.
	//They will be overwritten when a new tree is loaded.
	canvas.innerHTML = "";
	bulletPtContainer.innerHTML = "";
		
	//Get substring after header.
	treeString = treeString.substring(23);
		
	let i = 0;
	let currentLayer = 0;
	let results;
		
	while(treeString.length != 0){
		results = readProperty("layer", "number", treeString);
		let treeLayer = results[0];
		//Numeric properties could encounter errors where the value is NaN.
		if(treeLayer === "error"){throw("invalid file");}
		treeString = results[1];
		
		results = readProperty("textLength", "number", treeString);
		let textLength = results[0];
		//Numeric properties could encounter errors where the value is NaN.
		if(textLength === "error"){throw("invalid file");}
		treeString = results[1];
		
		results = readProperty("text", "string", treeString, textLength);
		let nodeText = results[0];
		treeString = results[1];
		
		results = readProperty("width", "number", treeString);
		let width = results[0];
		//Numeric properties could encounter errors where the value is NaN.
		if(width === "error" || width < 70 || width > 1000){
			console.log('reached1');
			throw("invalid file");
		}
		treeString = results[1];
		
		results = readProperty("fontSize", "number", treeString);
		let fontSize = results[0];
		//Numeric properties could encounter errors where the value is NaN.
		if(fontSize === "error" || fontSize < 5 || fontSize > 70){
			throw("invalid file");
		}
		treeString = results[1];
		
		results = readProperty("fontStyle", "string", treeString);
		let fontStyle = results[0];
		if(fontStyle != "normal" && fontStyle != "italic"){
			throw("invalid file");
		}
		treeString = results[1];
		
		results = readProperty("fontWeight", "string", treeString);
		let fontWeight = results[0];
		if(fontWeight != "400" && fontWeight != "700"){
			throw("invalid file");
		}
		treeString = results[1];
		
		results = readProperty("textDecoration", "string", treeString);
		let textDecoration = results[0];
		if(textDecoration.split(' ')[0] != 'none' && textDecoration.split(' ')[0] != 'underline'){
			throw("invalid file");
		}
		treeString = results[1];
		
		//Remove '<node>' from string.
		treeString = treeString.substring(6);
			
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
		newNode.getGraphNode().setGraphWidth(width);
		newNode.setFontSize(fontSize);
		newNode.setTextProperty('fontStyle', fontStyle);
		newNode.setTextProperty('fontWeight', fontWeight);
		newNode.setTextProperty('textDecoration', textDecoration);
			
		if(currentLayer === 0){
			//If currentLayer is 0, thenew node corresponds to the first node of the tree.
			//Create a new tree with the first node set to the newly created node.
			newTree = new tree(newNode);
			currentLayer = treeLayer;
		}else if(treeLayer > currentLayer){
			/*In correct files, if a node's treelayer is larger than the preceeding node, it
			 must be a child of the direct node, thus the treeLayer should only be larger by 1.*/
			if(treeLayer === currentLayer + 1){
				newTree.getCurrentNode().appendChildNode(newNode);
				newTree.setCurrentNode(newNode, false);
				currentLayer = treeLayer;
			}else{
				//If this is not the case, then the file is invalid. An error will be thrown.
				throw('invalid file');
			}
		}else if(treeLayer === currentLayer){
			newTree.getCurrentNode().getParent().appendChildNode(newNode);
			newTree.setCurrentNode(newNode, false);
			currentLayer = treeLayer;
		}else if(treeLayer < currentLayer){
			for(let j = 0; j < currentLayer - treeLayer + 1; j++){
				newTree.setCurrentNode(newTree.getCurrentNode().getParent(), false);
			}
			newTree.getCurrentNode().appendChildNode(newNode);
				
			newTree.setCurrentNode(newNode, false);
			currentLayer = treeLayer;
		}
	}
	setTree(newTree);
	formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
}

function readProperty(propertyName, propertyType, treeString, textLength){
	let propertyValue;
	//Remove propertyName and colon from string
	treeString = treeString.substring(propertyName.length + 1);
	
	if (propertyName != "text"){
		//TProperties other than text are handled in this branch.
		let i = 0;
		//Use a for loop to find the index of next semicolon
		for (i; i < treeString.length; i++){
			if(treeString.charAt(i) === ';'){
				break;
			}
		}
		//The propertyValue is written in the substring up until the semicolon
		propertyValue = treeString.substring(0, i);
		if (propertyType === 'number'){
			propertyValue = parseInt(propertyValue)
			//Incorrect file structure could lead to propertyValues being NaN. If so, return an error.
			if(isNaN(propertyValue)){
				return(["<!error!>"])
			}
		}
		//Remove semicolon from string.
		treeString = treeString.substring(i + 1);
		return ([propertyValue, treeString]);
	}else{
		/*Unlike other propertie, the text property is read using the textLength.
		This avoids errors caused by semicolon in the text.*/
		propertyValue = treeString.substring(0, textLength);
		//Remove semicolon from string.
		treeString = treeString.substring(textLength + 1);
		return ([propertyValue, treeString]);
	}
}

export{loadFile, saveFile}