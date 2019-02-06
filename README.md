# Selectarr

Include in JavaScript:

```js
import Selectarr from "selectarr";
```

Include in Sass:

```css
@import "~selectarr/src/stylesheets/style";
```

Selectarr class takes input selector and array of strings.

```js
new Selectarr(".input", ["James Welch", "John Doe", "Foo Bar"]);
```

Input element requires `data-selectarr` attribute.

```html
<input class="input" type="text" name="username" data-selectarr>
```