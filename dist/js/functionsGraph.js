//This module contains functions related to formatting the graph.

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

export{formatGraph}