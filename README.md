# Selectarr
### Turn simple text inputs into a select-type dropdown

## Javascript

```js
import Selectarr from "selectarr";
```

#### Creation

| Parameter     | Description                   |
| ------------- | ----------------------------- |
| `element`     | `String` The element selector |
| `options`     | `Object` All of the options   |

```js
const options = {
  class: "custom-select",
  limit: 5,
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

new Selectarr(".input", options);
```

##### Options

| Key           | Description                                                    | Default     |
| ------------- | -------------------------------------------------------------- | ----------- |
| class         | String. Base class name                                        | `Selectarr` |
| limit         | Number. Limits list items                                      | `10`        |
| values        | Array. List of objects that contains text and value properties |             |

## HTML

Your input element requires the attribute `data-selectarr`.

```html
<input class="input" type="text" name="username" data-selectarr>
```

Selectarr will add some needed HTML:

```html
<div class="selectarr">
  <input class="input" id="input" type="text" data-selectarr>
  <input class="selectarr-input" type="hidden" name="username">
  <ul class="selectarr-list" data-selectarr-list></ul>
</div>
```

The classes used on the generated HTML are defaulted to `selectarr`, unless changed in the options.

| Element       | Class name     |
| ------------- | -------------- |
| Parent        | `<class>`      |
| Hidden input  | `<class>-input`|
| List          | `<class>-list` |
| List item     | `<class>-item` |

The initial text input will have its name attribute copied over to the hidden input, and so will not be submitted.

## CSS

Include in Sass:

```css
@import "~selectarr/src/stylesheets/style";
```

**note**: This stylesheet includes styles for the default class names.

Sass variables *used for the generated list of values*: 

| Element                   | Default value  | Description                                        |
| ------------------------- | -------------- | -------------------------------------------------- |
| $selectarr-border         | `1px`          | Border width                                       |
| $selectarr-border-color   | `#e8ebec`      | Border colour                                      |
| $selectarr-bg             | `#fff`         | Background colour                                  |
| $selectarr-zindex         | `10`           | z-index                                            |
| $selectarr-item-spacing-y | `.6rem`        | Padding **top and bottom** of each list item       |
| $selectarr-item-spacing-x | `1.2rem`       | Padding **left and right** of each list item       |