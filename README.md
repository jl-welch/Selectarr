# Selectarr

Include in JavaScript:

```js
import Selectarr from "selectarr";
```

Include in Sass:

```css
@import "~selectarr/src/stylesheets/style";
```

Selectarr class takes input selector and array of objects.

```js
const values = [
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

new Selectarr(".input", values);
```

Input element requires `data-selectarr` attribute.

```html
<input class="input" type="text" name="username" data-selectarr>
```

Selectarr will add some needed HTML, so the example above would output:

```html
<div style="display: inline-block; position: relative;">
  <input class="input" type="text" data-selectarr>
  <input class="selectarr" type="hidden" name="username">
</div>
```

The initial input will not be submitted along with any forms as the name attribute is omitted.