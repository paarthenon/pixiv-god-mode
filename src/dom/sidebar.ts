import {Component, AbstractComponent} from './component'
import {Action} from '../actionModel'

export class SidebarButton extends AbstractComponent {
	public css = `
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

	constructor(protected action: Action) {
		super();
	}
	public render() {
		return $(`<li id="pa-button-${this.action.id}" class="pa-sidebar-entry"></li>`)
			.css('background-color', this.action.color || '#000')
			.on('click', this.action.execute)
			// .append(createImage(imageStrings.arrow))
			.append($(`<a class="pa-tooltip"><span class="pa-icon pa-icon-${this.action.icon || 'images'}"></span><span class="pa-tooltip-body">${this.action.label}</span></span></a>'`))
	}
}