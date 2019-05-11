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
    ITEMACTIVE: "item--active"
  };

  var Selectarr =
  /*#__PURE__*/
  function () {
    function Selectarr() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "[".concat(Data.INPUT, "]");
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Selectarr);

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
    } // Public


    _createClass(Selectarr, [{
      key: "removeActive",
      value: function removeActive() {
        var active = this._list.querySelector(".".concat(this._class, "__").concat(ClassName.ITEMACTIVE));

        if (active) active.classList.remove("".concat(this._class, "__").concat(ClassName.ITEMACTIVE));
      } // Private

    }, {
      key: "_init",
      value: function _init() {
        var wrapper = document.createElement("div");
        wrapper.className = this._class;

        this._input.parentElement.replaceChild(wrapper, this._input); // Hidden select will be submitted with value


        this._hiddenInput.name = this._input.name;
        this._hiddenInput.type = "hidden"; // Visible select value will not be submitted

        this._input.className = "".concat(this._class, "__").concat(ClassName.INPUT);

        this._input.removeAttribute("name");

        this._input.addEventListener("keyup", this._keyDownHandler);

        this._list.className = "".concat(this._class, "__").concat(ClassName.LIST);

        this._list.setAttribute(Data.LIST, "");

        this._list.addEventListener("click", this._applyValueAndCloseList); // Populate wrapper


        wrapper.appendChild(this._input);
        wrapper.appendChild(this._hiddenInput);
        wrapper.appendChild(this._list);
      }
    }, {
      key: "_applyValueAndCloseList",
      value: function _applyValueAndCloseList(event) {
        var listItem = event.target.closest("[".concat(Data.ITEM, "]")) || this._list.querySelector("[".concat(Data.ITEM, "=\"").concat(this._index, "\"]"));

        if (!listItem) {
          return;
        }

        this._input.value = listItem.textContent;
        this._hiddenInput.value = listItem.getAttribute(Data.VALUE);
        this._index = -1;

        Selectarr._removeList();
      }
    }, {
      key: "_updateActiveItemState",
      value: function _updateActiveItemState() {
        var listItems = this._list.querySelectorAll("[".concat(Data.ITEM, "]"));

        if (listItems.length) {
          this.removeActive();

          listItems[this._index].classList.add("".concat(this._class, "__").concat(ClassName.ITEMACTIVE));
        }
      }
    }, {
      key: "_mouseEnter",
      value: function _mouseEnter(event) {
        var listItem = event.target.closest("[".concat(Data.ITEM, "]"));

        if (listItem) {
          this._index = listItem.getAttribute(Data.ITEM);

          this._updateActiveItemState();
        }
      }
    }, {
      key: "_populateListItems",
      value: function _populateListItems(items) {
        var _this = this;

        var listItem;
        this._length = items.length - 1;
        items.forEach(function (item, index) {
          var value;
          var label = null;

          if (_typeof(item) === "object") {
            label = item.label;
            value = item.value;
          } else {
            value = label = item;
          }

          listItem = document.createElement("li");
          listItem.textContent = label;
          listItem.className = "".concat(_this._class, "__").concat(ClassName.ITEM);
          listItem.setAttribute(Data.VALUE, value);
          listItem.setAttribute(Data.ITEM, index);
          listItem.addEventListener("mouseenter", _this._mouseEnter);

          _this._list.appendChild(listItem);

          _this._list.classList.add(ClassName.LISTOPEN);
        });
      }
    }, {
      key: "_match",
      value: function _match(regex) {
        return this._items.filter(function (item) {
          var label = Selectarr._getLabelFromItem(item);

          return label.match(regex);
        }).sort(function (a, b) {
          var labelA = Selectarr._getLabelFromItem(a);

          var labelB = Selectarr._getLabelFromItem(b);

          if (labelA < labelB) {
            return -1;
          }

          if (labelA > labelB) {
            return 1;
          } // Values are equal


          return 0;
        });
      }
    }, {
      key: "_search",
      value: function _search() {
        this._index = -1;

        Selectarr._removeList();

        if (!this._input.value) {
          return;
        }

        var test = new RegExp(this._input.value, "gi");

        var match = this._match(test).slice(0, this._limit);

        if (match.length) {
          this._populateListItems(match);
        }
      }
    }, {
      key: "_keyDownHandler",
      value: function _keyDownHandler(event) {
        var key = event.key;

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
      } // Static

    }], [{
      key: "_getLabelFromItem",
      value: function _getLabelFromItem(item) {
        var label;

        if (typeof item === "string") {
          label = item;
        } else if (item.label) {
          label = item.label;
        } else {
          label = item.value;
        }

        return label;
      }
    }, {
      key: "_removeList",
      value: function _removeList() {
        var list = document.querySelector("[".concat(Data.LIST, "].").concat(ClassName.LISTOPEN));
        if (!list) return;
        list.classList.remove(ClassName.LISTOPEN);
        list.innerHTML = "";
      }
    }, {
      key: "_setLimit",
      value: function _setLimit(int) {
        return int && +int > 0 ? +int : 5;
      }
    }]);

    return Selectarr;
  }();

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[".concat(Data.INPUT, "]"));
    var list = target ? target.parentElement.querySelector("[".concat(Data.LIST, "].").concat(ClassName.LISTOPEN)) : null;

    if (!list) {
      Selectarr._removeList();
    }
  });

  return Selectarr;

}));
