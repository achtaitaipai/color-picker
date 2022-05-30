const palletClr = [
	'#000000',
	'#1D2B53',
	'#7E2553',
	'#008751',
	'#AB5236',
	'#5F574F',
	'#C2C3C7',
	'#FFF1E8',
	'#FF004D',
	'#FFA300',
	'#FFEC27',
	'#00E436',
	'#29ADFF',
	'#83769C',
	'#FF77A8',
	'#FFCCAA',
]

//color picker web component
export default class ColorPicker extends HTMLElement {
	private _picker: HTMLDivElement
	private _hueRange: HTMLInputElement
	private _hexInput: HTMLInputElement
	private _pallet: HTMLDivElement
	constructor() {
		super()
		const shadow = this.attachShadow({ mode: 'open' })
		const style = document.createElement('style')
		style.textContent = /*css*/ `
            :host {
                display:grid;
                position: relative;
                padding:.5rem;
                gap:.15rem;
                grid-template-columns:3rem 1fr 1rem;
                justify-items:center;
                align-items:center;
                grid-template-rows:auto 1.4rem;
                background-color:#3f3e3e;
                border-radius:0.3125rem;
            }
            .pallet{
                grid-row:1 / span 2;
                display:grid;
                grid-template-columns:repeat(2,1rem);
                grid-template-rows:repeat(8,1rem);
                gap:0.2rem;
                justify-content:center;
                align-content:center;
            }
            .colorBtn{
                display: none;
            }
            .colorLabel{
                cursor:pointer;
                border-radius:0.125rem;
            }
            .colorBtn:checked + .colorLabel{
                outline:1px solid white;
                outline-offset: 2px;
            }
            .picker{
                width:100%;
                height:auto;
                aspect-ratio:1;
                background-color: #ff0000;
                position:relative;
            }
            .picker::after{
                content:"";
                position:absolute;
                inset:0;
                background-image: linear-gradient(to right, #fff, rgba(204, 154, 129, 0));
            }
            .picker::before{
                content:"";
                position:absolute;
                inset:0;
                z-index:1;
                background-image: linear-gradient(to top, #000, rgba(204, 154, 129, 0));
            }
            .hueRange{
                grid-row:1;
                grid-column:3;
                outline: 0;
                -webkit-appearance :none;
                width:7rem;
                height:.5rem;
                border-radius:0.5rem;
                box-sizing:border-box;
                background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
                transform: rotate(-90deg);
                cursor:pointer;
            }
            input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                border: 2px solid #ffff;
                height: 1rem;
                width: .35rem;
                background: transparent;
                cursor: pointer;
              }
              
              input[type=range]::-moz-range-thumb {
                -webkit-appearance: none;
                border: 2px solid #ffff;
                height: 1rem;
                width: .35rem;
                background: transparent;
                cursor: pointer;
              }
            .hexInput{
                grid-row:2;
                grid-column:2 / -1;
                display:block;
                width:100%;
                margin:0;
                box-sizing:border-box;
                background-color:#282828;
                color:#ffff;
                font-size:.7rem;
                border:0;
                padding:.4rem;
            }
        `

		this._pallet = this._createPallet(palletClr)
		this._picker = this._createPicker()
		this._hueRange = this._createHueRange()
		this._hexInput = this._createHexInput()

		shadow.appendChild(style)
		shadow.appendChild(this._pallet)
		shadow.appendChild(this._picker)
		shadow.appendChild(this._hueRange)
		shadow.appendChild(this._hexInput)
	}

	private _createPallet(clrs: string[]) {
		const pallet = document.createElement('div')
		pallet.classList.add('pallet')
		clrs.forEach(clr => {
			const colorBtn = document.createElement('input')
			colorBtn.setAttribute('type', 'radio')
			colorBtn.setAttribute('name', 'color')
			colorBtn.setAttribute('value', clr)
			colorBtn.setAttribute('label', clr)
			colorBtn.id = `clrBtn-${clrs.indexOf(clr)}`
			colorBtn.classList.add('colorBtn')
			const colorLabel = document.createElement('label')
			colorLabel.setAttribute('for', `clrBtn-${clrs.indexOf(clr)}`)
			colorLabel.classList.add('colorLabel')
			colorLabel.style.backgroundColor = clr

			pallet.appendChild(colorBtn)
			pallet.appendChild(colorLabel)
		})
		const firstBtn = pallet.querySelector('input') as HTMLInputElement
		firstBtn.checked = true
		return pallet
	}

