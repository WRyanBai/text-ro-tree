import{Main} from '../helperClasses/Main.js';
import{StyleOptions} from './StyleOptions.js';

class OutputWindow{
	constructor(){
		//listen for the graphChanged event, which is dispatched when a node is created, deleted,
		//or otherwise changed. Call the autoformatGraph method to reformat the graph.
		window.addEventListener('graphChanged', (e) => {
			//Initiate the recursive algorithm of autoformatGraph by calling it on the children array
			//or the root node. get the marginX and marginY constants from main.
			OutputWindow.autoformatGraph(Main.getTree().getRootNode().getChildren(), 0, 0,
			Main.getMarginX(), Main.getMarginY());
			StyleOptions.updateDragButtons();
		});
	}
	
	static autoformatGraph(nodeList, currentX, currentY, marginX, marginY){
		//This method recursively formats the tree diagram, one layer at a time.
		//The input nodeList provides an array of TreeNodes that are siblings.
		//It positions each node in the list, and outputs the total height of the layer.
		
		//record the initial Y coordinate plus the marginBottom
		const startY = currentY + marginY;
		//Indent currentX by marginX
		currentX += marginX;
		//initialize the childTotalHeight variable
		let childTotalHeight;
		for (let i = 0; i < nodeList.length; i++){ //iterate through each TreeNode in nodeList.
			//In each iteration, increase currentY by marginY.
			currentY += marginY;
			if (nodeList[i].getChildren().length === 0){
				//If the node at index i has no children, simply position it at(currentX,currentY).
				if(nodeList[i].getAutoformat() === true){
					nodeList[i].setCoord(currentX, currentY);
				}else{
					nodeList[i].transformLines();
				}
				// Increment currentY by the height of the node.
				currentY += nodeList[i].getHeight();
			}else{
				//If a node has children, use recursion to format its children first and get
				//the total height of children once formatted.
				childTotalHeight = OutputWindow.autoformatGraph(nodeList[i].getChildren(),
					currentX + nodeList[i].getWidth(), currentY - marginY, marginX, marginY);
				if(childTotalHeight > nodeList[i].getHeight()){
					//If the total height of the node's children exceeds the height of the node,
					//position the node such that its center aligns with the center of its children.
					if(nodeList[i].getAutoformat() === true){
						nodeList[i].setCoord(currentX, currentY + (childTotalHeight - nodeList[i].getHeight())/2);
					}else{
						nodeList[i].transformLines();
					}
					//increment currentY by childTotalHeight
					currentY += childTotalHeight;
				}else{
					//If the height of the node exceeds the total height of its children,
					//format its children such that the middle of their layer aligns with the center of the node.
					OutputWindow.autoformatGraph(nodeList[i].getChildren(), currentX + nodeList[i].getWidth(),
						currentY - marginY + (nodeList[i].getHeight() - childTotalHeight)/2, marginX, marginY);
					if(nodeList[i].getAutoformat() === true){
						nodeList[i].setCoord(currentX, currentY);
					}else{
						nodeList[i].transformLines();
					}
					//increment currentY by the height of the node
					currentY += nodeList[i].getHeight();
				}
			}
		}
		
		//calculate total height of this layer.
		const thisTotalHeight = currentY - startY;
		//return the total height of this layer for the recursion to work.
		return(thisTotalHeight);
	}
	
	static enlargeWindow(){
		const outputWindowElement = document.querySelector('#outputWindow');
		outputWindowElement.style.gridRow='1/-1';
		outputWindowElement.style.gridColumn='1/-1';
	
		const viewPortHeight = window.innerHeight;
		const viewPortWidth = window.innerWidth;
		outputWindowElement.style.overflow = 'hidden';
		outputWindowElement.style.border = 'none';
		
		const wrapper = document.querySelector('#wrapper');
		wrapper.style.height = viewPortHeight;
		wrapper.style.width = viewPortWidth;
		if(Main.getTree().getCurrentNode() != null){
			Main.getTree().setCurrentNode(null);
		}
	}
	
	static exitEnlargeWindow(){
		const wrapper = document.querySelector('#wrapper');
		wrapper.style.height = '100%';
		wrapper.style.width = '100%';
		
		const outputWindowElement = document.querySelector('#outputWindow');
		outputWindowElement.style.gridRow='3/4';
		outputWindowElement.style.gridColumn='4/5';
		outputWindowElement.style.overflow = 'scroll';
		outputWindowElement.style.border = '1px solid black';
	}
}

export{OutputWindow}