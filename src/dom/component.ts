export interface Component {
	children:Component[]

	render:()=>JQuery
}

export abstract class AbstractComponent implements Component{
	public children:Component[];
	public abstract render():JQuery;
}

export function renderComponent(component:Component):JQuery {
	let renderedComponent = component.render();
	if (component.children) {
		component.children.forEach(child => renderedComponent.append(renderComponent(child)));
	}
	return renderedComponent;
}