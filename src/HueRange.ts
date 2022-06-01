import ColorPicker from './ColorPicker'

export default class HueRange {
	public element: HTMLInputElement
	constructor(private _colorPicker: ColorPicker) {
		this.element = document.createElement('input')
		this.element.classList.add('hueRange')
		this.element.setAttribute('type', 'range')
		this.element.setAttribute('min', '0')
		this.element.setAttribute('max', '360')
		this.element.setAttribute('value', '0')
		this.element.addEventListener('input', _ => this._hueRangeChange())
	}

	private _hueRangeChange() {
		this._colorPicker.hue = this.value
		this._colorPicker.picker.update()
		this._colorPicker.pallet?.update()
		this._colorPicker.hexInput.update()
	}

	public update() {
		this.value = this._colorPicker.hue
	}

	public get value(): number {
		return parseInt(this.element.value)
	}

	public set value(value: number) {
		this.element.value = value.toString()
	}
}
