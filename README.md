# Color Picker

Simple color-picker custom element

---

## Usage

Install the package using npm :

```bash
npm install @achtaitaipai/color-picker
```

Import it in your script

```js
import @achtaitaipai/color-picker
```

Use the custom element in your html using

`<color-picker></color-picker>`.

```html
<color-picker confirm-label="Ok" cancel-label="Cancel" pallet='["#ff0000","#1D2B53","#7E2553"]'></color-picker>
```

Define style

```css
color-picker {
	position: fixed;
	width: 200px;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
```

Open the color-picker with `open()` and listen change with `color-change`

```js
const clrpckr = document.querySelector('color-picker')
clrpckr.open()

clrpckr.addEventListener('color-change', e => {
	console.log(e.detail)
})
```

---

## Doc

### Attributes

|      Name       |   Type   |          Example          |
| :-------------: | :------: | :-----------------------: |
|    `pallet`     | `array`  | `"['#ff0000','#1D2B53']"` |
| `confirm-label` | `string` |          `"Ok"`           |
| `cancel-label`  | `string` |        `"Cancel"`         |

---

### Methods

|  Name   |      Description       |
| :-----: | :--------------------: |
| `open`  | open the color picker  |
| `close` | close the color picker |

---

### CSS Variables

|      Name      |  default  |                description                 |
| :------------: | :-------: | :----------------------------------------: |
|     `--bg`     | `#3f3e3e` |              background color              |
|  `--bg-input`  | `#282828` | background color of text input and buttons |
| `--font-color` | `#ffffff` |                 font color                 |
|  `--bg-error`  | `#7b0000` | background color of text input when error  |

---

### Properties

|  Name   |  Type  |  Example  |
| :-----: | :----: | :-------: |
| `value` | string | `#ff0000` |
