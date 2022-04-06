//The TreeNode class represents a node in the data tree with a parent and an array of children.

//Each TreeNode has a GraphNode, a BulletPoint, and multiple GraphLine objects.
import {BulletPoint} from '../dynamicInterface/BulletPoint.js';
import {GraphNode} from '../dynamicInterface/GraphNode.js';
import {GraphLine} from '../dynamicInterface/GraphLine.js';

class TreeNode{
	constructor(isRoot){
		//The Boolean isRoot indicates whether the node creates is the root node of a tree.
		
		//In cases where isRoot is not entered, it is set to false by default
		if(isRoot === undefined){isRoot = false};
		this.isRoot = isRoot;
		
		if(this.isRoot === false){
			//A root node does not have the following fields.
			
			//create BulletPoint and GraphNode object
			this.bulletPoint = new BulletPoint();
			this.graphNode = new GraphNode();
			
			//This an array of GraphLine objects between this node and each of its children.
			this.lineList = [];
			
			//parentNode points to its parent node in the data tree
			this.parentNode = null;
			
			//The autoformat boolean determines whether the position of this node is automatically
			//updated witht he rest of the diagram.
			this.autoformat = true;
		}
		
		//An array of children.
		this.children = [];
	}
	
	appendChildNode(childNode, i){
		//this method adds a TreeNode object to the children array in the index 'i'
		
		//disconnect childNode from previous parent, if it has one.
		if(childNode.getParentNode() != null){
			childNode.getParentNode().removeChildNode(childNode);
		}
		//Set the parent of  childNode
		childNode.setParentNode(this);
		
		//If the second parameter 'i' is not inputted, the node is by default added to the end of the array.
		if (i === undefined){
			this.children.push(childNode);
			if(this.isRoot === false){
				//Regular nodes have graphLines connecting it to its children.
				
				//Create a graphLine connecting this node to childNode
				let newLine = new GraphLine(this, childNode)
				//Insert the line in lineList.
				this.lineList.push(newLine);
			}
		}else{
			//If the parameter 'i' is inputted, the node will be appended at the index i
			this.children.splice(i, 0, childNode)
			if(this.isRoot === false){
				//The index of the line in lineList is the kept same as the index of childNode in children.
				this.lineList.splice(i, 0, new GraphLine(this, childNode));
			}
		}
	}
	
	removeChildNode(input){
		//The input could be an index or a TreeNode. If it is an index, remove the child at that index.
		//If it is a TreeNode, remove the node.
		let i = 0;//i is the index of the childNode to remove.
		let childrenNumber = this.children.length;
		
		if (typeof input === 'number'){
			i = input;//If the input is an index, set i to be input.
		}
		else{
			//If the input is a TreeNode instead of an index, iterate the children array to find
			//The index of the node in children.
			for(i; i<childrenNumber; i++){
				if (this.children[i]===input){
					break;
				}
			}
			if(i === childrenNumber){
				//If the inputted node is not in children, throw an error.
				throw('not in children');
			}
		}
		if(this.isRoot === false){
			//remove the graphLine element at i.
			this.lineList[i].remove();
		}
		for(i; i<childrenNumber-1; i++){
			//Starting with the index i+1, each TreeNode in the children array is moved to its previous index.
			this.children[i] = this.children[i+1];
			if(this.isRoot === false){
				//do the same with lineList.
				this.lineList[i] = this.lineList[i+1];
			}
		}
		//pop the last element in the array, which is now redundant.
		this.children.pop();
		if(this.isRoot === false){
			this.lineList.pop();
		}
	}
	
	transformLines(){
		//iterate through lineList and adjust the position of each line.
		for(let j = 0; j<this.lineList.length; j++){
			this.lineList[j].transformLine();
		}
	}
	
	getIndex(){
		//This method returns the index of this node in its parent's children array.
		let i = 0;
		let siblingNumbers = this.parentNode.getChildren().length;
		for(i; i<siblingNumbers; i++){
			//Iterate through the parent's children array until the node is found.
			if (this.parentNode.getChildren()[i] === this){
				break;
			}
		}
		return (i);
	}
	
	//accessor and mutator methods
	getIsRoot(){
		return(this.isRoot);
	}
	
	setIsRoot(newIsRoot){
		this.isRoot = newIsRoot;
	}
	
	setAutoformat(newBoolean){
		this.autoformat = newBoolean;
	}
	
	getAutoformat(){
		return(this.autoformat);
	}
	
	getParentNode(){
		return(this.parentNode);
	}
	
	setParentNode(newParent){
		//set the parentNode to newParent
		this.parentNode = newParent;
		if(newParent.getIsRoot() === false){
			//Set the bulletPoint to be indented one time more than parentNode.
			this.bulletPoint.setMargin(newParent.getBulletPoint().getMargin());
			this.bulletPoint.addMargin();
		}else{
			//If the newParent is the rootNode, set the margin of the bulletPoint to be 20px(the default)
			this.bulletPoint.setMargin(20)
		}
	}
	
