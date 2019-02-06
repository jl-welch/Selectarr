const Selector = {
  INPUT: "data-selectarr",
  LIST: "data-selectarr-list",
  ITEM: "data-selectarr-item",
  ITEMACTIVE: "selectarr-active"
}

class Selectarr {
  constructor(element = `[${Selector.INPUT}]`, data = []) {
    this.changeActiveListItem = this.changeActiveListItem.bind(this);
    this.search               = this.search.bind(this);
    this.createList           = this.createList.bind(this);
    this.keyEnter             = this.keyEnter.bind(this);
    this.keyArrow             = this.keyArrow.bind(this);
    this.hoverInputItem       = this.hoverInputItem.bind(this);

    this._element = document.querySelector(element);
    this._data    = data;
    this._index   = -1;

    if (this._element) this._element.addEventListener("keyup", this.search);
  }

  static changeInputValue(event) {
    const listItem = event.target.closest(`[${Selector.ITEM}]`);

    if (!listItem) {
      Selectarr.removeList();
      return null;
    }

    const inputEl = listItem.parentElement.parentElement.querySelector(`[${Selector.INPUT}]`);
    if (inputEl) inputEl.value = listItem.textContent;

    Selectarr.removeList();
  }

  static removeList() {
    const list = document.querySelector(`[${Selector.LIST}]`);
    if (list) list.parentElement.removeChild(list);
  }

  createList(data, parent) {
    const list = document.createElement("ul");
    let listItem;

    list.setAttribute(Selector.LIST, "");

    data.forEach((str, index) => {
      listItem = document.createElement("li");
      listItem.setAttribute(Selector.ITEM, index);
      listItem.textContent = str;
      listItem.addEventListener("mouseenter", this.hoverInputItem);

      list.appendChild(listItem);
    });

    parent.appendChild(list);
  }

  changeActiveListItem() {
    const listItems = document.querySelectorAll(`[${Selector.ITEM}]`);
    if (!listItems.length) return null;

    const active = document.querySelector(`.${Selector.ITEMACTIVE}`);
    if (active) active.className = "";

    listItems[this._index].className = Selector.ITEMACTIVE; 
  }

  keyEnter(event) {
    if (this._index === -1) return null;

    const inputEl   = event.target.closest(`[${Selector.INPUT}]`);
    const listItems = document.querySelectorAll(`[${Selector.ITEM}]`);
    if (!inputEl || !listItems.length) return null;

    inputEl.value = listItems[this._index].textContent;
    Selectarr.removeList();
  }

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

    this.changeActiveListItem();
  }

  hoverInputItem(event) {
    const listItem = event.target.closest(`[${Selector.ITEM}]`);
    if (!listItem) return null;

    this._index = parseInt(listItem.getAttribute(Selector.ITEM), 10);

    this.changeActiveListItem();
  }

  search(event) {
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

document.addEventListener("click", Selectarr.changeInputValue);

export default Selectarr;