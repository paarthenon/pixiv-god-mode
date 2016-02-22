import {Dictionary} from '../utils/dict'
import {Component, AbstractComponent, renderComponent} from './component'

class AddNewInput extends AbstractComponent {
	constructor (
		protected dict: Dictionary, 
		protected onAdd?:(key:string)=>any
	) { 
		super(); 
	}
	public render():JQuery {
		let keyInput = $('<input placeholder="japanese">');
		let valueInput = $('<input placeholder="english">');
		let button = $('<button>Add</button>').click((event) => {
			this.dict.set(keyInput.val(), valueInput.val());
			if (this.onAdd) {
				this.onAdd(keyInput.val());
			}
		});
		return $('<div class="pa-assistant-add-dictionary-item-container"></div>')
			.append(keyInput)
			.append(valueInput)
			.append(button)
	}
}

class DictionaryEntryEditor extends AbstractComponent {
	constructor(protected dict: Dictionary, protected key: string) { super(); }
	protected get value():string {
		return this.dict.get(this.key);
	}
	protected update(value: string):void {
		this.dict.set(this.key, value);
	}
	protected deleteEntry() {
		this.dict.set(this.key, undefined);
		this.self.remove();
	}
	private self = $('<div class="dictionary-config-container">');
	public render():JQuery {
		let keyLabel = $(`<label>${this.key}</label>`);
		let valueInput = $(`<input data-dict-key="${this.key}" value="${this.value}" />`);
		let updateButton = $('<button>Update</button>').click(event => this.update(valueInput.val()));
		let deleteButton = $('<button>Delete</button>').click(event => this.deleteEntry());
		return this.self
			.append(keyLabel)
			.append(valueInput)
			.append(updateButton)
			.append(deleteButton)
	}
}
export class DictionaryEditor extends AbstractComponent {
	protected self = $('<div class="pa-assistant-dictionary-config-editor hidden"></div>');

	protected visible: boolean = false;

	constructor(protected dict: Dictionary) { super(); }

	public hide(){
		this.visible = false;
		this.self.addClass('hidden');
	}
	public show(){
		this.visible = true;
		this.self.removeClass('hidden');
	}
	public toggleVisibility(){
		if(this.visible) {
			this.hide();
		} else{
			this.show();
		}
	}

	public get children():Component[] {
		let addNewInput = new AddNewInput(this.dict, (key) => this.self.append(renderComponent(new DictionaryEntryEditor(this.dict, key))));
		let kvEditors = this.dict.keys.map(key => new DictionaryEntryEditor(this.dict, key));
		let components: Component[] = [addNewInput];
		return components.concat(kvEditors);
	}

	public render():JQuery {
		return this.self;
	}
}