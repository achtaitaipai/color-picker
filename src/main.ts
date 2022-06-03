import './lib'
import { ColorPicker } from './lib'
import './style.css'

const pckr = document.querySelector('#pckr') as ColorPicker
const btn = document.querySelector('#colorBtn') as HTMLButtonElement
btn.addEventListener('click', () => pckr.open())

pckr.addEventListener('color-change', ((e: CustomEvent) => {
	console.log(1, e.detail)
}) as EventListener)
