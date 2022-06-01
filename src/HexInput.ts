import ColorPicker from './ColorPicker'
import { hsbToHex } from './utils'

export default class HexInput {
	public element: HTMLInputElement
	constructor(private _colorPicker: ColorPicker) {
		this.element = document.createElement('input')
		this.element.classList.add('hexInput')
		this.element.setAttribute('type', 'text')
		this.element.setAttribute('maxlength', '7')
		this.update()
		this.element.addEventListener('input', e => this._onChange(e))
	}

	public update() {
		const hex = hsbToHex(this._colorPicker.hue, this._colorPicker.saturation, this._colorPicker.brightness)
		this.element.value = hex
	}

	private _onChange(e: Event) {
		const target = e.target as HTMLInputElement
		const regex = /^#([A-Fa-f0-9]{6})$/
		if (regex.test(target.value)) {
			this.element.classList.remove('error')
			this._colorPicker.updateHSB(target.value)
			this._colorPicker.picker.update()
			this._colorPicker.hueRange.update()
			this._colorPicker.pallet?.update()
		} else {
			this.element.classList.add('error')
		}
	}
}
