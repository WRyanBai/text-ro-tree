//The FileOptions class handles user interactions related to opening, saving, and exporting files

import {Main} from './Main.js';
import {InputField} from './InputField.js';
import {OutputWindow} from './OutputWindow.js';
import {Tree} from './Tree.js';
import {TreeNode} from './TreeNode.js';
import {Utils} from './Utils.js';

class FileOptions{
	constructor(){
		//Get html interface elements related to files.
		FileOptions.openButton = document.querySelector('#openButton');
		FileOptions.saveButton = document.querySelector('#saveButton');
		FileOptions.saveAsButton = document.querySelector('#saveAsButton');
		FileOptions.exportButton = document.querySelector('#exportButton');
		//The fileHandle is an object representing the file that will be saved to.
		FileOptions.fileHandle = null;
		
		//Add listeners to interface elements
		saveButton.addEventListener('click', FileOptions.saveFile);
		saveAsButton.addEventListener('click', FileOptions.saveFileAs);
		openButton.addEventListener('click', FileOptions.openFile);
		exportButton.addEventListener('click', FileOptions.exportFile);
	}
	
	static async saveFile(){
		//The save button will save to the file previously opened or saved to.
		//If no file was previously opened or saved to, it calls the saveFileAs method.
		if(FileOptions.fileHandle != null){
			//If fileHandle is not null, a file has previously been opened or saved to.
			//Create writable file stream to that file.
			const writable = await FileOptions.fileHandle.createWritable();
			//Get a string representation of the tree.
			const fileContent = Main.getTree().toString();
			//Write the content and close the writable file stream.
			await writable.write(fileContent);
			await writable.close();
		}else{
			//If fileHandle is null, call saveFileAs method.
			await FileOptions.saveFileAs();
		}
		
	}
	
	static async saveFileAs(){
		//This method will prompt a filePicker dialog for the user to select a file to save to.
		
		//This parameter is used to restrict the file type that users can choose to only '.txt' files
		const options = {types:[{description:'Text Files',accept:{'text/plain':['.txt']},},],};
		try{
			//Try to set fileHandle to a file selected by the user with the FilePicker dialog.
			FileOptions.fileHandle = await window.showSaveFilePicker(options);
			//Create writable file stream to write to the file picked by user.
			const writable = await FileOptions.fileHandle.createWritable();
			//Get a string representation of the tree.
			const fileContent = Main.getTree().toString();
			//Write the content and close the writable file stream.
			await writable.write(fileContent);
			await writable.close();
		}catch(e){
			//Avoids errors prompted by the case where user does not select any file.
		}
	}
	
	static async openFile(){
		//This method will prompt a filePicker dialog for the user to select a file to open.
		//This parameter is used to restrict the file type that users can choose to only '.txt' files
		const options = {types:[{description:'Text Files',accept:{'text/plain':['.txt']},},],};
		
		try{
			//Prompt the file picker dialog box, ctach for the error where user does not choose a file.
			//The file picker dialog will return an array of fileHandle objects.
			const files = await window.showOpenFilePicker(options);
			//Set the fileHandle of FIleOptions class to be the first object in the array.
			FileOptions.fileHandle = files[0];
			//Get the text of the file.
			const selectedFile = await FileOptions.fileHandle.getFile();
			const textContent = await selectedFile.text();
			
			//To prevent the current tree being overwritten in the case of a file with invalid format being opened,
			//generate a string to preserve information of current tree.
			const currentTree = Main.getTree().toString();
			try{
				//Construct a new tree diagram in the page from the textContent, catch for errors
				//related to invalid file format.
				const newTree = FileOptions.treeFromString(textContent);
				Main.setTree(newTree);
				
				//setCurrentNode to null;
				Main.getTree().setCurrentNode(null);
				//Dispatch an event indicating selected node has changed
				window.dispatchEvent(Main.getSelectedChangedEvent());
				//Dispatch an event indicating that graph has changed
				window.dispatchEvent(Main.getGraphChangedEvent());
			}catch(e){
				//In the case of an invalid file format, recover the current tree.
				FileOptions.treeFromString(currentTree);
			}
		}catch(e){
			console.log(e);
		}
	}
	
