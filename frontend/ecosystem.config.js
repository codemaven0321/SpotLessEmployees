module.exports = {
	apps: [
		{
			name: 'SpotLessEmployees',
			exec_mode: 'cluster',
			instances: '2',
			script: './.output/server/index.mjs',
			env: {
				NODE_ENV: 'production',
				PORT: 4020,
			}
		}
	]
}
