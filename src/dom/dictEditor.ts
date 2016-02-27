import {Dictionary} from '../utils/dict'
import {Component, AbstractComponent, renderComponent} from './component'

export class AddNewInput extends AbstractComponent {
	protected keyInput = $('<input placeholder="japanese">');
	protected valueInput = $('<input placeholder="english">');

	public get japanese() {
		return this.keyInput.val();
	}
	public set japanese(value:string) {
		this.keyInput.val(value);
	}

	public get english() {
		return this.valueInput.val();
	}
	public set english(value:string) {
		this.valueInput.val(value);
	}

	constructor (
		protected dict: Dictionary, 
		protected onAdd?:(key:string)=>any
	) { 
		super(); 
	}
	public render():JQuery {
		let button = $('<button>Add</button>').click((event) => {
			this.dict.set(this.japanese, this.english);
			if (this.onAdd) {
				this.onAdd(this.japanese);
			}

			this.japanese = '';
			this.english = '';
		});
		return $('<div class="pa-assistant-add-dictionary-item-container"></div>')
			.append(this.keyInput)
			.append(this.valueInput)
			.append(button)
	}
}

class DictionaryEntryEditor extends AbstractComponent {
	public static events = {
		itemUpdated: 'ITEM_UPDATED',
		itemDeleted: 'ITEM_DELETED'
	}

	constructor(protected dict: Dictionary, protected key: string) { super(); }
	protected get value():string {
		return this.dict.get(this.key);
	}
	protected update(value: string):void {
		let oldValue = this.value;
		this.dict.set(this.key, value);
		this.shout(DictionaryEntryEditor.events.itemUpdated,
			{
				key: this.key,
				oldValue: oldValue,
				newValue: value
			});
	}
	protected deleteEntry() {
		this.dict.set(this.key, undefined);
		this.self.remove();
		this.shout(DictionaryEntryEditor.events.itemDeleted);
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
	public static events = {
		newTranslation: 'NEW_TRANSLATION',
		updatedTranslation: 'UPDATED_TRANSLATION',
		deletedTranslation: 'DELETED_TRANSLATION'
	};

	protected self = $('<div class="pa-assistant-dictionary-config-editor"></div>');

	protected visible: boolean = false;

	constructor(protected dict: Dictionary) { super(); }

	public get children(): Component[] {
		let addNewInput = new AddNewInput(this.dict, (key) => {
			this.self.append(renderComponent(new DictionaryEntryEditor(this.dict, key)));
			this.shout(DictionaryEditor.events.newTranslation);
		});
		let kvEditors = this.dict.keys.map(key => {
			let editor = new DictionaryEntryEditor(this.dict, key);
			editor.listen(DictionaryEntryEditor.events.itemUpdated, (event) => {
				this.shout(DictionaryEditor.events.updatedTranslation, event);
			});
			editor.listen(DictionaryEntryEditor.events.itemDeleted, () => {
				this.shout(DictionaryEditor.events.deletedTranslation);
			})
			return editor;
		});
		let components: Component[] = [addNewInput];
		return components.concat(kvEditors);
	}

	public render():JQuery {
		return this.self;
	}
}