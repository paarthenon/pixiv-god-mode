import Config from '../utils/config'
import {Component, AbstractComponent, renderComponent} from './component'

import * as Deps from '../deps'

class ConfigEntryEditor extends AbstractComponent {
	constructor(protected key: string) { super(); }
	protected get value() {
		return JSON.stringify(Config.get(this.key));
	}
	protected update(value: string):void {
		Config.set(this.key, JSON.parse(value));
	}
	protected deleteEntry() {
		Config.set(this.key, undefined);
		this.self.remove();
	}
	private self = Deps.jQ('<div class="dictionary-config-container">');
	public render():JQuery {
		let keyLabel = Deps.jQ(`<label>${this.key}</label>`);
		let valueInput = Deps.jQ(`<input data-dict-key="${this.key}"/>`).val(this.value);
		let updateButton = Deps.jQ('<button>Update</button>').click(event => this.update(valueInput.val()));
		let deleteButton = Deps.jQ('<button>Delete</button>').click(event => this.deleteEntry());
		return this.self
			.append(keyLabel)
			.append(valueInput)
			.append(updateButton)
			.append(deleteButton)
	}
}
export class ConfigEditor extends AbstractComponent {
	protected self = Deps.jQ('<div class="pa-assistant-raw-config-editor"></div>');

	protected visible: boolean = false;

	constructor() { super(); }

	public get children():Component[] {
		let kvEditors = Config.Keys.map(key => new ConfigEntryEditor(key));
		return kvEditors;
	}

	public render():JQuery {
		return this.self;
	}
}