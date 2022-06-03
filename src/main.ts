import './lib'
import { ColorPicker } from './lib'
import './style.css'

const pckr = document.querySelector('#pckr1') as ColorPicker
const btn = document.querySelector('#color1Btn') as HTMLButtonElement
btn.addEventListener('click', () => pckr.open())

pckr.addEventListener('color-change', ((e: CustomEvent) => {
	console.log(1, e.detail)
}) as EventListener)

const pckr2 = document.querySelector('#pckr2') as ColorPicker
const btn2 = document.querySelector('#color2Btn') as HTMLButtonElement
btn2.addEventListener('click', () => pckr2.open())

pckr2.addEventListener('color-change', ((e: CustomEvent) => {
	console.log(2, e.detail)
}) as EventListener)
