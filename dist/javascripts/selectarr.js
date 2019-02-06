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

  var Selector = {
    INPUT: "data-selectarr",
    LIST: "data-selectarr-list",
    ITEM: "data-selectarr-item",
    ITEMACTIVE: "selectarr-active"
    /** 
     * Class representing a searchable select
     */

  };

  var Selectarr =
  /*#__PURE__*/
  function () {
    /**
     * 
     * @param {string} element - Selector for element(s)
     * @param {string[]} data - Dropdown of options
     */
    function Selectarr() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _classCallCheck(this, Selectarr);

      this.keyup = this.keyup.bind(this);
      this.createList = this.createList.bind(this);
      this.keyEnter = this.keyEnter.bind(this);
      this.keyArrow = this.keyArrow.bind(this);
      this.mouseEnter = this.mouseEnter.bind(this);
      this._element = document.querySelector(element);
      this._data = data;
      this._index = -1;
      if (this._element) this._element.addEventListener("keyup", this.keyup);
    }
    /**
     * Change the value of an input
     * 
     * @param {object} event - Event object passed from event listener
     */


    _createClass(Selectarr, [{
      key: "createList",

      /**
       * Create HTML for list of items
       * 
       * @param {string[]} data - Filtered data matching input value
       * @param {HTMLElement} parent - Parent element to append list
       */
      value: function createList(data, parent) {
        var _this = this;

        var list = document.createElement("ul");
        var listItem;
        list.setAttribute(Selector.LIST, "");
        data.forEach(function (str, index) {
          listItem = document.createElement("li");
          listItem.setAttribute(Selector.ITEM, index);
          listItem.textContent = str;
          listItem.addEventListener("mouseenter", _this.mouseEnter);
          list.appendChild(listItem);
        });
        parent.appendChild(list);
      }
      /**
       * Handle enter keyup event
       * 
       * @param {object} event - Event object passed from event listener
       */

    }, {
      key: "keyEnter",
      value: function keyEnter(event) {
        if (this._index === -1) return null;
        var inputEl = event.target.closest("[".concat(Selector.INPUT, "]"));
        var listItems = document.querySelectorAll("[".concat(Selector.ITEM, "]"));
        if (!inputEl || !listItems.length) return null;
        inputEl.value = listItems[this._index].textContent;
        Selectarr.removeList();
      }
      /**
       * Handle arrow up and down keyup event
       * 
       * @param {object} event - Event object passed from event listener
       */

    }, {
      key: "keyArrow",
      value: function keyArrow(event) {
        var listItems = document.querySelectorAll("[".concat(Selector.ITEM, "]"));
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

    }, {
      key: "mouseEnter",
      value: function mouseEnter(event) {
        var listItem = event.target.closest("[".concat(Selector.ITEM, "]"));
        if (!listItem) return null;
        this._index = parseInt(listItem.getAttribute(Selector.ITEM), 10);
        Selectarr.changeActive(this._index);
      }
      /**
       * Handle keyup event on input
       * 
       * @param {object} event - Event object passed from event listener 
       */

    }, {
      key: "keyup",
      value: function keyup(event) {
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
        var inputEl = event.target.closest("[".concat(Selector.INPUT, "]"));
        if (!inputEl || !inputEl.value.length) return null;

        var test = new RegExp(inputEl.value, 'gi'),
            match = this._data.filter(function (name) {
          return name.match(test);
        });

        if (match.length) {
          this.createList(match, inputEl.parentElement);
        }
      }
    }], [{
      key: "applyValue",
      value: function applyValue(event) {
        var listItem = event.target.closest("[".concat(Selector.ITEM, "]"));

        if (!listItem) {
          Selectarr.removeList();
          return null;
        }
        var inputEl = listItem.parentElement.parentElement.querySelector("[".concat(Selector.INPUT, "]"));
        if (inputEl) inputEl.value = listItem.textContent;
        Selectarr.removeList();
      }
      /**
       * Change current active class on list item
       * 
       * @param {number} index - Index of list item
       */

    }, {
      key: "changeActive",
      value: function changeActive(index) {
        var listItems = document.querySelectorAll("[".concat(Selector.ITEM, "]"));
        if (!listItems.length) return null;
        var active = document.querySelector(".".concat(Selector.ITEMACTIVE));
        if (active) active.className = "";
        listItems[index].className = Selector.ITEMACTIVE;
      }
      /**
       * Remove list HTML and reset value of index
       */

    }, {
      key: "removeList",
      value: function removeList() {
        var list = document.querySelector("[".concat(Selector.LIST, "]"));
        if (list) list.parentElement.removeChild(list);
      }
    }]);

    return Selectarr;
  }();

  document.addEventListener("click", Selectarr.applyValue);

  return Selectarr;

}));
