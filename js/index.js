//This script is ran from index.html

import {Main} from './Main.js';
import {InputField} from './InputField.js';
import {OutputWindow} from './OutputWindow.js';
import {StyleOptions} from './StyleOptions.js';
import {FileOptions} from './FileOptions.js';

//The init function intializes the program by calling the constructor of controller classes.
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
