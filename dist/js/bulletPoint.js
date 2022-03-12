//classes
class treeNode{
	constructor(bulletPtSection){
		if (bulletPtSection != undefined){
			this.bulletPtSection = bulletPtSection;
			this.bulletPtText = this.bulletPtSection.lastElementChild;
			this.children = [];
			this.graphNode = new graphNode(this);
		
			this.bulletPtSection.addEventListener('click', selectBulletPt);
			this.bulletPtText.addEventListener('keydown', handleKeyPress);
			this.bulletPtText.addEventListener('keyup', textChange);
			this.margin = window.getComputedStyle(bulletPtSection).marginLeft;
			this.graphLines = [];
		}
		else{
			this.margin = '0px';
			this.children = [];
		}
		
	}
	
	setParent(parentNode){
		this.parentNode = parentNode;
		if (parentNode.margin != undefined){
			this.margin = parentNode.getMargin();
			this.addMargin();
		}
	}
	
	getParent (){
		return(this.parentNode);
	}
	
	getBulletPtSection(){
		return(this.bulletPtSection);
	}
	
	getBulletPtText(){
		return(this.bulletPtText);
	}
	
	appendChildNode(childNode, i){
		//this method adds a node to the children array of this node
		childNode.setParent(this);
		//If the second parameter 'i' is not inputted, the node is added to the end of the array.
		if (i === undefined){
			this.children.push(childNode);
			if(this.graphLines != undefined){
				this.graphLines.push(new graphLine(this, childNode));
			}
		}else{
			//If the parameter 'i' is inputted, the node will be appended at the index i
			this.children.splice(i, 0, childNode)
			if(this.graphLines != undefined){
				this.graphLines.splice(i, 0, new graphLine(this, childNode));
			}
		}
	}
	
	removeChildNode(input){
		let i = 0;
		let childrenNumber = this.children.length;
		if (typeof input === 'number'){
			i = input;
		}
		else{
			for(i; i<childrenNumber; i++){
				if (this.children[i]===input){
					break;
				}
			}
		}
		if(this.graphLines != undefined){
			this.graphLines[i].removeLine();
		}
		for(i; i<childrenNumber-1; i++){
			this.children[i] = this.children[i+1];
			if(this.graphLines != undefined){
				this.graphLines[i] = this.graphLines[i+1];
			}
		}
		this.children.pop();
		if(this.graphLines != undefined){
			this.graphLines.pop();
		}
	}
	
	getChildren(){
		return(this.children);
	}
	
	getSiblingIndex(){
		//Find the index of this node in its parent's children array
		let i = 0;
		let siblingNumbers = this.parentNode.getChildren().length;
		for(i; i<siblingNumbers; i++){
			if (this.parentNode.getChildren()[i] === this){
				break;
			}
		}
		return (i);
	}
	
	getMargin(){
		return(this.margin);
	}
	
	setMargin(margin){
		this.margin = margin;
		this.bulletPtSection.style.marginLeft = margin;
	}
	
	addMargin(){
		//adds 20 pixels to the left margin of the bulletPtSection html element
		this.margin = (parseInt(this.margin.substring(0,this.margin.length - 2))+ 20).toString() + 'px';
		this.bulletPtSection.style.marginLeft = this.margin;
	}
	
	getGraphNode(){
		return(this.graphNode);
	}
	
	getGraphLines(){
		return(this.graphLines);
	}
	
	getText(){
		return(this.bulletPtText.textContent);
	}
	
	setText(newText){
		this.BulletPtText.textContent = newText;
	}
}

class tree{
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

class graphNode{
	constructor(treeNode){
		this.graphElement = document.createElement('div');
		this.graphElement.classList.add('graphNode');
		canvas.appendChild(this.graphElement);
		this.graphText = document.createElement('div');
		this.graphText.classList.add('graphText');
		this.graphElement.appendChild(this.graphText);
		this.xCoord = 0;
		this.yCoord = 0;
		
		let graphElementStyles = window.getComputedStyle(this.graphElement);
		
		this.graphWidth = graphElementStyles.width;
		this.graphWidth = parseInt(this.graphWidth.substring(0, this.graphWidth.length - 2));
		this.graphHeight = graphElementStyles.height;
		this.graphHeight = parseInt(this.graphHeight.substring(0, this.graphHeight.length - 2));
		this.padding = graphElementStyles.padding;
		this.padding = parseInt(this.padding.substring(0, this.padding.length - 2));
		this.lineHeight = window.getComputedStyle(this.graphText).lineHeight;
		this.lineHeight = parseInt(this.lineHeight.substring(0, this.lineHeight.length - 2));
	}
	
