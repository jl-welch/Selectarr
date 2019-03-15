const Data = {
	INPUT: "data-selectarr",
	LIST:	 "data-selectarr-list",
	ITEM:	 "data-selectarr-item",
	VALUE: "data-selectarr-value",
}

const Class = {
	INPUT: 			"-input",
	LIST: 			"-list",
	ITEM: 			"-item",
	ITEMACTIVE: "-active",
}

class Selectarr {
	constructor(element = `[${Data.INPUT}]`, data = {}) {
		this.init					= this.init.bind(this);
		this.search				= this.search.bind(this);
		this.createList		= this.createList.bind(this);
		this.changeActive	= this.changeActive.bind(this);
		this.key					= this.key.bind(this);
		this.keyEnter			= this.keyEnter.bind(this);
		this.keyArrowUp		= this.keyArrowUp.bind(this);
		this.keyArrowDown	= this.keyArrowDown.bind(this);
		this.mouseEnter		= this.mouseEnter.bind(this);

		this._element = document.querySelector(element);
		this._class		= "class" in data ? data.class : "selectarr";
		this._data		= data;
		this._index		= -1;
		this._limit = this.setLimit();

		if (!this._element || !this._data.values) return null;
		
		this.init();
  }

	static applyValue(event, index = null) {
		let list, listItem, parent, input, valueInput;

		list = "key" in event ? 
			event.target.parentElement.querySelector(`[${Data.LIST}]`) :
			event.target.closest(`[${Data.LIST}]`);

		if (list)
			listItem = event.target.closest(`[${Data.ITEM}]`) || list.querySelector(`[${Data.ITEM}="${index}"]`);

		if (listItem) {
			parent			= list.parentElement;
			input			 	= parent.querySelector(`[${Data.INPUT}]`);
			valueInput 	= parent.querySelector(`.${parent.className}${Class.INPUT}`);

			if (!input || !valueInput) return null;
			
			input.value			 = listItem.textContent;
			valueInput.value = listItem.getAttribute(Data.VALUE);
		}

		Selectarr.remove();
	}

	static remove() {
		const list = document.querySelector(`[${Data.LIST}]`);
		if (list) list.parentElement.removeChild(list);
	}

	init() {
		const input  = this._element.cloneNode(),
					parent = this._element.parentElement;

		this._element.removeAttribute("name");
		this._element.addEventListener("keyup", this.search);

		input.className = `${this._class}${Class.INPUT}`;
		input.type = "hidden";
		input.removeAttribute("id");
		input.removeAttribute(Data.INPUT);

		this._parent = document.createElement("div");
		this._parent.className = this._class;

		parent.replaceChild(this._parent, this._element);

		this._parent.appendChild(this._element);
		this._parent.appendChild(input);
	}

	setLimit() {
		return (this._data.limit && +this._data.limit > 0) ? +this._data.limit : 10;
	}

	match(string) {
		return this._data.values.filter(data => 
			data.hasOwnProperty("text") && data.text.match(string))
			.sort((a, b) => a.text.localeCompare(b.text));
	}

	search(event) {
		const eventKey = event.key,
					key			 = eventKey === "ArrowUp"   || 
										 eventKey === "ArrowDown" || 
										 eventKey === "Enter";

		if (key) return this.key(event, event.key);

		Selectarr.remove();

		this._index = -1;
		
		if (!this._element.value.length) return null;

		const test  = new RegExp(this._element.value, 'gi'),
					match = this.match(test);

		if (!match.length) return null;
		
		this.createList(match.slice(0, this._limit));
	}

	createList(data) {
		const list = document.createElement("ul");
		let listItem;

		list.className = this._class + Class.LIST;
		list.setAttribute(Data.LIST, "");

		data.forEach((obj, index) => {
			listItem = document.createElement("li");
			listItem.textContent = obj.text;
			listItem.className   = `${this._class}${Class.ITEM}`;
			listItem.setAttribute(Data.VALUE, obj.value || obj.text);
			listItem.setAttribute(Data.ITEM, index);
			listItem.addEventListener("mouseenter", this.mouseEnter);

			list.appendChild(listItem);
		});

		this._parent.appendChild(list);
	}

	changeActive() {
		const listItems = document.querySelectorAll(`[${Data.ITEM}]`);
		if (!listItems.length) return null;

		const active = document.querySelector(`.${this._class}${Class.ITEMACTIVE}`);
		if (active) active.classList.remove(this._class + Class.ITEMACTIVE);

		listItems[this._index].classList.add(this._class + Class.ITEMACTIVE);
	}

	key(event, key) {
		const listItems = document.querySelectorAll(`[${Data.ITEM}]`);
		if (!listItems.length) return null;

		this[`key${key}`](event, listItems);
	}

	keyEnter(event) {
		if (this._index === -1) return null;

		Selectarr.applyValue(event, this._index);
		this._index = -1;
	}

	keyArrowUp() {
		if (this._index <= 0) return null;

		this._index--;
		this.changeActive();
	} 

	keyArrowDown(event, listItems) {
		if (this._index === listItems.length - 1) return null;

		this._index++;
		this.changeActive();
	}

	mouseEnter(event) {
		const listItem = event.target.closest(`[${Data.ITEM}]`);
		if (!listItem) return null;

		this._index = parseInt(listItem.getAttribute(Data.ITEM), 10);
		this.changeActive();
	}
}

document.addEventListener("click", Selectarr.applyValue);

export default Selectarr;