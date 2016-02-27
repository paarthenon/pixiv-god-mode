declare var $: JQueryStatic;

import {generateFontTemplate, fontString} from '../dom/fontSetup'
import {Component,renderComponent} from '../dom/component'

let globalCSS = `
	.pa-tabbed-view > ul.tabs > li {
		display: inline;
		color: blue;
		border: 1px solid #aaaaaa;
		border-bottom: none;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		padding:3px;
		margin-right:5px;
	}
	#pixiv-assistant-control-panel {
        display: block;
        position: fixed;
        top: 50%;
        left: 50%;
        box-sizing: border-box;
        transform: translate(-50%, -50%);
        z-index:10;

        width:800px;
        min-height:200px;
        max-height:1000px;
        overflow:scroll;

        border: 1px solid;
		border-color: #aaa #999 #888;
		background-color: #FDFDFD;
	}

	#pa-assistant-mini-translation-modal {
        display: block;
        position: fixed;
        top: 50%;
        left: 50%;
        box-sizing: border-box;
        transform: translate(-50%, -50%);
        z-index:10;

        border: 1px solid;
		border-color: #aaa #999 #888;
		background-color: #FDFDFD;

		border-radius: 10px;
		box-shadow: 0 0 100px #444;
		padding: 20px;
	}
	#pa-assistant-mini-translation-modal input {
		display: block;
	}
	#pa-assistant-mini-translation-modal button {
		display: block;
		width: 100%;
	}

	#pixiv-assistant-sidebar {
		position: fixed;
		left: 10px;
	}
	#pixiv-assistant-sidebar.open {
		top: 50%;
		transform: translateY(-50%);
	}
	#pixiv-assistant-sidebar.closed {
		bottom: 10px;
	}

	li.pa-sidebar-entry {
	    transition: opacity 0.3s;
	    opacity: 0.8;
	    display: block;
	    margin-top: 10px;
	    background-color: #000;
    	border-radius: 60px;
	    cursor: pointer;
	    color: white;
	}
	li.pa-sidebar-entry:hover {
	    opacity: 1;
	}
	.pa-icon {
		display: inline-block;
		height: 20px;
		width: 20px;
		padding:16px;
		font-size:20px;
	}

	li.pa-sidebar-entry a.pa-tooltip span.pa-icon {
		color: white;
	}

	a.pa-tooltip {outline:none; }
	a.pa-tooltip strong {line-height:30px;}
	a.pa-tooltip:hover {text-decoration:none;}
	a.pa-tooltip span.pa-tooltip-body {
	    z-index:10;
	    display:none; 
	    padding:5px 5px; 
	    margin-left:10px;
	    margin-top:10px;
	    line-height:16px;
	    white-space: nowrap;
	}
	a.pa-tooltip:hover span.pa-tooltip-body {
	    display:inline; 
	    position:absolute; 
	    color:#111;
	    border:1px solid #888; 
	    background:#dfdfdf;
	    opacity: 100%;
	}

	a.pa-tooltip span.pa-tooltip-body
	{
	    border-radius:4px;
	    box-shadow: 5px 5px 8px #CCC;
	}
`;
export function initialize() {
	GM_addStyle(globalCSS);
	GM_addStyle(generateFontTemplate(fontString.icomoon));
}

export function render(components:Component[]) {
	components.forEach(component => $('body').append(renderComponent(component)));
}