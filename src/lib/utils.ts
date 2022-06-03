//http://data0.eklablog.com/n0f4c3/perso/code%20rgb/colorpicker/colormethods.js
export function rgbToHsb(r: number, g: number, b: number) {
	r /= 255
	g /= 255
	b /= 255

	const hsb = { h: 0, s: 0, b: 0 }

	var min = 0
	var max = 0

	if (r >= g && r >= b) {
		max = r
		min = g > b ? b : g
	} else if (g >= b && g >= r) {
		max = g
		min = r > b ? b : r
	} else {
		max = b
		min = g > r ? r : g
	}

	hsb.b = max
	hsb.s = max ? (max - min) / max : 0

	if (!hsb.s) {
		hsb.h = 0
	} else {
		const delta = max - min
		if (r == max) {
			hsb.h = (g - b) / delta
		} else if (g == max) {
			hsb.h = 2 + (b - r) / delta
		} else {
			hsb.h = 4 + (r - g) / delta
		}

		hsb.h = Math.floor(hsb.h * 60)
		if (hsb.h < 0) {
			hsb.h += 360
		}
	}

	hsb.s = Math.floor(hsb.s * 100)
	hsb.b = Math.floor(hsb.b * 100)

	return hsb
}

export function hsbToHex(h: number, s: number, v: number) {
	let r = 0,
		g = 0,
		b = 0

	if (s == 0) {
		if (v == 0) {
			r = g = b = 0
		} else {
			r = g = b = Math.floor((v * 255) / 100)
		}
	} else {
		if (h == 360) {
			h = 0
		}
		h /= 60

		s = s / 100
		v = v / 100

		var i = Math.floor(h)
		var f = h - i
		var p = v * (1 - s)
		var q = v * (1 - s * f)
		var t = v * (1 - s * (1 - f))
		switch (i) {
			case 0:
				r = v
				g = t
				b = p
				break
			case 1:
				r = q
				g = v
				b = p
				break
			case 2:
				r = p
				g = v
				b = t
				break
			case 3:
				r = p
				g = q
				b = v
				break
			case 4:
				r = t
				g = p
				b = v
				break
			case 5:
				r = v
				g = p
				b = q
				break
		}

		r = Math.floor(r * 255)
		g = Math.floor(g * 255)
		b = Math.floor(b * 255)
	}
	const hex = rgbToHex(r, g, b)

	// return { rgb: [r, g, b], hex }
	return hex
}

export function rgbToHex(r: number, g: number, b: number) {
	return '#' + [r, g, b].map(n => ('0' + n.toString(16)).slice(-2)).join('')
}

export function hexTorgb(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
}

export function hexToHsb(hex: string) {
	const rgb = hexTorgb(hex)
	return rgb ? rgbToHsb(rgb[0], rgb[1], rgb[2]) : null
}

export function isHexClr(str: string) {
	return /(^#[0-9A-F]{6}$)/i.test(str)
}