	private _createPicker() {
		const picker = document.createElement('div')
		picker.classList.add('picker')
		return picker
	}

	private _createHueRange() {
		const hueRange = document.createElement('input')
		hueRange.setAttribute('type', 'range')
		hueRange.setAttribute('min', '0')
		hueRange.setAttribute('max', '360')
		hueRange.setAttribute('value', '0')
		hueRange.setAttribute('step', '1')
		hueRange.setAttribute('name', 'hue')
		hueRange.classList.add('hueRange')
		hueRange.addEventListener('input', e => this._hueRangeChange(e))
		return hueRange
	}

	private _createHexInput() {
		const hexInput = document.createElement('input')
		hexInput.classList.add('hexInput')
		hexInput.setAttribute('type', 'text')
		hexInput.setAttribute('name', 'hex')
		hexInput.setAttribute('value', '#000000')
		return hexInput
	}

	private _hueRangeChange(e: Event) {
		const hue = (e.target as HTMLInputElement).value
		const hexClr = ColorPicker._hsbToHex(parseInt(hue), 100, 100)
		this._picker.style.setProperty('background-color', hexClr)
	}

	//http://data0.eklablog.com/n0f4c3/perso/code%20rgb/colorpicker/colormethods.js
	private static _rgbToHsb(r: number, g: number, b: number) {
		r /= 255
		g /= 255
		b /= 255

		const hsv = { h: 0, s: 0, v: 0 }

		var min = 0
		var max = 0

		if (r >= g && r >= b) {
			max = r
			min = g > b ? b : g
		} else if (g >= b && g >= r) {
			max = g
			min = r > b ? b : r
		} else {
			max = b
			min = g > r ? r : g
		}

		hsv.v = max
		hsv.s = max ? (max - min) / max : 0

		if (!hsv.s) {
			hsv.h = 0
		} else {
			const delta = max - min
			if (r == max) {
				hsv.h = (g - b) / delta
			} else if (g == max) {
				hsv.h = 2 + (b - r) / delta
			} else {
				hsv.h = 4 + (r - g) / delta
			}

			hsv.h = Math.floor(hsv.h * 60)
			if (hsv.h < 0) {
				hsv.h += 360
			}
		}

		hsv.s = Math.floor(hsv.s * 100)
		hsv.v = Math.floor(hsv.v * 100)

		return hsv
	}

	private static _hsbToHex(h: number, s: number, v: number) {
		let r = 0,
			g = 0,
			b = 0

		if (s == 0) {
			if (v == 0) {
				r = g = b = 0
			} else {
				r = g = b = Math.floor((v * 255) / 100)
			}
		} else {
			if (h == 360) {
				h = 0
			}
			h /= 60

			s = s / 100
			v = v / 100

			var i = Math.floor(h)
			var f = h - i
			var p = v * (1 - s)
			var q = v * (1 - s * f)
			var t = v * (1 - s * (1 - f))
			switch (i) {
				case 0:
					r = v
					g = t
					b = p
					break
				case 1:
					r = q
					g = v
					b = p
					break
				case 2:
					r = p
					g = v
					b = t
					break
				case 3:
					r = p
					g = q
					b = v
					break
				case 4:
					r = t
					g = p
					b = v
					break
				case 5:
					r = v
					g = p
					b = q
					break
			}

			r = Math.floor(r * 255)
			g = Math.floor(g * 255)
			b = Math.floor(b * 255)
		}
		const hex = this._rgbToHex(r, g, b)

		// return { rgb: [r, g, b], hex }
		return hex
	}

	private static _rgbToHex(r: number, g: number, b: number) {
		return '#' + [r, g, b].map(n => ('0' + n.toString(16)).slice(-2)).join('')
	}

	private static _hexTorgb(hex: string) {
		const arr = hex.match(/([a-fA-F0-9][a-fA-F0-9])/g)?.map(str => parseInt(str, 16))
		if (arr) return [0, 0, 0].map((v, i) => arr[i] || v)
		return [0, 0, 0]
	}
}
