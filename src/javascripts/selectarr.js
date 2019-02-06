const Selector = {
	INPUT: "data-selectarr",
	LIST: "data-selectarr-list",
	ITEM: "data-selectarr-item",
	ITEMACTIVE: "selectarr-active"
}

/** 
 * Class representing a searchable select
 */
class Selectarr {
	/**
	 * 
	 * @param {string} element - Selector for element(s)
	 * @param {string[]} data - Dropdown of options
	 */
	constructor(element = null, data = null) {
		this.keyup				= this.keyup.bind(this);
		this.createList 	= this.createList.bind(this);
		this.keyEnter			= this.keyEnter.bind(this);
		this.keyArrow			= this.keyArrow.bind(this);
		this.mouseEnter		= this.mouseEnter.bind(this);

		this._element = document.querySelector(element);
		this._data 		= data;
		this._index 	= -1;

		if (this._element) this._element.addEventListener("keyup", this.keyup);
	}

	/**
	 * Change the value of an input
	 * 
	 * @param {object} event - Event object passed from event listener
	 */
	static applyValue(event) {
		const listItem = event.target.closest(`[${Selector.ITEM}]`);

		if (!listItem) {
			Selectarr.removeList();
			return null
		};

		const inputEl = listItem.parentElement.parentElement.querySelector(`[${Selector.INPUT}]`);
		if (inputEl) inputEl.value = listItem.textContent;

		Selectarr.removeList();
	}

	/**
	 * Change current active class on list item
	 * 
	 * @param {number} index - Index of list item
	 */
	static changeActive(index) {
		const listItems = document.querySelectorAll(`[${Selector.ITEM}]`);
		if (!listItems.length) return null;

		const active = document.querySelector(`.${Selector.ITEMACTIVE}`);
		if (active) active.className = "";

		listItems[index].className = Selector.ITEMACTIVE; 
	}

	/**
	 * Remove list HTML and reset value of index
	 */
	static removeList() {
		const list = document.querySelector(`[${Selector.LIST}]`);
		if (list) list.parentElement.removeChild(list);
	}

	/**
	 * Create HTML for list of items
	 * 
	 * @param {string[]} data - Filtered data matching input value
	 * @param {HTMLElement} parent - Parent element to append list
	 */
	createList(data, parent) {
		const list = document.createElement("ul");
		let listItem;

		list.setAttribute(Selector.LIST, "");
		
		data.forEach((str, index) => {
			listItem = document.createElement("li");
			listItem.setAttribute(Selector.ITEM, index);
			listItem.textContent = str;
			listItem.addEventListener("mouseenter", this.mouseEnter);

			list.appendChild(listItem);
		});

		parent.appendChild(list);
	}

	/**
	 * Handle enter keyup event
	 * 
	 * @param {object} event - Event object passed from event listener
	 */
	keyEnter(event) {
		if (this._index === -1) return null;

		const inputEl   = event.target.closest(`[${Selector.INPUT}]`);
		const listItems = document.querySelectorAll(`[${Selector.ITEM}]`);
		if (!inputEl || !listItems.length) return null;

		inputEl.value = listItems[this._index].textContent;
		Selectarr.removeList();
	}

	/**
	 * Handle arrow up and down keyup event
	 * 
	 * @param {object} event - Event object passed from event listener
	 */
	keyArrow(event) {
		const listItems = document.querySelectorAll(`[${Selector.ITEM}]`);
		if (!listItems.length) return null;

		if (event.key === "ArrowUp") {
			if (this._index === 0 || this._index === -1) return;

			this._index--;
		} else {
			if (this._index === listItems.length - 1) return;

			this._index = this._index + 1;
		}

		Selectarr.changeActive(this._index);
	}

	/**
	 * Handle mouse over event on list items
	 * 
	 * @param {object} event - Event object passed from event listener
	 */
	mouseEnter(event) {
		const listItem = event.target.closest(`[${Selector.ITEM}]`);
		if (!listItem) return null;

		this._index = parseInt(listItem.getAttribute(Selector.ITEM), 10);

		Selectarr.changeActive(this._index);
	}

	/**
	 * Handle keyup event on input
	 * 
	 * @param {object} event - Event object passed from event listener 
	 */
	keyup(event) {
		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			this.keyArrow(event);
			return;
		}

		if (event.key === "Enter") {
			this.keyEnter(event);
			return;
		}

		this._index = -1;
		Selectarr.removeList();

		const inputEl = event.target.closest(`[${Selector.INPUT}]`);
		if (!inputEl || !inputEl.value.length) return null;

		const test  = new RegExp(inputEl.value, 'gi'),
					match = this._data.filter(name => name.match(test));

		if (match.length) {
			this.createList(match, inputEl.parentElement);
		}
	}
}

document.addEventListener("click", Selectarr.applyValue);

export default Selectarr;