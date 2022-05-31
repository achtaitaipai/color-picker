import { ColorPickerStyle } from './ColorPickerStyle'
import { hexToHsb, hsbToHex } from './utils'

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
	private _cursor: HTMLSpanElement
	private _hueRange: HTMLInputElement
	private _hexInput: HTMLInputElement
	private _pallet: HTMLDivElement
	private _selectedClr: HTMLInputElement
	private _hue: number = 0
	private _saturation: number = 0
	private _brightness: number = 0
	private _palletClr = [...palletClr]
	constructor() {
		super()
		const shadow = this.attachShadow({ mode: 'open' })

		this._picker = this._createPicker()

		this._cursor = document.createElement('span')
		this._cursor.classList.add('picker_cursor')
		this._picker.appendChild(this._cursor)

		this._hueRange = this._createHueRange()
		this._pallet = this._createPallet(this._palletClr)
		this._hexInput = this._createHexInput()

		shadow.appendChild(ColorPickerStyle)
		shadow.appendChild(this._picker)
		shadow.appendChild(this._hueRange)
		shadow.appendChild(this._pallet)
		shadow.appendChild(this._hexInput)

		this._updateHSB(this._palletClr[0])
		this._selectedClr = this._pallet.querySelector(`input[value="${this._palletClr[0]}"]`) as HTMLInputElement
		this._selectedClr.checked = true
		this._updateHexInput()
		this._upadtePicker()
	}

	private _createPallet(clrs: string[]) {
		const pallet = document.createElement('div')
		pallet.classList.add('pallet')
		clrs.forEach(clr => {
			const colorBtn = document.createElement('input')
			colorBtn.setAttribute('type', 'radio')
			colorBtn.setAttribute('name', 'color')
			colorBtn.setAttribute('value', clr)
			colorBtn.id = `clrBtn-${clrs.indexOf(clr)}`
			colorBtn.classList.add('colorBtn')
			const colorLabel = document.createElement('label')
			colorLabel.setAttribute('for', `clrBtn-${clrs.indexOf(clr)}`)
			colorLabel.classList.add('colorLabel')
			colorLabel.style.backgroundColor = clr
			colorBtn.addEventListener('click', e => this._clrBtnClick(e))

			pallet.appendChild(colorBtn)
			pallet.appendChild(colorLabel)
		})
		return pallet
	}

	private _createPicker() {
		const picker = document.createElement('div')
		picker.classList.add('picker')
		picker.addEventListener('click', e => this._pickerClick(e))
		picker.addEventListener('mousemove', e => this._pickerMove(e))
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
		hueRange.addEventListener('input', _ => this._hueRangeChange())
		return hueRange
	}

	private _createHexInput() {
		const hexInput = document.createElement('input')
		hexInput.classList.add('hexInput')
		hexInput.setAttribute('type', 'text')
		hexInput.setAttribute('name', 'hex')
		hexInput.setAttribute('value', '#000000')
		hexInput.addEventListener('input', e => this._hexInputChange(e))
		return hexInput
	}

	private _hueRangeChange() {
		this._hue = parseInt(this._hueRange.value)
		this._upadtePicker()
		this._updateHexInput()
		this._updateSelectedClr()
	}

	private _pickerClick(e: MouseEvent) {
		const { left, top, width, height } = this._picker.getBoundingClientRect()
		const x = e.clientX - left
		const y = e.clientY - top
		this._cursor.style.setProperty('left', `${x}px`)
		this._cursor.style.setProperty('top', `${y}px`)
		this._brightness = Math.min(100, Math.max(0, 100 - (y / height) * 100))
		this._saturation = Math.min(100, Math.max(0, (x / width) * 100))
		this._updateHexInput()
		this._updateSelectedClr()
	}

	private _pickerMove(e: MouseEvent) {
		if (e.buttons === 1) {
			const { left, top, width, height } = this._picker.getBoundingClientRect()
			const x = Math.min(width, Math.max(0, e.clientX - left))
			const y = Math.min(height, Math.max(0, e.clientY - top))
			this._cursor.style.setProperty('left', `${x}px`)
			this._cursor.style.setProperty('top', `${y}px`)
			this._brightness = Math.min(100, Math.max(0, 100 - (y / height) * 100))
			this._saturation = Math.min(100, Math.max(0, (x / width) * 100))
			this._updateHexInput()
			this._updateSelectedClr()
		}
	}

	private _clrBtnClick(e: MouseEvent) {
		const target = e.target as HTMLInputElement
		this._selectedClr = target
		this._updateHSB(target.value)
		this._upadtePicker()
		this._updateHexInput()
		this._updateHueRange()
	}

	private _updateHSB(hex: string) {
		const hsb = hexToHsb(hex)
		if (hsb) {
			this._hue = hsb.h
			this._saturation = hsb.s
			this._brightness = hsb.b
		}
	}
	private _hexInputChange(e: Event) {
		const target = e.target as HTMLInputElement
		const regex = /^#([A-Fa-f0-9]{6})$/
		if (regex.test(target.value)) {
			this._hexInput.classList.remove('error')
			this._updateHSB(target.value)
			this._upadtePicker()
			this._updateHueRange()
		} else {
			this._hexInput.classList.add('error')
			console.log(target.value)
		}
	}

	private _updateHexInput() {
		const hex = hsbToHex(this._hue, this._saturation, this._brightness)
		this._hexInput.value = hex
	}

	private _upadtePicker() {
		this._picker.style.setProperty('background-color', hsbToHex(this._hue, 100, 100))
		const { width, height } = this._picker.getBoundingClientRect()
		const x = (this._saturation / 100) * width
		const y = (1 - this._brightness / 100) * height
		this._cursor.style.setProperty('left', `${x}px`)
		this._cursor.style.setProperty('top', `${y}px`)
	}

	private _updateSelectedClr() {
		const hex = hsbToHex(this._hue, this._saturation, this._brightness)
		this._selectedClr.value = hex
		const id = this._selectedClr.id
		const label = this._pallet.querySelector(`label[for="${id}"]`) as HTMLLabelElement
		label.style.setProperty('background-color', hex)
	}

	private _updateHueRange() {
		this._hueRange.value = `${this._hue}`
	}
}
