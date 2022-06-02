import ColorPicker from './ColorPicker'
import { hsbToHex } from './utils'

export default class Picker {
	public element: HTMLElement
	public cursor: HTMLElement
	constructor(private _colorPicker: ColorPicker, private _onChange: () => void) {
		this.element = document.createElement('div')
		this.element.classList.add('picker')
		this.element.addEventListener('click', e => this._onClick(e))
		this.element.addEventListener('mousemove', e => this._onMove(e))
		this.element.setAttribute('tabindex', '0')

		this.cursor = document.createElement('span')
		this.cursor.classList.add('picker_cursor')
		this.element.appendChild(this.cursor)
		this.element.addEventListener('keydown', e => this._pickerKeyDown(e))
	}

	private _onClick(e: MouseEvent) {
		const { left, top, width, height } = this.element.getBoundingClientRect()
		const x = e.clientX - left
		const y = e.clientY - top
		this.cursor.style.setProperty('left', `${x}px`)
		this.cursor.style.setProperty('top', `${y}px`)
		this._colorPicker.brightness = Math.min(100, Math.max(0, 100 - (y / height) * 100))
		this._colorPicker.saturation = Math.min(100, Math.max(0, (x / width) * 100))
		this._onChange()
	}

	private _onMove(e: MouseEvent) {
		if (e.buttons === 1) {
			const { left, top, width, height } = this.element.getBoundingClientRect()
			const x = Math.min(width, Math.max(0, e.clientX - left))
			const y = Math.min(height, Math.max(0, e.clientY - top))
			this.cursor.style.setProperty('left', `${x}px`)
			this.cursor.style.setProperty('top', `${y}px`)
			this._colorPicker.brightness = Math.min(100, Math.max(0, 100 - (y / height) * 100))
			this._colorPicker.saturation = Math.min(100, Math.max(0, (x / width) * 100))
			this._onChange()
		}
	}

	private _pickerKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowUp':
				this._colorPicker.brightness = Math.min(100, this._colorPicker.brightness + 10)
				this._onChange()
				break
			case 'ArrowDown':
				this._colorPicker.brightness = Math.max(0, this._colorPicker.brightness - 10)
				this._onChange()
				break
			case 'ArrowLeft':
				this._colorPicker.saturation = Math.max(0, this._colorPicker.saturation - 10)
				this._onChange()
				break
			case 'ArrowRight':
				this._colorPicker.saturation = Math.min(100, this._colorPicker.saturation + 10)
				this._onChange()
				break
			case 'Tab':
				if (e.shiftKey) {
					this._colorPicker.shadowRoot?.querySelector<HTMLButtonElement>('.btns_cancel')?.focus()
					e.preventDefault()
				}
				break
		}
		this.update()
	}
	public update() {
		this.element.style.setProperty('background-color', hsbToHex(this._colorPicker.hue, 100, 100))
		const { width, height } = this.element.getBoundingClientRect()
		const x = (this._colorPicker.saturation / 100) * width
		const y = (1 - this._colorPicker.brightness / 100) * height
		this.cursor.style.setProperty('left', `${x}px`)
		this.cursor.style.setProperty('top', `${y}px`)
	}
}
