/** base */
const AppName = 'SpotLessEmployees';
const AppUrl  = process.env.AppUrl ?? 'http://localhost:3000';
const AppVersion = 'v2.1.0';
const ApiMain = process.env.ApiMain ?? 'https://';


export default defineNuxtConfig({
	app: {
		head: {
			link:
			[
				{ rel: 'icon', href:'/logo.png'}
			]
		}
	},
	postcss: {
		plugins: {
			'postcss-import': {},
			'tailwindcss/nesting': {},
			tailwindcss: {},
			autoprefixer: {},
		},
	},

	css: [
		'~/assets/css/index.css'
	],

	modules: [
		'@nuxtjs/color-mode',
		'nuxt-icon',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'@nuxtjs/i18n'
	],

	pinia: {
		autoImports: [
			'defineStore',
			'acceptHMRUpdate'
		]
	},

	i18n: {
		experimental: {
			jsTsFormatResource: true
		},
		strategy: 'no_prefix',
		locales: [
			{
				code: 'en',
				name: 'English',
				files: ['en.json']
			},
			{
				code: 'es',
				name: 'Español',
				files: ['es.json']
			},
			{
				code: 'bn',
				name: 'Bangla',
				files: ['bn.json']
			},
			{
				code: 'ar',
				name: 'Arabic',
				files: ['ar.json'],
				dir: 'rtl'
			},
			{
				code: 'zh-CN',
				name: 'Chinese',
				files: ['zh-CN.json']
			}
		],

		lazy: true,
		langDir: 'lang',
		defaultLocale: 'en'
	},

	colorMode: {
		preference: 'system',
		fallback: 'dark',
		hid: 'nuxt-color-mode-script',
		globalName: '__NUXT_COLOR_MODE__',
		componentName: 'ColorScheme',
		classPrefix: '',
		classSuffix: '',
		dataValue: 'theme',
		storageKey: 'nuxt-color-mode'
	},

	runtimeConfig: {
		public: {
			base: {
				AppName,
				AppUrl,
				AppVersion,
				ApiMain
			}
		}
	},

	devtools: {
	 enabled: false
	},
	telemetry: false
})
