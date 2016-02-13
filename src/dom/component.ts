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

let stringCache:string[] = [];
export function renderComponent(component:Component):JQuery {
	if(stringCache.indexOf(component.css) < 0){
		GM_addStyle(component.css);
		stringCache.push(component.css);
	}
	let renderedComponent = component.render();
	if (component.children) {
		component.children.forEach(child => renderedComponent.append(renderComponent(child)));
	}
	return renderedComponent;
}