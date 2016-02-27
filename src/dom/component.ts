export interface Component {
	children:Component[]

	render:()=>JQuery
}

export abstract class AbstractComponent implements Component{
	public children:Component[];
	public abstract render():JQuery;

	protected subscribers: { [id: string]: ((param:any) => any)[] } = {};

	public shout (event:string, payload?:any) {
		this.subscribers[event].forEach(f => f(payload));
	}
	public listen (event:string, callback:(param:any) => any) {
		if(this.subscribers[event] == undefined){
			this.subscribers[event] = [];
		}
		this.subscribers[event].push(callback);
	}
}

export function renderComponent(component:Component):JQuery {
	let renderedComponent = component.render();
	if (component.children) {
		component.children.forEach(child => renderedComponent.append(renderComponent(child)));
	}
	return renderedComponent;
}