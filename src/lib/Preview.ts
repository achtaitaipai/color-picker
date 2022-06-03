import { ColorPicker } from '.'
import { hsbToHex } from './utils'

export default class Preview {
	public element: HTMLDivElement

	constructor(private _colorPicker: ColorPicker) {
		this.element = document.createElement('div')
		this.element.classList.add('preview')
	}

	public update() {
		const hex = hsbToHex(this._colorPicker.hue, this._colorPicker.saturation, this._colorPicker.brightness)
		this.element.style.backgroundColor = hex
	}
}
