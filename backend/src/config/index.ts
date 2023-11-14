import { registerAs } from '@nestjs/config';

function config(){
	return {
		// app
		app_name: process.env.APP_NAME || 'app',
		app_port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 8000,
		app_url:  process.env.APP_URL || 'http://localhost:8000',
		app_frontend_url: process.env.APP_FRONTEND_URL || 'http://localhost:3000',
		// db
		database_url: process.env.DATABASE_URL,
		// misc
		user_guest_account_jwt_secure_key: process.env.USER_GUEST_ACCOUNT_JWT_SECURE_KEY
	}
}


export type Config = ReturnType<typeof config>;

export default registerAs('', ()=>config());
