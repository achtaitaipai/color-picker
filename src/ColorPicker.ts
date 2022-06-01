import Btns from './Btns'
import { ColorPickerStyle } from './ColorPickerStyle'
import HexInput from './HexInput'
import HueRange from './HueRange'
import Pallet from './Pallet'
import Picker from './Picker'
import { hexToHsb, hsbToHex, isHexClr } from './utils'

//color picker web component
export default class ColorPicker extends HTMLElement {
	public picker: Picker
	public hueRange: HueRange
	public hexInput: HexInput
	public btns: Btns
	public pallet: Pallet | null = null
	private _selectedClr: HTMLInputElement | null = null
	public hue: number = 0
	public saturation: number = 0
	public brightness: number = 0
	private _palletClr: string[] | null = null
	private _historyPalletClr: string[] | null = null
	private _value: string
	constructor() {
		super()
		const shadow = this.attachShadow({ mode: 'open' })

		this._definePalletClr()

		this.picker = new Picker(this)

		this.hueRange = new HueRange(this)
		if (this._palletClr) this.pallet = new Pallet(this, this._palletClr)
		this.hexInput = new HexInput(this)
		this.btns = new Btns(this, this.getAttribute('confirm-label') || 'Ok', this.getAttribute('cancel-label') || 'Cancel')

		shadow.appendChild(ColorPickerStyle)
		shadow.appendChild(this.picker.element)
		shadow.appendChild(this.hueRange.element)
		if (this.pallet) {
			shadow.appendChild(this.pallet.element)
			if (this._palletClr) {
				this.updateHSB(this._palletClr[0])
				this._selectedClr = this.pallet.element.querySelector<HTMLInputElement>(`input[value="${this._palletClr[0]}"]`)
			}
		}
		this._value = this._selectedClr?.value || '#000000'
		shadow.appendChild(this.hexInput.element)
		shadow.appendChild(this.btns.elements)

		this.picker.update()

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
		if (this._palletClr) {
			if (!this.pallet) {
				this.pallet = new Pallet(this, this._palletClr)
				this.shadowRoot?.insertBefore(this.pallet.element, this.hexInput.element)
				this._selectedClr = this.pallet.element.querySelector<HTMLInputElement>(`input[value="${this._palletClr[0]}"]`)
				if (this._selectedClr) {
					this._selectedClr.checked = true
				}
			}
			this.pallet?.setColors(this._palletClr)
			this._value = this._selectedClr?.value || '#000000'
		}
	}

	get value() {
		return this._value
	}

	public open() {
		this.style.display = 'flex'
		this.setAttribute('aria-hidden', 'false')
		this.picker.element.focus()
		this.addEventListener('keydown', e => this._keyDown(e))
		this.picker.update()
		this.hexInput.update()
		this._resetPallet()
		if (this._palletClr) this._historyPalletClr = [...this._palletClr]
	}

	public close() {
		this.style.display = 'none'
		this.setAttribute('aria-hidden', 'true')
		this.removeEventListener('keydown', e => this._keyDown(e))
		if (this.pallet) this._palletClr = this.pallet.clrs
		this._value = hsbToHex(this.hue, this.saturation, this.brightness)
	}

	public exit() {
		this.close()
		if (this._historyPalletClr) this._palletClr = [...this._historyPalletClr]
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
}
