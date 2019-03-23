# Selectarr

## Javascript

### Turn simple text inputs into a select-type dropdown

```js
import Selectarr from "selectarr";
```

Selectarr class takes an input selector and an options object.

```js
const options = {
  values: [
    {
      text: "James Welch",
      value: "james"
    },
    {
      text: "John Doe",
      value: "john"
    },
    {
      text: "Foo Bar",
      value: "foo"
    },
  ]
};

new Selectarr(".input", values);
```

Input element requires `data-selectarr` attribute.

```html
<input class="input" type="text" name="username" data-selectarr>
```

Selectarr will add some needed HTML, so the example above would output:

**note**: By default, the base class name will be `selectarr`.

```html
<div class="selectarr">
  <input class="input" id="input" type="text" data-selectarr>
  <input class="selectarr-input" type="hidden" name="username">
</div>
```

To change this base class name:

```js
const options = {
  class: "foobar",
  values: [] //...
};
```

Output:

```html
<div class="foobar">
  <input class="input" id="input" type="text" data-selectarr>
	<input class="foobar-input" type="hidden" name="username">
	<ul class="foobar-list" data-selectarr-list></ul>
</div>
```

| Element       | Class name     |
| ------------- | -------------- |
| Parent        | `<class>`      |
| Hidden input  | `<class>-input`|
| List          | `<class>-list` |
| List item     | `<class>-item` |

As stated above, the default class name is `selectarr`. Make sure to apply styles if you change this.

The initial text input will have its name attribute copied over to the hidden input, and so will not be submitted.

### Options

| Key           | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| class         | String. Base class name                                        |
| limit         | Number. Limits list items                                      |
| values        | Array. List of objects that contains text and value properties |

Simple enough.

## CSS

Include in Sass:

```css
@import "~selectarr/src/stylesheets/style";
```

**note**: This stylesheet includes styles for only the default class names.

Sass variables *used for the generated list of values*: 

| Element                   | Default value  | Description                                        |
| ------------------------- | -------------- | -------------------------------------------------- |
| $selectarr-border         | `1px`          | Border width                                       |
| $selectarr-border-color   | `#e8ebec`      | Border colour                                      |
| $selectarr-bg             | `#fff`         | Background colour                                  |
| $selectarr-zindex         | `10`           | z-index                                            |
| $selectarr-item-spacing-y | `.6rem`        | Padding **top and bottom** of each list item       |
| $selectarr-item-spacing-x | `1.2rem`       | Padding **left and right** of each list item       |