const Data = {
  INPUT: "data-selectarr",
  LIST:  "data-selectarr-list",
  ITEM:  "data-selectarr-item",
  VALUE: "data-selectarr-value",
}

const ClassName = {
  INPUT:      "input",
  LIST:       "list",
  LISTOPEN:   "open",
  ITEM:       "item",
  ITEMACTIVE: "active",
}

class Selectarr {
  constructor(element = `[${Data.INPUT}]`, options = {}) {
    if (typeof element !== "string") throw new Error("Type of element selector must be a string.");
    if (typeof options !== "object") throw new Error("Options must be an object.");
    
    this._search     = this._search.bind(this);
    this._applyValue = this._applyValue.bind(this);
    this._mouseEnter = this._mouseEnter.bind(this);

    this._element = document.querySelector(element);

    if (!this._element) throw new Error(`Cannot find element: ${element}`);

    this._items = options.items;

    if (!this._items) throw new Error(`Items does not exist: ${this._items}. Please pass an array of items to the options object.`);

    this._list    = document.createElement("ul");
    this._index   = -1;
    this._limit   = this.setLimit();
    this._class   = options.class || "selectarr";
    this._hidden  = null;
    this._wrapper = null;
    this._length  = null;

    this.init();
  }
	
  // Public

  init() {
    // Wrapper for our selectarr elements
    this._wrapper           = document.createElement("div");
    this._wrapper.className = this._class;

    this._element.parentElement.replaceChild(this._wrapper, this._element);

    // Create a hidden select to be submitted with value
    this._hidden           = document.createElement("input"),
    this._hidden.className = `${this._class}-${ClassName.INPUT}`;
    this._hidden.name      = this._element.name;
    this._hidden.type      = "hidden";

    // Don't submit visible selectarr input
    this._element.removeAttribute("name");
    this._element.addEventListener("keyup", this._search);
    
    this._list.className = `${this._class}-${ClassName.LIST}`;
    this._list.setAttribute(Data.LIST, "");
    this._list.addEventListener("click", this._applyValue);

    // Populate wrapper
    this._wrapper.appendChild(this._element);
    this._wrapper.appendChild(this._hidden);
    this._wrapper.appendChild(this._list);
  }

  addActive() {
    // Remove active before applying new one
    this.removeActive();

    const listItems = this._list.querySelectorAll(`[${Data.ITEM}]`);
    if (!listItems.length || this._index < 0 || this._index > listItems.length) 
      return null;

    listItems[this._index].classList.add(`${this._class}-${ClassName.ITEMACTIVE}`);
  }

  removeActive() {
    const active = this._list.querySelector(`.${this._class}-${ClassName.ITEMACTIVE}`);
    if (active) active.classList.remove(`${this._class}-${ClassName.ITEMACTIVE}`);
  }

  setLimit(int) {
    return (int && +int > 0) ? +int : 10;
  }

	// Private

  _applyValue(event) {
    let listItem = event.target.closest(`[${Data.ITEM}]`) || 
                   this._list.querySelector(`[${Data.ITEM}="${this._index}"]`);

    if (!listItem) return null;

    this._element.value = listItem.textContent;
    this._hidden.value  = listItem.getAttribute(Data.VALUE);

    Selectarr._removeList();
  }

  _populateList(array) {
    let listItem;
    this._length = array.length - 1;

    array.forEach((obj, index) => {
      let value, label = null;

      if (typeof obj === "object") {
        label = obj.label || obj.value;
        value = obj.value || obj.label;
      } else {
        value = label = obj;
      }

      listItem = document.createElement("li");
      listItem.textContent = label;
      listItem.className   = `${this._class}-${ClassName.ITEM}`;
      listItem.setAttribute(Data.VALUE, value);
      listItem.setAttribute(Data.ITEM, index);
      listItem.addEventListener("mouseenter", this._mouseEnter);

      this._list.appendChild(listItem);

      this._list.classList.add(ClassName.LISTOPEN);
    });
  }

  _match(string) {
    // Return array of strings that match our input value
    return this._items.filter(item => {
      const label = typeof item === "string" ? item : item.label ? item.label : item.value;

      return label.match(string);
    }).sort((a, b) => { 
      const labelA = typeof a === "string" ? a : a.label ? a.label : a.value;
      const labelB = typeof b === "string" ? b : b.label ? b.label : b.value;

      labelA.localeCompare(labelB);
    });
  }

  _search(event) {
    const eventKey = event.key,
          key      = eventKey === "ArrowUp" || 
          eventKey === "ArrowDown" || 
          eventKey === "Enter";

    if (key) return this._key(event, event.key);

    Selectarr._removeList();

    this._index = -1;

    if (!this._element.value.length) return null;

    const test  = new RegExp(this._element.value, 'gi');
    const match = this._match(test).slice(0, this._limit);

    if (match.length) this._populateList(match);
  }

  _key(event) {
    this[`_key${event.key}`](event);

    if (event.key !== "Enter") this.addActive();
  }

  _keyArrowUp() {
    if (this._index > 0) this._index--;
  } 

  _keyArrowDown() {
    if (this._index < this._length) this._index++;
  }

  _keyEnter(event) {
    if (this._index === -1) return null;

    this._applyValue(event, this._index);
    this._index = -1;
  }

  _mouseEnter(event) {
    const listItem = event.target.closest(`[${Data.ITEM}]`);
    if (listItem) this._index = parseInt(listItem.getAttribute(Data.ITEM), 10);
    this.addActive();
  }

	// Static

  static _checkSibling(target) {
    if (!target) return null;

    const wrapper	= target.parentElement;
    const sibling = wrapper.querySelector(`[${Data.LIST}].${ClassName.LISTOPEN}`);

    return sibling;
  }

  static _removeList(event = null) {
    if (event) {
      const target    = event.target.closest(`[${Data.INPUT}]`);
      const isSibling = Selectarr._checkSibling(target);

      if (isSibling) return null;
    }

    const list = document.querySelector(`[${Data.LIST}].${ClassName.LISTOPEN}`);

    if (!list) return;

    list.classList.remove(ClassName.LISTOPEN);
    list.innerHTML = "";
  }
}

document.addEventListener("click", Selectarr._removeList);

export default Selectarr;

new Selectarr(".input", {
  class: "selectarr",
  limit: 7,
  items: [
    "hello!",
    {
      label: "howdy",
      value: "hola"
    }
  ]
})