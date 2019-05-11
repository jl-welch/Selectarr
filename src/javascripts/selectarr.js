const Data = {
  INPUT: "data-selectarr",
  LIST: "data-selectarr-list",
  ITEM: "data-selectarr-item",
  VALUE: "data-selectarr-value",
};

const ClassName = {
  INPUT: "input",
  LIST: "list",
  LISTOPEN: "open",
  ITEM: "item",
  ITEMACTIVE: "item--active",
};

class Selectarr {
  constructor(element = `[${Data.INPUT}]`, options = {}) {
    // Bind value of `this` to Selectarr in event listeners
    // MDN: https://mzl.la/2E0iHi4
    this._keyDownHandler = this._keyDownHandler.bind(this);
    this._applyValueAndCloseList = this._applyValueAndCloseList.bind(this);
    this._mouseEnter = this._mouseEnter.bind(this);

    this._input = document.querySelector(element);
    this._hiddenInput = document.createElement("input");
    this._list = document.createElement("ul");
    this._class = options.class || "selectarr";
    this._limit = Selectarr._setLimit(options.limit);
    this._items = options.items;
    this._index = -1;
    this._length = null;

    this._init();
  }

  // Public

  removeActive() {
    const active = this._list.querySelector(
      `.${this._class}__${ClassName.ITEMACTIVE}`
    );
    if (active)
      active.classList.remove(`${this._class}__${ClassName.ITEMACTIVE}`);
  }

  // Private

  _init() {
    const wrapper = document.createElement("div");
    wrapper.className = this._class;

    this._input.parentElement.replaceChild(wrapper, this._input);

    // Hidden select will be submitted with value
    this._hiddenInput.name = this._input.name;
    this._hiddenInput.type = "hidden";

    // Visible select value will not be submitted
    this._input.className = `${this._class}__${ClassName.INPUT}`;
    this._input.removeAttribute("name");
    this._input.addEventListener("keyup", this._keyDownHandler);

    this._list.className = `${this._class}__${ClassName.LIST}`;
    this._list.setAttribute(Data.LIST, "");
    this._list.addEventListener("click", this._applyValueAndCloseList);

    // Populate wrapper
    wrapper.appendChild(this._input);
    wrapper.appendChild(this._hiddenInput);
    wrapper.appendChild(this._list);
  }

  _applyValueAndCloseList(event) {
    const listItem =
      event.target.closest(`[${Data.ITEM}]`) ||
      this._list.querySelector(`[${Data.ITEM}="${this._index}"]`);

    if (!listItem) {
      return;
    }

    this._input.value = listItem.textContent;
    this._hiddenInput.value = listItem.getAttribute(Data.VALUE);

    this._index = -1;
    Selectarr._removeList();
  }

  _updateActiveItemState() {
    const listItems = this._list.querySelectorAll(`[${Data.ITEM}]`);

    if (listItems.length) {
      this.removeActive();

      listItems[this._index].classList.add(
        `${this._class}__${ClassName.ITEMACTIVE}`
      );
    }
  }

  _mouseEnter(event) {
    const listItem = event.target.closest(`[${Data.ITEM}]`);

    if (listItem) {
      this._index = listItem.getAttribute(Data.ITEM);
      this._updateActiveItemState();
    }
  }

  _populateListItems(items) {
    let listItem;
    this._length = items.length - 1;

    items.forEach((item, index) => {
      let value;
      let label = null;

      if (typeof item === "object") {
        ({ label } = item);
        ({ value } = item);
      } else {
        value = label = item;
      }

      listItem = document.createElement("li");
      listItem.textContent = label;
      listItem.className = `${this._class}__${ClassName.ITEM}`;
      listItem.setAttribute(Data.VALUE, value);
      listItem.setAttribute(Data.ITEM, index);
      listItem.addEventListener("mouseenter", this._mouseEnter);

      this._list.appendChild(listItem);
      this._list.classList.add(ClassName.LISTOPEN);
    });
  }

  _match(regex) {
    return this._items
      .filter(item => {
        const label = Selectarr._getLabelFromItem(item);

        return label.match(regex);
      })
      .sort((a, b) => {
        const labelA = Selectarr._getLabelFromItem(a);
        const labelB = Selectarr._getLabelFromItem(b);

        if (labelA < labelB) {
          return -1;
        }

        if (labelA > labelB) {
          return 1;
        }

        // Values are equal
        return 0;
      });
  }

  _search() {
    this._index = -1;
    Selectarr._removeList();

    if (!this._input.value) {
      return;
    }

    const test = new RegExp(this._input.value, "gi");
    const match = this._match(test).slice(0, this._limit);

    if (match.length) {
      this._populateListItems(match);
    }
  }

  _keyDownHandler(event) {
    const { key } = event;

    if (key === "ArrowUp" || key === "ArrowDown") {
      if (key === "ArrowUp" && this._index > 0) {
        this._index--;
      }
      if (key === "ArrowDown" && this._index < this._length) {
        this._index++;
      }

      this._updateActiveItemState();
      return;
    }

    if (key === "Enter") {
      if (this._index !== -1) {
        this._applyValueAndCloseList(event);
      }

      return;
    }

    if (key === "Escape") {
      this._index = -1;
      Selectarr._removeList();
      return;
    }

    this._search();
  }

  // Static

  static _getLabelFromItem(item) {
    let label;

    if (typeof item === "string") {
      label = item;
    } else if (item.label) {
      ({ label } = item);
    } else {
      label = item.value;
    }

    return label;
  }

  static _removeList() {
    const list = document.querySelector(`[${Data.LIST}].${ClassName.LISTOPEN}`);

    if (!list) return;

    list.classList.remove(ClassName.LISTOPEN);
    list.innerHTML = "";
  }

  static _setLimit(int) {
    return int && +int > 0 ? +int : 5;
  }
}

document.addEventListener("click", event => {
  const target = event.target.closest(`[${Data.INPUT}]`);
  const list = target
    ? target.parentElement.querySelector(`[${Data.LIST}].${ClassName.LISTOPEN}`)
    : null;

  if (!list) {
    Selectarr._removeList();
  }
});

export default Selectarr;

const howdy = new Selectarr(".input", {
  items: [
    {
      label: "Hello",
      value: "howdy",
    },
    {
      label: "hi",
      value: "hiii",
    },
    {
      label: "hell",
      value: "yo",
    },
  ],
  limit: 2,
});

const howdy2 = new Selectarr(".input2", {
  items: [
    {
      label: "Hello",
      value: "howdy",
    },
    {
      label: "hi",
      value: "hiii",
    },
    {
      label: "hell",
      value: "yo",
    },
  ],
  limit: 2,
});
