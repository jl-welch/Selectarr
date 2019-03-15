(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.selectarr = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var Data = {
    INPUT: "data-selectarr",
    LIST: "data-selectarr-list",
    ITEM: "data-selectarr-item",
    VALUE: "data-selectarr-value"
  };
  var Class = {
    INPUT: "-input",
    LIST: "-list",
    ITEM: "-item",
    ITEMACTIVE: "-active"
  };

  var Selectarr =
  /*#__PURE__*/
  function () {
    function Selectarr() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "[".concat(Data.INPUT, "]");
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Selectarr);

      this.init = this.init.bind(this);
      this.search = this.search.bind(this);
      this.createList = this.createList.bind(this);
      this.changeActive = this.changeActive.bind(this);
      this.key = this.key.bind(this);
      this.keyEnter = this.keyEnter.bind(this);
      this.keyArrowUp = this.keyArrowUp.bind(this);
      this.keyArrowDown = this.keyArrowDown.bind(this);
      this.mouseEnter = this.mouseEnter.bind(this);
      this._element = document.querySelector(element);
      this._class = "class" in data ? data.class : "selectarr";
      this._data = data;
      this._index = -1;
      this._limit = this.setLimit();
      if (!this._element || !this._data.values) return null;
      this.init();
    }

    _createClass(Selectarr, [{
      key: "init",
      value: function init() {
        var input = this._element.cloneNode(),
            parent = this._element.parentElement;

        this._element.removeAttribute("name");

        this._element.addEventListener("keyup", this.search);

        input.className = "".concat(this._class).concat(Class.INPUT);
        input.type = "hidden";
        input.removeAttribute("id");
        input.removeAttribute(Data.INPUT);
        this._parent = document.createElement("div");
        this._parent.className = this._class;
        parent.replaceChild(this._parent, this._element);

        this._parent.appendChild(this._element);

        this._parent.appendChild(input);
      }
    }, {
      key: "setLimit",
      value: function setLimit() {
        return this._data.limit && +this._data.limit > 0 ? +this._data.limit : 10;
      }
    }, {
      key: "match",
      value: function match(string) {
        return this._data.values.filter(function (data) {
          return data.hasOwnProperty("text") && data.text.match(string);
        }).sort(function (a, b) {
          return a.text.localeCompare(b.text);
        });
      }
    }, {
      key: "search",
      value: function search(event) {
        var eventKey = event.key,
            key = eventKey === "ArrowUp" || eventKey === "ArrowDown" || eventKey === "Enter";
        if (key) return this.key(event, event.key);
        Selectarr.remove();
        this._index = -1;
        if (!this._element.value.length) return null;
        var test = new RegExp(this._element.value, 'gi'),
            match = this.match(test);
        if (!match.length) return null;
        this.createList(match.slice(0, this._limit));
      }
    }, {
      key: "createList",
      value: function createList(data) {
        var _this = this;

        var list = document.createElement("ul");
        var listItem;
        list.className = this._class + Class.LIST;
        list.setAttribute(Data.LIST, "");
        data.forEach(function (obj, index) {
          listItem = document.createElement("li");
          listItem.textContent = obj.text;
          listItem.className = "".concat(_this._class).concat(Class.ITEM);
          listItem.setAttribute(Data.VALUE, obj.value || obj.text);
          listItem.setAttribute(Data.ITEM, index);
          listItem.addEventListener("mouseenter", _this.mouseEnter);
          list.appendChild(listItem);
        });

        this._parent.appendChild(list);
      }
    }, {
      key: "changeActive",
      value: function changeActive() {
        var listItems = document.querySelectorAll("[".concat(Data.ITEM, "]"));
        if (!listItems.length) return null;
        var active = document.querySelector(".".concat(this._class).concat(Class.ITEMACTIVE));
        if (active) active.classList.remove(this._class + Class.ITEMACTIVE);

        listItems[this._index].classList.add(this._class + Class.ITEMACTIVE);
      }
    }, {
      key: "key",
      value: function key(event, _key) {
        var listItems = document.querySelectorAll("[".concat(Data.ITEM, "]"));
        if (!listItems.length) return null;
        this["key".concat(_key)](event, listItems);
      }
    }, {
      key: "keyEnter",
      value: function keyEnter(event) {
        if (this._index === -1) return null;
        Selectarr.applyValue(event, this._index);
        this._index = -1;
      }
    }, {
      key: "keyArrowUp",
      value: function keyArrowUp() {
        if (this._index <= 0) return null;
        this._index--;
        this.changeActive();
      }
    }, {
      key: "keyArrowDown",
      value: function keyArrowDown(event, listItems) {
        if (this._index === listItems.length - 1) return null;
        this._index++;
        this.changeActive();
      }
    }, {
      key: "mouseEnter",
      value: function mouseEnter(event) {
        var listItem = event.target.closest("[".concat(Data.ITEM, "]"));
        if (!listItem) return null;
        this._index = parseInt(listItem.getAttribute(Data.ITEM), 10);
        this.changeActive();
      }
    }], [{
      key: "applyValue",
      value: function applyValue(event) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var list, listItem, parent, input, valueInput;
        list = "key" in event ? event.target.parentElement.querySelector("[".concat(Data.LIST, "]")) : event.target.closest("[".concat(Data.LIST, "]"));
        if (list) listItem = event.target.closest("[".concat(Data.ITEM, "]")) || list.querySelector("[".concat(Data.ITEM, "=\"").concat(index, "\"]"));

        if (listItem) {
          parent = list.parentElement;
          input = parent.querySelector("[".concat(Data.INPUT, "]"));
          valueInput = parent.querySelector(".".concat(parent.className).concat(Class.INPUT));
          if (!input || !valueInput) return null;
          input.value = listItem.textContent;
          valueInput.value = listItem.getAttribute(Data.VALUE);
        }

        Selectarr.remove();
      }
    }, {
      key: "remove",
      value: function remove() {
        var list = document.querySelector("[".concat(Data.LIST, "]"));
        if (list) list.parentElement.removeChild(list);
      }
    }]);

    return Selectarr;
  }();

  document.addEventListener("click", Selectarr.applyValue);
  new Selectarr(".test", {
    limit: 3,
    // url: "https://jsonplaceholder.typicode.com/posts",
    values: [{
      text: "a belly",
      value: "hi"
    }, {
      text: "a aelly",
      value: "hi"
    }, {
      text: "a telly",
      value: "hi"
    }, {
      text: "a helly",
      value: "hi"
    }, {
      text: "a nelly",
      value: "hi"
    }, {
      text: "a celly",
      value: "hi"
    }, {
      text: "a uelly",
      value: "hi"
    }, {
      text: "a oelly",
      value: "hi"
    }, {
      text: "a aelly",
      value: "hi"
    }, {
      text: "a celly",
      value: "hi"
    }, {
      text: "a pelly",
      value: "hi"
    }, {
      text: "a lelly",
      value: "hi"
    }]
  });

  return Selectarr;

}));
