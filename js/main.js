/*This module is the entry-point to all codes related to the project.
This module imports functions and classes from other modules, initializes the tree and webpage,
and creates listeners for events related to elements on the page.*/

//imported classes
import{TreeNode} from './TreeNode.js';
import{Tree} from './Tree.js';
//imported functions
import{loadFile, saveFile, printGraph} from './functionsFileIO.js';
import{formatGraph, enlargeGraph} from './functionsGraph.js';
import{italicizeText, boldText, underlineText, changeFontSize, changeNodeWidth} from './functionsTextOptions.js';

//Constant values;
const graphXMargin = 50;
const graphYMargin = 25;

const body = document.querySelector('body');
//Bullet point and graph elements
const bulletPtContainer = document.querySelector('#bulletPtContainer');
const canvasContainer = document.querySelector('#canvasContainer');
const canvas = document.querySelector('#canvas');
//Create tree.
let bulletPtTree = new Tree(new TreeNode(bulletPtContainer.firstElementChild));

/*function for changing the tree. This function is necessary because the fileIO module needs
to change the bulletPtTree.*/
function setTree (newTree){
	bulletPtTree = newTree;
}

//format graph accrding to the intial tree.
formatGraph(bulletPtTree.getRootNode().getChildren(), 0, 0, graphXMargin, graphYMargin);

//Buttons in options panel.
const loadButton = document.querySelector('#loadFiles');
loadButton.addEventListener('click', loadFile);
const saveButton = document.querySelector('#saveFiles');
saveButton.addEventListener('click', saveFile);
const printButton = document.querySelector('#printGraph');
printButton.addEventListener('click', printGraph);
const enlargeButton = document.querySelector('#enlargeGraph');
enlargeButton.addEventListener('click', enlargeGraph);

const italicsButton = document.querySelector('#italicsButton');
italicsButton.addEventListener('click', italicizeText);
const boldButton = document.querySelector('#boldButton');
boldButton.addEventListener('click', boldText);
const underlineButton = document.querySelector('#underlineButton');
underlineButton.addEventListener('click', underlineText);

const fontSizeInput = document.querySelector('#fontSizeInput').lastElementChild;
fontSizeInput.addEventListener('change', changeFontSize);
const nodeWidthInput = document.querySelector('#nodeWidthInput').lastElementChild;
nodeWidthInput.addEventListener('change', changeNodeWidth);

export{graphXMargin, graphYMargin, bulletPtContainer, canvas,
body, canvasContainer, bulletPtTree, setTree, fontSizeInput, nodeWidthInput};