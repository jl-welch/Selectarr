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
    CLASS: "selectarr",
    INPUT: "data-selectarr",
    LIST: "data-selectarr-list",
    ITEM: "data-selectarr-item",
    VALUE: "data-selectarr-value",
    ITEMACTIVE: "selectarr-active"
  };

  var Selectarr =
  /*#__PURE__*/
  function () {
    function Selectarr() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "[".concat(Selector.INPUT, "]");
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [{}];

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
      this._data = data;
      this._index = -1;

      if (this._element) {
        this.init();
      }
    }

    _createClass(Selectarr, [{
      key: "init",
      value: function init() {
        var clone = this._element.cloneNode(),
            valueInput = clone.cloneNode(),
            wrapper = this._element.parentElement;

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
    }, {
      key: "search",
      value: function search(event) {
        var eventKey = event.key,
            usefulKey = eventKey === "ArrowUp" || eventKey === "ArrowDown" || eventKey === "Enter";

        if (usefulKey) {
          this.key(event, event.key);
          return;
        }

        Selectarr.remove();
        this._index = -1;
        if (!this._element.value.length) return null;

        var test = new RegExp(this._element.value, 'gi'),
            match = this._data.filter(function (name) {
          return name.text.match(test);
        });

        if (match.length) {
          this.createList(match);
        }
      }
    }, {
      key: "createList",
      value: function createList(data) {
        var _this = this;

        var list = document.createElement("ul");
        var listItem;
        list.setAttribute(Selector.LIST, "");
        data.forEach(function (obj, index) {
          listItem = document.createElement("li");
          listItem.setAttribute(Selector.VALUE, obj.value);
          listItem.setAttribute(Selector.ITEM, index);
          listItem.textContent = obj.text;
          listItem.addEventListener("mouseenter", _this.hover);
          list.appendChild(listItem);
        });

        this._parent.appendChild(list);
      }
    }, {
      key: "changeActive",
      value: function changeActive() {
        var listItems = document.querySelectorAll("[".concat(Selector.ITEM, "]"));
        if (!listItems.length) return null;
        var active = document.querySelector(".".concat(Selector.ITEMACTIVE));
        if (active) active.className = "";
        listItems[this._index].className = Selector.ITEMACTIVE;
      }
    }, {
      key: "key",
      value: function key(event, _key) {
        var listItems = document.querySelectorAll("[".concat(Selector.ITEM, "]"));
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
        if (this._index === 0 || this._index === -1) return null;
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
        var listItem = event.target.closest("[".concat(Selector.ITEM, "]"));
        if (!listItem) return null;
        this._index = parseInt(listItem.getAttribute(Selector.ITEM), 10);
        this.changeActive();
      }
    }], [{
      key: "applyValue",
      value: function applyValue(event) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var list, listItem, input, valueInput;
        list = "key" in event ? event.target.parentElement.querySelector("[".concat(Selector.LIST, "]")) : event.target.closest("[".concat(Selector.LIST, "]"));
        if (list) listItem = event.target.closest("[".concat(Selector.ITEM, "]")) || list.querySelector("[".concat(Selector.ITEM, "=\"").concat(index, "\"]"));

        if (listItem) {
          var parent = list.parentElement;
          input = parent.querySelector("[".concat(Selector.INPUT, "]"));
          valueInput = parent.querySelector(".".concat(Selector.CLASS));

          if (input && valueInput) {
            input.value = listItem.textContent;
            valueInput.value = listItem.getAttribute(Selector.VALUE);
          }
        }

        Selectarr.remove();
      }
    }, {
      key: "remove",
      value: function remove() {
        var list = document.querySelector("[".concat(Selector.LIST, "]"));
        if (list) list.parentElement.removeChild(list);
      }
    }]);

    return Selectarr;
  }();

  document.addEventListener("click", Selectarr.applyValue);
  new Selectarr(".test", [{
    text: "one",
    value: 0
  }, {
    text: "two",
    value: 1
  }, {
    text: "three",
    value: 2
  }]);
  new Selectarr(".testt", [{
    text: "one",
    value: 0
  }, {
    text: "two",
    value: 1
  }, {
    text: "three",
    value: 2
  }]);

  return Selectarr;

}));
