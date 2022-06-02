import Btns from './Btns'
import { ColorPickerStyle } from './ColorPickerStyle'
import HexInput from './HexInput'
import HueRange from './HueRange'
import Pallet from './Pallet'
import Picker from './Picker'
import Preview from './Preview'
import { hexToHsb, hsbToHex, isHexClr } from './utils'

//color picker web component
export default class ColorPicker extends HTMLElement {
	private _picker: Picker
	private _hueRange: HueRange
	private _hexInput: HexInput
	private _preview: Preview
	private _rangeWrapper: HTMLDivElement
	private _btns: Btns
	private _pallet: Pallet | null = null
	private _selectedClr: HTMLInputElement | null = null
	private _palletClr: string[] | null = null
	private _savedPalletClr: string[] | null = null
	private _value: string
	private _savedValue: string | null = null
	public hue: number = 0
	public saturation: number = 0
	public brightness: number = 0
	constructor() {
		super()
		const shadow = this.attachShadow({ mode: 'open' })

		this._definePalletClr()

		this._picker = new Picker(this, this._onPickerChange.bind(this))

		this._hueRange = new HueRange(this, this._onHueRangeChange.bind(this))
		this._preview = new Preview(this)
		this._rangeWrapper = document.createElement('div')
		this._rangeWrapper.classList.add('range-wrapper')
		this._rangeWrapper.appendChild(this._hueRange.element)
		if (this._palletClr) this._pallet = new Pallet(this, this._palletClr, this._onPalletChange.bind(this))
		this._hexInput = new HexInput(this, this._onHexInputChange.bind(this))
		this._btns = new Btns(this, this.getAttribute('confirm-label') || 'Ok', this.getAttribute('cancel-label') || 'Cancel')

		shadow.appendChild(ColorPickerStyle)
		shadow.appendChild(this._picker.element)
		shadow.appendChild(this._rangeWrapper)
		if (this._pallet) {
			shadow.appendChild(this._pallet.element)
			if (this._palletClr) {
				this.updateHSB(this._palletClr[0])
				this._selectedClr = this._pallet.element.querySelector<HTMLInputElement>(`input[value="${this._palletClr[0]}"]`)
			}
		} else {
			this._rangeWrapper.insertBefore(this._preview.element, this._hueRange.element)
			this._preview.update()
		}
		this._value = this._selectedClr?.value || '#000000'
		shadow.appendChild(this._hexInput.element)
		shadow.appendChild(this._btns.elements)

		this._picker.update()

		this.setAttribute('aria-label', 'Color Picker')
		this.setAttribute('role', 'dialog')
		this.setAttribute('tabindex', '0')
	}

	static get observedAttributes() {
		return ['confirm-label', 'cancel-label', 'pallet']
	}

	attributeChangedCallback(name: string, _: string, __: string) {
		if (name === 'pallet') {
			this._definePalletClr()
			this._resetPallet()
		}
	}

	private _resetPallet() {
		if (this._pallet) this._pallet.element.innerHTML = ''
		const preview = this._rangeWrapper.querySelector<HTMLDivElement>('.preview')
		if (preview) this._rangeWrapper.removeChild(preview)
		if (this._palletClr) {
			if (!this._pallet) {
				this._pallet = new Pallet(this, this._palletClr, this._onPalletChange)
				this.shadowRoot?.insertBefore(this._pallet.element, this._hexInput.element)
				this._selectedClr = this._pallet.element.querySelector<HTMLInputElement>(`input[value="${this._palletClr[0]}"]`)
				if (this._selectedClr) {
					this._selectedClr.checked = true
				}
			}
			this._pallet?.setColors(this._palletClr)
			this._value = this._selectedClr?.value || '#000000'
		} else {
			this._rangeWrapper.insertBefore(this._preview.element, this._hueRange.element)
			this._preview.update()
		}
	}

	get value() {
		return this._value
	}

	set value(hex: string) {
		if (!isHexClr(hex)) throw new Error('Invalid hex color')
		this.updateHSB(hex)
		this._hexInput.update()
		this._pallet?.update()
		this._preview.update()
		this._picker.update()
		this._hueRange.update()
	}

	public open() {
		this.style.display = 'flex'
		this.setAttribute('aria-hidden', 'false')
		this._picker.element.focus()
		this.addEventListener('keydown', e => this._keyDown(e))
		this._picker.update()
		this._hexInput.update()
		this._resetPallet()
		if (this._palletClr) this._savedPalletClr = [...this._palletClr]
		this._savedValue = this.value
	}

	public close() {
		this.style.display = 'none'
		this.setAttribute('aria-hidden', 'true')
		this.removeEventListener('keydown', e => this._keyDown(e))
		if (this._pallet) this._palletClr = this._pallet.clrs
		this._value = hsbToHex(this.hue, this.saturation, this.brightness)
	}

	public exit() {
		this.close()
		if (this._savedPalletClr) this._palletClr = [...this._savedPalletClr]
		if (this._savedValue) this.value = this._savedValue
	}

	private _definePalletClr() {
		const attribute = this.getAttribute('pallet')
		let pallet: string[] = []
		if (attribute) {
			const arr = JSON.parse(attribute)
			arr.forEach((clr: any) => {
				if (typeof clr === 'string' && isHexClr(clr)) {
					pallet.push(clr)
				}
			})
		}
		this._palletClr = pallet.length > 0 ? pallet : null
	}

	private _keyDown(e: KeyboardEvent) {
		if (e.code === 'Escape') this.exit()
		else if (e.code === 'Enter') this.close()
	}

	public updateHSB(hex: string) {
		const hsb = hexToHsb(hex)
		if (hsb) {
			this.hue = hsb.h
			this.saturation = hsb.s
			this.brightness = hsb.b
		}
	}

	private _onPalletChange(hex: string) {
		this.updateHSB(hex)
		this._picker?.update()
		this._hueRange?.update()
		this._hexInput?.update()
		this._preview?.update()
	}

	private _onHexInputChange(hex: string) {
		this.updateHSB(hex)
		this._picker?.update()
		this._hueRange?.update()
		this._pallet?.update()
		this._preview?.update()
	}

	private _onHueRangeChange(val: number) {
		this.hue = val
		this._picker?.update()
		this._pallet?.update()
		this._hexInput?.update()
		this._preview?.update()
	}

	private _onPickerChange() {
		this._pallet?.update()
		this._hexInput.update()
		this._preview.update()
	}
}
