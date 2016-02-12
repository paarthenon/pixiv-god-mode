declare var $: JQueryStatic;
import {Action} from '../actionModel'

export var fontString = {
	icomoon: 'd09GRgABAAAAAAeQAAsAAAAAB0QAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAABCAAAAGAAAABgDxIGL2NtYXAAAAFoAAAAVAAAAFQXVtKMZ2FzcAAAAbwAAAAIAAAACAAAABBnbHlmAAABxAAAAyAAAAMgMDx6BmhlYWQAAATkAAAANgAAADYKPKxtaGhlYQAABRwAAAAkAAAAJAkiBUtobXR4AAAFQAAAACgAAAAoIAAAAGxvY2EAAAVoAAAAFgAAABYDtgLqbWF4cAAABYAAAAAgAAAAIAAQAFJuYW1lAAAFoAAAAc4AAAHOoSd653Bvc3QAAAdwAAAAIAAAACAAAwAAAAMEAAGQAAUAAAKZAswAAACPApkCzAAAAesAMwEJAAAAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAQAAA6QUDwP/AAEADwABAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAwAAAAMAAAAcAAEAAwAAABwAAwABAAAAHAAEADgAAAAKAAgAAgACAAEAIOkF//3//wAAAAAAIOkA//3//wAB/+MXBAADAAEAAAAAAAAAAAAAAAEAAf//AA8AAQAAAAAAAAAAAAIAADc5AQAAAAABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAABQAA/8AEgAPAABkALAA8AEgATwAAASM1NCYjISIGFREUFjsBFRQWMyEyNjURNCYFESM4ATEROAExITgBMRUhIgYVATgBMSE4ATEROAExITgBMQcUBiMiJjU0NjMyFhMhNRMBMzcEQEAmGvyAGiYmGkAmGgOAGiYm/CZAA4D9ABomA8D8gAOAgDgoKDg4KCg4QP0A4AEAQOADQEAaJiYa/QAaJkAaJiYaAwAaJkD9gAMAQCYa/QADAKAoODgoKDg4/biAAYD+wMAAAAAAAgAAAEAEAANAAA0AHAAAATA+AjMVCQEVIg4CBSERMz4BNz4BNyERIREHAQAdU5Z6AYD+gGCQYDABwP3AfgcRCCFPLP5GA0CAAUA8SDzAAQABAMA3WnO8AYAJEQgfLxD9gAENVgAAAAAEAAAAAAQAA4AAAwAHAA0AEwAACQMRDQElBRcJATcFJRcJATcFBAD+AP4AAgABVv6q/qoC72f+AP4AZwGZAZln/gD+AGcBmQKAAQD/AP8AAaurq6uNM/8AAQAzzAwz/wABADPMAAAAAAMAAP/ABAADgAAfADcAOwAAASM1NC4CIyIOAhURFB4CMzI+Aj0BMzI2NRE0JiUuASc+ATc+ATMyFhceARcOAQcOASMiJgEjNTMDwMA8aYtQUItpPDxpi1BQi2k8wBslJfzVHCIJCSIcLGs5OWssHCIJCSIcLGs5OWsCpICAAoBgITosGRksOiH9gCE6LBkZLDohYCUbAUAbJT4JEgcHEgkPDw8PCRIHBxIJDw8P/pHAAAAAAAQAAABABWADAAADAAcACwAOAAATIRUhFSEVIRUhFSEBNxcAA4D8gAOA/IADgPyAA+DAwAMAwEDAQMABAMDAAAACAAD/wAPAA8AABgAVAAABNSE1ITUXBREhFSURIREjESEFESE1AwD+wAFAwP8A/sD+gALAQP4AAQABAAFAgICAwID/AMDAA0D+wAEAgP3AwAAAAAABAAAAAQAA4E0D7V8PPPUACwQAAAAAANLes/gAAAAA0t6z+AAA/8AFYAPAAAAACAACAAAAAAAAAAEAAAPA/8AAAAWAAAAAAAVgAAEAAAAAAAAAAAAAAAAAAAAKBAAAAAAAAAAAAAAAAgAAAASAAAAEAAAABAAAAAQAAAAFgAAABAAAAAAAAAAACgAUAB4AhAC4AOwBRgFmAZAAAAABAAAACgBQAAUAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAADgCuAAEAAAAAAAEADQAAAAEAAAAAAAIABwCWAAEAAAAAAAMADQBIAAEAAAAAAAQADQCrAAEAAAAAAAUACwAnAAEAAAAAAAYADQBvAAEAAAAAAAoAGgDSAAMAAQQJAAEAGgANAAMAAQQJAAIADgCdAAMAAQQJAAMAGgBVAAMAAQQJAAQAGgC4AAMAAQQJAAUAFgAyAAMAAQQJAAYAGgB8AAMAAQQJAAoANADsY3VzdG9taWNvbW9vbgBjAHUAcwB0AG8AbQBpAGMAbwBtAG8AbwBuVmVyc2lvbiAxLjAAVgBlAHIAcwBpAG8AbgAgADEALgAwY3VzdG9taWNvbW9vbgBjAHUAcwB0AG8AbQBpAGMAbwBtAG8AbwBuY3VzdG9taWNvbW9vbgBjAHUAcwB0AG8AbQBpAGMAbwBtAG8AbwBuUmVndWxhcgBSAGUAZwB1AGwAYQByY3VzdG9taWNvbW9vbgBjAHUAcwB0AG8AbQBpAGMAbwBtAG8AbwBuRm9udCBnZW5lcmF0ZWQgYnkgSWNvTW9vbi4ARgBvAG4AdAAgAGcAZQBuAGUAcgBhAHQAZQBkACAAYgB5ACAASQBjAG8ATQBvAG8AbgAuAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='
}

