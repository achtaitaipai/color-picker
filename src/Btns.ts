import ColorPicker from './ColorPicker'
import { hsbToHex } from './utils'

export default class Btns {
	public elements: HTMLDivElement
	public confirmBtn: HTMLButtonElement
	public cancelBtn: HTMLButtonElement

	constructor(private _colorPicker: ColorPicker, labelOk: string, labelCancel: string) {
		this.elements = document.createElement('div')
		this.elements.classList.add('btns')
		this.confirmBtn = document.createElement('button')
		this.confirmBtn.classList.add('btns_ok')
		this.confirmBtn.textContent = labelOk
		this.elements.appendChild(this.confirmBtn)
		this.cancelBtn = document.createElement('button')
		this.cancelBtn.classList.add('btns_cancel')
		this.cancelBtn.textContent = labelCancel
		this.elements.appendChild(this.cancelBtn)

		this.cancelBtn.addEventListener('click', () => this._cancel())
		this.cancelBtn.addEventListener('keydown', e => this._keyDown(e))
		this.confirmBtn.addEventListener('click', () => this._confirm())
	}

	private _cancel() {
		this._colorPicker.exit()
	}
	private _confirm() {
		this._colorPicker.close()
		const hex = hsbToHex(this._colorPicker.hue, this._colorPicker.saturation, this._colorPicker.brightness)
		this._colorPicker.dispatchEvent(new CustomEvent('color-change', { detail: hex }))
	}
	private _keyDown(e: KeyboardEvent) {
		if (e.code === 'Tab' && !e.shiftKey) {
			this._colorPicker.picker.element.focus()
			e.preventDefault()
		}
	}
}
