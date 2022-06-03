# Color Picker

Simple color-picker custom element

---

## Installation

Install the package using npm :

```bash
npm install @achtaitaipai/color-picker
```

Then import it in your script

```js
import @achtaitaipai/color-picker
```

Then use the custom element in your html using

`<color-picker></color-picker>`.

```html
<color-picker
	confirm-label="Ok"
	cancel-label="Cancel"
	pallet='["#ff0000","#1D2B53","#7E2553","#008751","#AB5236","#5F574F","#C2C3C7","#FFF1E8","#FF004D","#FFA300","#FFEC27","#00E436","#29ADFF","#83769C","#FF77A8","#FFCCAA"]'
></color-picker>
```

Then open the color-picker with `open()` and listen change with `color-change`

```js
const clrpckr = document.querySelector('color-picker')
clrpckr.open()

pckr.addEventListener('color-change', e => {
	console.log(e.detail)
})
```

---

## Attributes

|      Name       |   Type   |          Example          |
| :-------------: | :------: | :-----------------------: |
|    `pallet`     | `array`  | `"['#ff0000','#1D2B53']"` |
| `confirm-label` | `string` |          `"Ok"`           |
| `cancel-label`  | `string` |        `"Cancel"`         |

---

## Methods

|  Name   |      Description       |
| :-----: | :--------------------: |
| `open`  | open the color picker  |
| `close` | close the color picker |

---

## CSS Variables

|      Name      |  default  |                description                 |
| :------------: | :-------: | :----------------------------------------: |
|     `--bg`     | `#3f3e3e` |              background color              |
|  `--bg-input`  | `#282828` | background color of text input and buttons |
| `--font-color` | `#ffffff` |                 font color                 |
|  `--bg-error`  | `#7b0000` | background color of text input when error  |

---

## Properties

|  Name   |  Type  |  Example  |
| :-----: | :----: | :-------: |
| `value` | string | `#ff0000` |
