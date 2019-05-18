# Selectarr

### Turn simple text inputs into a select-type dropdown

## Javascript

```js
import Selectarr from "selectarr";
```

| Parameter | Description          | Type     |
| --------- | -------------------- | -------- |
| `element` | The element selector | `String` |
| `options` | All of the options   | `Object` |

#### Example

```js
const options = {
  class: "custom-select",
  limit: 5,
  items: [
    "Single string for label and value",
    "Another one",
    {
      label: "Or specify label and value.",
      value: "object-label-value",
    },
    {
      label: "John Doe",
      value: "john",
    },
    {
      label: "Foo Bar",
      value: "foo",
    },
  ],
};

new Selectarr(".input", options);
```

##### Options

| Key   | Description                                                       | Default     | Type     |
| ----- | ----------------------------------------------------------------- | ----------- | -------- |
| class | Base class name                                                   | `Selectarr` | `String` |
| limit | Limits list items                                                 | `10`        | `Number` |
| items | Array of objects with label and values or single string for both. |             | `Array`  |

## HTML

Your input element requires the attribute `data-selectarr`.

```html
<input class="input" type="text" name="username" data-selectarr />
```

After Selectarr is run, your HTML will look like:

```html
<div class="selectarr">
  <input class="input" id="input" type="text" data-selectarr />
  <input class="selectarr-input" type="hidden" name="username" />
  <ul class="selectarr-list" data-selectarr-list></ul>
</div>
```

Classes are defaulted to have the `selectarr` prefix. This can be changed in the options.

| Element      | Class name      |
| ------------ | --------------- |
| Parent       | `<class>`       |
| Hidden input | `<class>-input` |
| List         | `<class>-list`  |
| List item    | `<class>-item`  |

Only the hidden input will be submitted.

## CSS

Include in Sass:

```css
@import "~selectarr/src/stylesheets/selectarr";
```

**note**: This stylesheet includes styles for the default class names.

Sass variables _used for the generated list of values_:

| Element                    | Default value | Description                                  |
| -------------------------- | ------------- | -------------------------------------------- |
| \$selectarr-border         | `1px`         | Border width                                 |
| \$selectarr-border-color   | `#e8ebec`     | Border colour                                |
| \$selectarr-bg             | `#fff`        | Background colour                            |
| \$selectarr-zindex         | `10`          | z-index                                      |
| \$selectarr-item-spacing-y | `.6rem`       | Padding **top and bottom** of each list item |
| \$selectarr-item-spacing-x | `1.2rem`      | Padding **left and right** of each list item |
