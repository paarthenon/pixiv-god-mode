export interface Component {
	css:string
	children:Component[]

	render:()=>JQuery
}

export abstract class AbstractComponent implements Component{
	public css = '';
	public children:Component[];
	public abstract render():JQuery;
}

export function renderComponent(component:Component):JQuery {
	GM_addStyle(component.css);
	let renderedComponent = component.render();
	if (component.children) {
		component.children.forEach(child => renderedComponent.append(child.render()));
	}
	return renderedComponent;
}