	getBulletPoint(){
		return(this.bulletPoint);
	}
	
	setBulletPoint(newBulletPoint){
		this.bulletPoint = newBulletPoint;
	}
	
	getGraphNode(){
		return(this.graphNode);
	}
	
	setGraphNode(newGraphNode){
		this.graphNode = newGraphNode;
	}
	
	getChildren(){
		return(this.children);
	}
	
	setChildren(newList){
		this.children = newList;
	}
	
	getLineList(){
		return(this.lineList);
	}
	
	setLineList(newlist){
		this.lineList = newlist;
	}
	
	//Methods to read and write the properties of BulletPoint and GraphNode can be called from TreeNode.
	highlight(){
		this.bulletPoint.highlight();
		this.graphNode.highlight();
	}
	
	unhighlight(){
		this.bulletPoint.unhighlight();
		this.graphNode.unhighlight();
	}
	
	remove(){
		//Remove the html elements of all bulletPoint, graphNode, and graphLine objects
		//associated with this TreeNode.
		this.bulletPoint.remove();
		this.graphNode.remove();
		for(let i = 0; i < this.lineList.length; i++){
			this.lineList[i].remove();
		}
	}
	
	getText(){
		return(this.bulletPoint.getText())
	}
	
	setText(newText){
		this.bulletPoint.setText(newText);
		this.graphNode.setText(newText);
	}
	
	getFontSize(){
		return(this.bulletPoint.getFontSize())
	}
	
	setFontSize(newFontSize){
		this.bulletPoint.setFontSize(newFontSize);
		this.graphNode.setFontSize(newFontSize);
	}
	
	getTextColor(){
		return(this.bulletPoint.getTextColor())
	}
	
	setTextColor(newColor){
		this.bulletPoint.setTextColor(newColor);
		this.graphNode.setTextColor(newColor);
	}
	
	isBold(){
		return(this.bulletPoint.isBold())
	}
	
	bold(){
		this.bulletPoint.bold();
		this.graphNode.bold();
	}
	
	undoBold(){
		this.bulletPoint.undoBold();
		this.graphNode.undoBold();
	}
	
	isItalicized(){
		return(this.bulletPoint.isItalicized())
	}
	
	italicize(){
		this.bulletPoint.italicize();
		this.graphNode.italicize();
	}
	
	undoItalicize(){
		this.bulletPoint.undoItalicize();
		this.graphNode.undoItalicize();
	}
	
	isUnderlined(){
		return(this.bulletPoint.isUnderlined())
	}
	
	underline(){
		this.bulletPoint.underline();
		this.graphNode.underline();
	}
	
	undoUnderline(){
		this.bulletPoint.undoUnderline();
		this.graphNode.undoUnderline();
	}
	
	setCoord(xCoord, yCoord){
		this.graphNode.setCoord(xCoord, yCoord);
		this.transformLines();
	}
	
	getXCoord(){
		return(this.graphNode.getXCoord());
	}
	
	getYCoord(){
		return(this.graphNode.getYCoord());
	}
	
	setWidth(newWidth){
		this.graphNode.setWidth(newWidth);
	}
	
	getWidth(){
		return(this.graphNode.getWidth())
	}
	
	setHeight(newHeight){
		this.graphNode.setHeight(newHeight);
	}
	
	getHeight(){
		return(this.graphNode.getHeight())
	}
	
	getNodeColor(){
		return(this.graphNode.getPageColor());
	}
	
	setNodeColor(newColor){
		this.graphNode.setPageColor(newColor);
	}
	
	toString(){
		//generates a string representation of data relevant to this treeNode.
		let treeString = "";
		
		//Store property values in the format 'propertyName:propertyValue;'
		treeString = treeString + 'textLength:' + this.getText().length + ';';
		treeString = treeString + 'text:' + this.getText() + ';';
		treeString = treeString + 'width:' + this.getWidth() + ';';
		treeString = treeString + 'fontSize:' + this.getFontSize() + ';';
		treeString = treeString + 'isItalicized:' + this.isItalicized() + ';';
		treeString = treeString + 'isBold:' + this.isBold() + ';';
		treeString = treeString + 'isUnderlined:' + this.isUnderlined() + ';';
		treeString = treeString + 'textColor:' + this.getTextColor() + ';';
		treeString = treeString + 'nodeColor:' + this.getNodeColor() + ';';
		treeString = treeString + 'autoformat:' + this.autoformat + ';';
		if(this.autoformat === false){
			treeString = treeString + 'xCoord:' + this.getXCoord() + ';';
			treeString = treeString + 'yCoord:' + this.getYCoord() + ';';
		}
		treeString = treeString + '<node>';
		
		return(treeString);
	}
}

export{TreeNode}