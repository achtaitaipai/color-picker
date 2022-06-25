import { ColorPicker } from '.'
import { hsbToHex } from './utils'

export default class Pallet {
	public element: HTMLDivElement
	public selected: HTMLInputElement

	constructor(private _colorPicker: ColorPicker, clrs: string[], private _onChange: (hex: string) => void) {
		this.element = document.createElement('div')
		this.element.classList.add('pallet')
		this._init(clrs)
		this.selected = this.element.querySelector<HTMLInputElement>('input[type="radio"]')!
	}

	private _init(clrs: string[]) {
		const selected = this.element.querySelector<HTMLInputElement>('input:checked')
		this.element.innerHTML = ''

		clrs.forEach((clr, i) => {
			const colorBtn = document.createElement('input')
			colorBtn.setAttribute('type', 'radio')
			colorBtn.setAttribute('name', 'color')
			colorBtn.setAttribute('value', clr)
			colorBtn.id = `clrBtn-${i}`
			colorBtn.classList.add('colorBtn')
			const colorLabel = document.createElement('label')
			colorLabel.setAttribute('for', `clrBtn-${i}`)
			colorLabel.classList.add('colorLabel')
			colorLabel.style.backgroundColor = clr
			colorLabel.setAttribute('tabindex', '0')
			colorLabel.addEventListener('keydown', e => {
				if (e.code === 'Space') colorLabel.click()
			})
			colorBtn.addEventListener('click', e => this._clrBtnClick(e))

			this.element.appendChild(colorBtn)
			this.element.appendChild(colorLabel)
		})

		const toSelect = selected ? this.element.querySelector<HTMLInputElement>(`#${selected.id}`) : null
		if (toSelect) {
			this.selected = toSelect
			if (this.selected) this.selected.checked = true
		} else {
			this.selected = selected || this.element.querySelector<HTMLInputElement>('input[type="radio"]')!
			this.selected.checked = true
		}
		this._onChange(this.selected.value)
	}

	private _clrBtnClick(e: MouseEvent) {
		const target = e.target as HTMLInputElement
		this.selected = target
		this._onChange(target.value)
	}

	public setColors(clrs: string[]) {
		this._init(clrs)
	}

	public update() {
		const hex = hsbToHex(this._colorPicker.hue, this._colorPicker.saturation, this._colorPicker.brightness)
		const label = this.element.querySelector<HTMLLabelElement>(`label[for="${this.selected.id}"]`)
		this.selected.value = hex
		if (label) label.style.setProperty('background-color', hex)
	}
	get clrs(): string[] {
		const clrs: string[] = []
		const colorBtns = this.element.querySelectorAll<HTMLInputElement>('.colorBtn')
		colorBtns.forEach(colorBtn => {
			clrs.push(colorBtn.value)
		})
		return clrs ?? []
	}

	set clrs(clrs: string[]) {
		this.element.innerHTML = ''
		this._init(clrs)
	}
}
