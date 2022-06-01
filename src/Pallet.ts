import ColorPicker from './ColorPicker'
import { hsbToHex } from './utils'

export default class Pallet {
	public element: HTMLDivElement
	public selected: HTMLInputElement
	constructor(private _colorPicker: ColorPicker, clrs: string[]) {
		this.element = document.createElement('div')
		this.element.classList.add('pallet')
		this._init(clrs)
		this.selected = this.element.querySelector<HTMLInputElement>('input[type="radio"]')!
	}

	private _init(clrs: string[]) {
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
			colorLabel.setAttribute('tabindex', '0')
			colorLabel.addEventListener('keydown', e => {
				if (e.code === 'Space') colorLabel.click()
			})
			colorBtn.addEventListener('click', e => this._clrBtnClick(e))

			this.element.appendChild(colorBtn)
			this.element.appendChild(colorLabel)
			this.selected = this.element.querySelector<HTMLInputElement>('input[type="radio"]')!
			this.selected.checked = true
			this._colorPicker.updateHSB(this.selected.value)
			this._colorPicker.picker.update()
			this._colorPicker.hueRange.update()
			this._colorPicker.hexInput?.update()
		})
	}

	private _clrBtnClick(e: MouseEvent) {
		const target = e.target as HTMLInputElement
		this.selected = target
		this._colorPicker.updateHSB(target.value)
		this._colorPicker.picker.update()
		this._colorPicker.hueRange.update()
		this._colorPicker.hexInput.update()
	}

	public setColors(clrs: string[]) {
		this.element.innerHTML = ''
		this._init(clrs)
	}

	public update() {
		const hex = hsbToHex(this._colorPicker.hue, this._colorPicker.saturation, this._colorPicker.brightness)
		const label = this.element.querySelector<HTMLLabelElement>(`label[for="${this.selected.id}"]`)!
		this.selected.value = hex
		label.style.setProperty('background-color', hex)
	}
	get clrs(): string[] {
		const clrs: string[] = []
		const colorBtns = this.element.querySelectorAll<HTMLInputElement>('.colorBtn')
		colorBtns.forEach(colorBtn => {
			clrs.push(colorBtn.value)
		})
		return clrs
	}
}