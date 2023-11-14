module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking'
	],
  // plugins: ['@typescript-eslint/eslint-plugin'],
  plugins: ['@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
    // project: 'tsconfig.json',
    project: true,
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
		// indent: [1, 'tab'],
		indent: ['warn', 'tab', {
			'SwitchCase': 1
		}],
		'@typescript-eslint/naming-convention': [
			'warn',
			{ 'selector': 'variableLike', 'format': ['snake_case', 'camelCase', 'uppercase'], 'leadingUnderscore': 'allow', 'trailingUnderscore': 'allow' },
			{ 'selector': 'property', 'format': ['snake_case', 'camelCase'], 'leadingUnderscore': 'allow', 'trailingUnderscore': 'allow' },
			{ 'selector': 'method', 'format': ['camelCase'] },
			{ 'selector': 'typeLike', 'format': ['PascalCase'] }
		],
		quotes: ['error', 'single'],
		// nest specific
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
    // '@typescript-eslint/interface-name-prefix': 'off',
    // '@typescript-eslint/explicit-function-return-type': 'off',
    // '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  }
};