function generateFontTemplate(b64String:string){
	return `@font-face {
			font-family:"customicomoon";
			src: url(data:application/x-font-woff;charset=utf-8;base64,${b64String}) format('woff');
			font-style:normal;
			font-weight:normal;
		}

		[class^="pa-icon-"], [class*=" pa-icon-"] {
		    /* use !important to prevent issues with browser extensions that change fonts */
		    font-family: 'customicomoon' !important;
		    speak: none;
		    font-style: normal;
		    font-weight: normal;
		    font-variant: normal;
		    text-transform: none;
		    line-height: 1;

		    /* Better Font Rendering =========== */
		    -webkit-font-smoothing: antialiased;
		    -moz-osx-font-smoothing: grayscale;
		}

		.pa-icon-images:before {
		    content: "\\e900";
		}
		.pa-icon-stack:before {
		    content: "\\e902";
		}
		.pa-icon-mug:before {
		    content: "\\e903";
		}
		.pa-icon-menu4:before {
		    content: "\\e904";
		}
		.pa-icon-exit:before {
		    content: "\\e905";
		}
		.pa-icon-share:before {
		    content: "\\e901";
		}
		`;
}

export function initialize() {
	let tooltipCSS = `
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
		}`;

	let sidebarCss = `
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
		    opacity: 0.6;
		    display: block;
		    margin-top: 10px;
		    background-color: #000;
	    	border-radius: 24px;
		    cursor: pointer;
		    color: white;
		}
		li.pa-sidebar-entry:hover {
		    opacity: 1;
		}
		.pa-icon {
			display: inline-block;
			height: 24px;
			width: 24px;
			padding:12px;
			font-size:1.7em;
		}

	`;

	GM_addStyle(sidebarCss);
	GM_addStyle(tooltipCSS);
	GM_addStyle(generateFontTemplate(fontString.icomoon));
}

export function createImage(b64Image:string) {
	return $(`<img src="data:image/png;base64,${b64Image}" />`);
}

export function createButton(action:Action) {
	console.log(action);
	return $(`<li id="pa-button-${action.id}" class="pa-sidebar-entry"></li>`)
		.css('background-color', action.color || '#000')
		.on('click', action.execute)
		// .append(createImage(imageStrings.arrow))
		.append($(`<a class="pa-tooltip"><span class="pa-icon pa-icon-${action.icon || 'images'}"></span><span class="pa-tooltip-body">${action.label}</span></span></a>'`))
}

export function createSidebar() {
	return $('<ul id="pixiv-assistant-sidebar"></ul>');
}