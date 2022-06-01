import ColorPicker from './ColorPicker'
import './style.css'

customElements.define('color-picker', ColorPicker)

const pckr = document.querySelector('color-picker') as ColorPicker
const btn = document.querySelector('#colorBtn') as HTMLButtonElement
btn.addEventListener('click', () => pckr.open())
pckr.addEventListener('color-change', ((e: CustomEvent) => {
	console.log(e.detail)
}) as EventListener)
