import {Config} from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
	content: [
		'./components/**/*.{vue,js,tsx}',
		'./layouts/**/*.{vue,js,ts,tsx}',
		'./pages/**/*.{vue,js,ts,tsx}',
		'./plugins/**/*.{js,ts,tsx}',
		'./node_modules/flowbite/**/*.js',
		'app.vue'
	],
	darkMode: 'class',
	plugins: [
		daisyui
	],
	daisyui: {
		themes: ['light', 'dark']
	}
}
export default config;
