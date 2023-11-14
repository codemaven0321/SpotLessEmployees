module.exports = {
	apps: [
		{
			name: 'spotlessemployees_api',
			exec_mode: 'cluster',
			instances: '1',
			script: './dist/main.js',
			env: {
				NODE_ENV: 'production'
			}
		}
	]
}
