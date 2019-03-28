(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.selectarr = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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
  var ClassName = {
    INPUT: "input",
    LIST: "list",
    LISTOPEN: "open",
    ITEM: "item",
    ITEMACTIVE: "active"
  };

  var Selectarr =
  /*#__PURE__*/
  function () {
    function Selectarr() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "[".concat(Data.INPUT, "]");
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Selectarr);

      if (typeof element !== "string") throw new Error("Type of element selector must be a string.");
      if (_typeof(options) !== "object") throw new Error("Options must be an object.");
      this._search = this._search.bind(this);
      this._applyValue = this._applyValue.bind(this);
      this._mouseEnter = this._mouseEnter.bind(this);
      this._element = document.querySelector(element);
      if (!this._element) throw new Error("Cannot find element: ".concat(element));
      this._items = options.items;
      if (!this._items) throw new Error("Items does not exist: ".concat(this._items, ". Please pass an array of items to the options object."));
      this._list = document.createElement("ul");
      this._index = -1;
      this._limit = this.setLimit();
      this._class = options.class || "selectarr";
      this._hidden = null;
      this._wrapper = null;
      this._length = null;
      this.init();
    } // Public


    _createClass(Selectarr, [{
      key: "init",
      value: function init() {
        // Wrapper for our selectarr elements
        this._wrapper = document.createElement("div");
        this._wrapper.className = this._class;

        this._element.parentElement.replaceChild(this._wrapper, this._element); // Create a hidden select to be submitted with value


        this._hidden = document.createElement("input"), this._hidden.className = "".concat(this._class, "-").concat(ClassName.INPUT);
        this._hidden.name = this._element.name;
        this._hidden.type = "hidden"; // Don't submit visible selectarr input

        this._element.removeAttribute("name");

        this._element.addEventListener("keyup", this._search);

        this._list.className = "".concat(this._class, "-").concat(ClassName.LIST);

        this._list.setAttribute(Data.LIST, "");

        this._list.addEventListener("click", this._applyValue); // Populate wrapper


        this._wrapper.appendChild(this._element);

        this._wrapper.appendChild(this._hidden);

        this._wrapper.appendChild(this._list);
      }
    }, {
      key: "addActive",
      value: function addActive() {
        // Remove active before applying new one
        this.removeActive();

        var listItems = this._list.querySelectorAll("[".concat(Data.ITEM, "]"));

        if (!listItems.length || this._index < 0 || this._index > listItems.length) return null;

        listItems[this._index].classList.add("".concat(this._class, "-").concat(ClassName.ITEMACTIVE));
      }
    }, {
      key: "removeActive",
      value: function removeActive() {
        var active = this._list.querySelector(".".concat(this._class, "-").concat(ClassName.ITEMACTIVE));

        if (active) active.classList.remove("".concat(this._class, "-").concat(ClassName.ITEMACTIVE));
      }
    }, {
      key: "setLimit",
      value: function setLimit(int) {
        return int && +int > 0 ? +int : 10;
      } // Private

    }, {
      key: "_applyValue",
      value: function _applyValue(event) {
        var listItem = event.target.closest("[".concat(Data.ITEM, "]")) || this._list.querySelector("[".concat(Data.ITEM, "=\"").concat(this._index, "\"]"));

        if (!listItem) return null;
        this._element.value = listItem.textContent;
        this._hidden.value = listItem.getAttribute(Data.VALUE);

        Selectarr._removeList();
      }
    }, {
      key: "_populateList",
      value: function _populateList(array) {
        var _this = this;

        var listItem;
        this._length = array.length - 1;
        array.forEach(function (obj, index) {
          var value,
              label = null;

          if (_typeof(obj) === "object") {
            label = obj.label || obj.value;
            value = obj.value || obj.label;
          } else {
            value = label = obj;
          }

          listItem = document.createElement("li");
          listItem.textContent = label;
          listItem.className = "".concat(_this._class, "-").concat(ClassName.ITEM);
          listItem.setAttribute(Data.VALUE, value);
          listItem.setAttribute(Data.ITEM, index);
          listItem.addEventListener("mouseenter", _this._mouseEnter);

          _this._list.appendChild(listItem);

          _this._list.classList.add(ClassName.LISTOPEN);
        });
      }
    }, {
      key: "_match",
      value: function _match(string) {
        // Return array of strings that match our input value
        return this._items.filter(function (item) {
          var label = typeof item === "string" ? item : item.label ? item.label : item.value;
          return label.match(string);
        }).sort(function (a, b) {
          var labelA = typeof a === "string" ? a : a.label ? a.label : a.value;
          var labelB = typeof b === "string" ? b : b.label ? b.label : b.value;
          labelA.localeCompare(labelB);
        });
      }
    }, {
      key: "_search",
      value: function _search(event) {
        var eventKey = event.key,
            key = eventKey === "ArrowUp" || eventKey === "ArrowDown" || eventKey === "Enter";
        if (key) return this._key(event, event.key);

        Selectarr._removeList();

        this._index = -1;
        if (!this._element.value.length) return null;
        var test = new RegExp(this._element.value, 'gi');

        var match = this._match(test).slice(0, this._limit);

        if (match.length) this._populateList(match);
      }
    }, {
      key: "_key",
      value: function _key(event) {
        this["_key".concat(event.key)](event);
        if (event.key !== "Enter") this.addActive();
      }
    }, {
      key: "_keyArrowUp",
      value: function _keyArrowUp() {
        if (this._index > 0) this._index--;
      }
    }, {
      key: "_keyArrowDown",
      value: function _keyArrowDown() {
        if (this._index < this._length) this._index++;
      }
    }, {
      key: "_keyEnter",
      value: function _keyEnter(event) {
        if (this._index === -1) return null;

        this._applyValue(event, this._index);

        this._index = -1;
      }
    }, {
      key: "_mouseEnter",
      value: function _mouseEnter(event) {
        var listItem = event.target.closest("[".concat(Data.ITEM, "]"));
        if (listItem) this._index = parseInt(listItem.getAttribute(Data.ITEM), 10);
        this.addActive();
      } // Static

    }], [{
      key: "_checkSibling",
      value: function _checkSibling(target) {
        if (!target) return null;
        var wrapper = target.parentElement;
        var sibling = wrapper.querySelector("[".concat(Data.LIST, "].").concat(ClassName.LISTOPEN));
        return sibling;
      }
    }, {
      key: "_removeList",
      value: function _removeList() {
        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (event) {
          var target = event.target.closest("[".concat(Data.INPUT, "]"));

          var isSibling = Selectarr._checkSibling(target);

          if (isSibling) return null;
        }

        var list = document.querySelector("[".concat(Data.LIST, "].").concat(ClassName.LISTOPEN));
        if (!list) return;
        list.classList.remove(ClassName.LISTOPEN);
        list.innerHTML = "";
      }
    }]);

    return Selectarr;
  }();

  document.addEventListener("click", Selectarr._removeList);
  new Selectarr(".input", {
    class: "selectarr",
    limit: 7,
    items: ["hello!", {
      label: "howdy",
      value: "hola"
    }]
  });

  return Selectarr;

}));
