//This script is ran from index.html
//The script initializes the program by creating instances of classes responsible
//for handling user interactions.

//Classes that handle user interactions are imported
import {Main} from './Main.js';
import {InputField} from './InputField.js';
import {OutputWindow} from './OutputWindow.js';
import {StyleOptions} from './StyleOptions.js';
import {FileOptions} from './FileOptions.js';

//testing
/* import {BulletPoint} from './BulletPoint.js'
import {GraphNode} from './GraphNode.js'
import {GraphLine} from './GraphLine.js'
import {TreeNode} from './TreeNode.js';
import {Tree} from './Tree.js'; */

//The init function intializes the program by creating instances of the classes
function init(){
	new Main();
	new InputField();
	new OutputWindow();
	new StyleOptions();
	new FileOptions();
	
	window.dispatchEvent(Main.getGraphChangedEvent());
	window.dispatchEvent(Main.getSelectedChangedEvent());
}

//The init function is called.
init();