	static treeFromString(treeString){
		//This method takes in the string representation of a tree and generates a tree object from the string.
		
		//Check if string starts with the valid header.
		if(treeString.substring(0, 23) != "<!confirmation header!>"){
			throw("invalid file");
		}
		//Remove all current elements in the inner HTML of the outputCanvas and inputField.
		//They will be overwritten when a new tree is loaded.
		const outputCanvas = document.querySelector('#outputCanvas');
		outputCanvas.innerHTML = "";
		const inputField = document.querySelector('#inputField');
		inputField.innerHTML = "";
		
		//Get substring after header.
		treeString = treeString.substring(23);
		
		//The currentLayer indicates the layer of the node last added.
		let currentLayer = 0;
		//results stores the results of reading a property value.
		let results;
		//newTree is the new tree object created.
		let newTree = new Tree();
		
		while(treeString.length != 0){
			//Iterate through the string.
			
			//Read the layer property using the readProperty method.
			results = FileOptions.readProperty("layer", "number", treeString);
			//This method returns 2 values. the first is the value of the property read.
			let treeLayer = results[0];
			//The other is the remaining part of treeString after information about this property
			//is removed.
			treeString = results[1];
			
			//read textLength
			results = FileOptions.readProperty("textLength", "number", treeString);
			let textLength = results[0];
			treeString = results[1];
			
			//Unlike other properties, the text property is not read using the readProperty method.
			//This avoids errors due to semicolons inputted by user in text.
			treeString = treeString.substring('text'.length + 1);//Remove 'text:' from the string
			let nodeText = treeString.substring(0, textLength);//Use textLength to avoid errors due to semicolons
			treeString = treeString.substring(textLength + 1);//Remove semicolon separator from string
			
			//read nodeWidth
			results = FileOptions.readProperty("width", "number", treeString);
			let nodeWidth = results[0];
			treeString = results[1];
			
			//read fontSize
			results = FileOptions.readProperty("fontSize", "number", treeString);
			let fontSize = results[0];
			treeString = results[1];
			
			//read isItalicized
			results = FileOptions.readProperty("IsItalicized", "boolean", treeString);
			let isItalicized = results[0];
			treeString = results[1];
			
			//read isBold
			results = FileOptions.readProperty("isBold", "boolean", treeString);
			let isBold = results[0];
			treeString = results[1];
			
			//read isUnderlined
			results = FileOptions.readProperty("isUnderlined", "boolean", treeString);
			let isUnderlined = results[0];
			treeString = results[1];
			
			//read textColor
			results = FileOptions.readProperty("textColor", "string", treeString);
			let textColor = results[0];
			treeString = results[1];
			
			//read nodeColor
			results = FileOptions.readProperty("nodeColor", "string", treeString);
			let nodeColor = results[0];
			treeString = results[1];
			
			//Remove '<node>' from string.
			treeString = treeString.substring(6);
			
			//Create a TreeNode.
			const newNode = new TreeNode();
			//Set its property values
			newNode.setText(nodeText);
			newNode.setWidth(nodeWidth);
			newNode.setFontSize(fontSize);
			if(isItalicized){newNode.italicize()};
			if(isBold){newNode.bold()};
			if(isUnderlined){newNode.underline()};
			newNode.setTextColor(textColor);
			newNode.setNodeColor(nodeColor);
			//add event listeners to elements of the newNode.
			newNode.getBulletPoint().getBulletPtElement().addEventListener('click', InputField.handleClick);
			newNode.getBulletPoint().getBulletPtElement().addEventListener('dblclick', InputField.handleClick);
			newNode.getGraphNode().getGraphElement().addEventListener('click', InputField.handleClick);
			newNode.getGraphNode().getGraphElement().addEventListener('dblclick', InputField.handleClick);
			newNode.getBulletPoint().getBulletPtText().addEventListener('input', InputField.textChange);
			newNode.getBulletPoint().getBulletPtText().addEventListener('keydown', InputField.handleKeyDown);
			
			//Append the newNode to newTree according to its treeLayer.
			if(currentLayer === 0){
				//if currentLayer is 0, the newNode is the firstNode of the tree.
				//Append it to rootNode.
				newTree.getRootNode().appendChildNode(newNode);
				//set it to be currentNode.
				newTree.setCurrentNode(newNode);
				//update currentLayer
				currentLayer = treeLayer;
			}else if(treeLayer > currentLayer){
				if(treeLayer != currentLayer + 1){
					//If the newNode has a larger layer number than last added node, it should
					//be a direct child of the last node. If this is not true, the file is invalid.
					//Throw an error.
					throw('invalid file');
				}
				//If the newNode is a direct child of last added node, append it.
				newTree.getCurrentNode().appendChildNode(newNode);
				//set newNode as newCurrent node.
				newTree.setCurrentNode(newNode);
				//update currentLayer.
				currentLayer = treeLayer;
			}else if(treeLayer === currentLayer){
				//If the newNode is at the same layer as the last added node,
				//append it to the parent of last added node.
				newTree.getCurrentNode().getParentNode().appendChildNode(newNode);
				newTree.setCurrentNode(newNode);
				//set newNode as newCurrent node.
				newTree.setCurrentNode(newNode);
			}else if(treeLayer < currentLayer){
				//If the layer of the newNode is above the last added node.
				for(let j = 0; j < currentLayer - treeLayer + 1; j++){
					//Traverse up the tree until currentNode is one layer above the layer of newNode
					newTree.setCurrentNode(newTree.getCurrentNode().getParent());
				}
				//Append newNode to currentNode
				newTree.getCurrentNode().appendChildNode(newNode);
				//set newNode as newCurrent node.
				newTree.setCurrentNode(newNode);
				//update currentLayer.
				currentLayer = treeLayer;
			}
		}
		//Once the entire string is iterated through, return the newTree.
		console.log(newTree);
		return(newTree);
	}
	
	static readProperty(propertyName, propertyType, treeString){
		//This method reads a property in treeString specified by propertyName.
		//PropertyType indicates the data type of property.
		
		//This method return two values in an array. The first is the property value
		//That is read, and the second is the treeString after information about the queried property
		//is removed.
		
		let propertyValue;
		//Remove propertyName and colon from string
		treeString = treeString.substring(propertyName.length + 1);
		
		//Find the index of next semicolon seperator
		let i = Utils.findNextIndexOf(treeString, ';');
		//Read the part of the string up to the next semicolon
		propertyValue = treeString.substring(0, i);
		
		if (propertyType === 'number'){
			//If propertyType is number, convert propertyValue to an integer.
			propertyValue = parseInt(propertyValue)
			//Incorrect file structure could lead to propertyValues being NaN. If so, return an error.
			if(isNaN(propertyValue)){
				throw('invalid file');
			}
		}else if(propertyType === 'boolean'){
			//If propertyType is boolean, convert propertyValue to a boolean.
			if(propertyValue === 'true'){
				propertyValue = true;
			}else if (propertyValue === 'false'){
				propertyValue = false;
			}
		}
		//Remove semicolon from string.
		treeString = treeString.substring(i + 1);
		//return the array of values.
		return ([propertyValue, treeString]);
	}
	
	static exportFile(){
		OutputWindow.enlargeWindow();
		window.print();
		OutputWindow.exitEnlargeWindow();
	}
}

export{FileOptions}