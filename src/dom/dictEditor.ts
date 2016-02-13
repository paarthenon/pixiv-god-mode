import {Dictionary} from '../utils/dict'
import {Component, AbstractComponent} from './component'

class AddNewInput extends AbstractComponent {
	constructor(protected dict: Dictionary) { super(); }
	public render():JQuery {
		let keyInput = $('<input placeholder="japanese">');
		let valueInput = $('<input placeholder="english">');
		let button = $('<button>Add</button>').click((event) => this.dict.set(keyInput.val(), valueInput.val()));
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
	public css = `
		.pa-assistant-dictionary-config-editor {
			position: fixed;
			bottom:10px;
			width: 80%;
			height: 30%;
			left:50%;
			transform: translateX(-50%);
			background-color: rgba(0, 0, 0, 0.2);
		}
		.pa-assistant-dictionary-config-editor.hidden {
			display:none;
		}
	`;

	protected self = $('<div class="pa-assistant-dictionary-config-editor"></div>');

	constructor(protected dict: Dictionary) { super(); }

	public hide(){
		this.self.addClass('hidden');
	}
	public show(){
		this.self.removeClass('hidden');
	}

	public get children():Component[] {
		let addNewInput = new AddNewInput(this.dict);
		let kvEditors = this.dict.keys.map(key => new DictionaryEntryEditor(this.dict, key));
		let components: Component[] = [addNewInput];
		return components.concat(kvEditors);
	}

	public render():JQuery {
		return this.self;
	}
}