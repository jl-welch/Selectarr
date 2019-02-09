const Selector = {
  CLASS: "selectarr",
  INPUT: "data-selectarr",
  LIST: "data-selectarr-list",
  ITEM: "data-selectarr-item",
  VALUE: "data-selectarr-value",
  ITEMACTIVE: "selectarr-active"
}

class Selectarr {
  constructor(element = `[${Selector.INPUT}]`, data = [{}]) {
    this.init              = this.init.bind(this);
    this.search            = this.search.bind(this);
    this.createList        = this.createList.bind(this);
    this.changeActive      = this.changeActive.bind(this);
    this.key               = this.key.bind(this);
    this.keyEnter          = this.keyEnter.bind(this);
    this.keyArrowUp        = this.keyArrowUp.bind(this);
    this.keyArrowDown      = this.keyArrowDown.bind(this);
    this.mouseEnter        = this.mouseEnter.bind(this);

    this._element = document.querySelector(element);
    this._data    = data;
    this._index   = -1;

    if (this._element) {
      this.init();
    }
  }

  static applyValue(event, index = null) {
    let list, listItem, input, valueInput;

    list = "key" in event ? 
      event.target.parentElement.querySelector(`[${Selector.LIST}]`) :
      event.target.closest(`[${Selector.LIST}]`);

    if (list) listItem = event.target.closest(`[${Selector.ITEM}]`) ||
                         list.querySelector(`[${Selector.ITEM}="${index}"]`);
    if (listItem) {
      let parent = list.parentElement;

      input      = parent.querySelector(`[${Selector.INPUT}]`);
      valueInput = parent.querySelector(`.${Selector.CLASS}`);

      if (input && valueInput) {
        input.value      = listItem.textContent;
        valueInput.value = listItem.getAttribute(Selector.VALUE);
      }
    }

    Selectarr.remove();
  }

  static remove() {
    const list = document.querySelector(`[${Selector.LIST}]`);
    if (list) list.parentElement.removeChild(list);
  }

  init() {
    const clone      = this._element.cloneNode(),
          valueInput = clone.cloneNode(),
          wrapper    = this._element.parentElement;

    clone.removeAttribute("name");
    clone.addEventListener("keyup", this.search);

    valueInput.className = Selector.CLASS;
    valueInput.type = "hidden";
    valueInput.removeAttribute(Selector.INPUT);
    
    this._parent = document.createElement("div");
    this._parent.style.display = "inline-block";
    this._parent.style.position = "relative";
    
    this._parent.appendChild(clone);
    this._parent.appendChild(valueInput);

    wrapper.replaceChild(this._parent, this._element);

    this._element = clone;
  }

  search(event) {
    const eventKey  = event.key,
          usefulKey = eventKey === "ArrowUp"   || 
                      eventKey === "ArrowDown" || 
                      eventKey === "Enter";

    if (usefulKey) {
      this.key(event, event.key);
      return;
    }

    Selectarr.remove();
    this._index = -1;

    if (!this._element.value.length) return null;

    const test  = new RegExp(this._element.value, 'gi'),
          match = this._data.filter(name => name.text.match(test));

    if (match.length) {
      this.createList(match);
    }
  }

  createList(data) {
    const list = document.createElement("ul");
    let listItem;

    list.setAttribute(Selector.LIST, "");

    data.forEach((obj, index) => {
      listItem = document.createElement("li");
      listItem.setAttribute(Selector.VALUE, obj.value);
      listItem.setAttribute(Selector.ITEM, index);
      listItem.textContent = obj.text;
      listItem.addEventListener("mouseenter", this.hover);

      list.appendChild(listItem);
    });

    this._parent.appendChild(list);
  }

  changeActive() {
    const listItems = document.querySelectorAll(`[${Selector.ITEM}]`);
    if (!listItems.length) return null;

    const active = document.querySelector(`.${Selector.ITEMACTIVE}`);
    if (active) active.className = "";

    listItems[this._index].className = Selector.ITEMACTIVE; 
  }

  key(event, key) {
    const listItems = document.querySelectorAll(`[${Selector.ITEM}]`);
    if (!listItems.length) return null;

    this[`key${key}`](event, listItems);
  }

  keyEnter(event) {
    if (this._index === -1) return null;
    Selectarr.applyValue(event, this._index);
    this._index = -1;
  }

  keyArrowUp() {
    if (this._index === 0 || this._index === -1) return null;
    this._index--;

    this.changeActive();
  } 

  keyArrowDown(event, listItems) {
    if (this._index === listItems.length - 1) return null;
    this._index++;

    this.changeActive();
  }

  mouseEnter(event) {
    const listItem = event.target.closest(`[${Selector.ITEM}]`);
    if (!listItem) return null;

    this._index = parseInt(listItem.getAttribute(Selector.ITEM), 10);

    this.changeActive();
  }
}

document.addEventListener("click", Selectarr.applyValue);

export default Selectarr;