	getGraphElement(){
		return(this.graphElement);
	}
	
	setGraphCoord(xCoord, yCoord){
		this.xCoord = xCoord;
		this.yCoord = yCoord;
		this.graphElement.style.left = xCoord.toString() + 'px';
		this.graphElement.style.top = yCoord.toString() + 'px';
	}
	
	getXCoord(){
		return(this.xCoord);
	}
	
	getYCoord(){
		return(this.yCoord);
	}
	
	getGraphWidth(){
		return(this.graphWidth);
	}
	
	setGraphWidth(graphWidth){
		this.graphWidth = graphWidth;
		this.graphElement.style.width = graphWidth.toString() + 'px';
	}
	
	getGraphHeight(){
		return(this.graphHeight);
	}
	
	setGraphHeight(graphHeight){
		this.graphHeight = graphHeight;
		this.graphElement.style.height = graphHeight.toString() + 'px';
	}
	
	getText(){
		return(this.graphText.textContent);
	}
	
	setText(newText){
		this.graphText.textContent = newText;
		let newHeight = window.getComputedStyle(this.graphText).height;
		newHeight = parseInt(newHeight.substring(0, newHeight.length - 2));
		newHeight += 2 * this.padding;
		if (newHeight != this.graphHeight){
			if(newHeight === 2 * this.padding){
				newHeight += this.lineHeight;
			}
			this.setGraphHeight(newHeight);
			formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);
		}
	}
}

class graphLine{
	constructor(parentNode, childNode){
		this.parentNode = parentNode;
		this.childNode = childNode;
		this.lineElement = document.createElement('div');
		this.lineElement.classList.add('graphLine');
		this.lineElement.style.transformOrigin = '0px 0px';
		this.lineElement.style.top = '0px';
		this.lineElement.style.left = '0px';
		canvas.appendChild(this.lineElement);
	}
	
	transformLine(){
		let startX = this.parentNode.getGraphNode().getXCoord() +
			this.parentNode.getGraphNode().getGraphWidth();
		let startY = this.parentNode.getGraphNode().getYCoord() +
			this.parentNode.getGraphNode().getGraphHeight()/2;
		let endX = this.childNode.getGraphNode().getXCoord();
		let endY = this.childNode.getGraphNode().getYCoord() +
			this.childNode.getGraphNode().getGraphHeight()/2;
		let lineLength = Math.hypot(endY - startY, endX - startX);
		let lineAngle = (180/Math.PI) * Math.atan((endY - startY)/(endX - startX));
		if(startX > endX){
			lineAngle += 180;
		}
		
		this.lineElement.style.width = lineLength.toString() + 'px';
		this.lineElement.style.transform = 'translate(' + startX.toString() +'px,' +
			startY.toString() +'px) rotate(' + lineAngle.toString() + 'deg)';
	}
	
	removeLine(){
		this.lineElement.remove();
	}
}

//Elements
const bulletPtContainer = document.querySelector('#bulletPtContainer');
const canvasContainer = document.querySelector('#canvasContainer');
const canvas = document.querySelector('#canvas');
const bulletPtTree = new tree(new treeNode(bulletPtContainer.firstElementChild));
const graphXMargin = 50;
const graphYMargin = 25;
console.log('hello');
formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);

//Functions
function selectBulletPt(e){
	let target = e.target;
	while(! target.classList.contains('bulletPtSection')){
		target = target.parentNode;
	}
	bulletPtTree.setCurrentNode(bulletPtTree.searchNode(target));
	console.log(bulletPtTree);
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

function formatGraph (nodeList,startX, startY, graphXMargin, graphYMargin){
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