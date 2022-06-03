// vite.config.ts
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/lib/index.ts'),
			name: 'color-picker',
			fileName: format => `color-picker.${format}.js`,
		},
	},
})
