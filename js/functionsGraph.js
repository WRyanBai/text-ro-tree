//This module contains functions related to formatting the graph.

import {body, canvasContainer, bulletPtTree} from './main.js';

function formatGraph (nodeList,startX, startY, graphXMargin, graphYMargin){
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

function enlargeGraph(){
	canvasContainer.style.top = '0px';
	canvasContainer.style.left = '0px';
	
	let viewPortHeight = window.innerHeight;
	let viewPortWidth = window.innerWidth;
	canvasContainer.style.height = viewPortHeight;
	canvasContainer.style.width = viewPortWidth;
	canvasContainer.style.overflow = 'hidden';
	canvasContainer.style.border = 'none';
	body.style.height = viewPortHeight;
	body.style.width = viewPortWidth;
	if(bulletPtTree.getCurrentNode() != null){
		bulletPtTree.getCurrentNode().unhighlight();
	}
	
	body.addEventListener('mousedown', exitEnlargeGraph);
}

function exitEnlargeGraph(){
	canvasContainer.style.top = '17%';
	canvasContainer.style.left = '5%';
	canvasContainer.style.height = '78%';
	canvasContainer.style.width = '65%';
	canvasContainer.style.overflow = 'scroll';
	canvasContainer.style.border = '1px solid black';
	body.style.height = '100%';
	body.style.width = '100%';
}

export{formatGraph, enlargeGraph, exitEnlargeGraph}