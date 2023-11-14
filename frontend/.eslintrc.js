module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	extends: [
		'plugin:nuxt/recommended',
		'plugin:vue/vue3-recommended',
		'@vue/eslint-config-airbnb-with-typescript',
		'prettier'
	],
	rules: {
		indent: [1, 'tab'],
		'no-tabs': 0,
		'vue/multi-word-component-names': [0],
		'@typescript-eslint/naming-convention': [
			'error',
			{ 'selector': 'variable', 'format': ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'] },
			{ 'selector': 'function', 'format': ['camelCase', 'PascalCase'] }
		],
		'@typescript-eslint/no-unused-expressions': 0,
		'quotes': ['error', 'single'],
		'no-restricted-syntax': 0,
		'no-plusplus': 0,
		treatUndefinedAsUnspecified: false
	}
};
