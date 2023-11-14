import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import config from './config';
import { KnexModule } from './db/knex.module';
import { UsersModule } from './api/users/users.module';
import { AdminModule } from './api/admin/admin.module';
import { EmployeeModule } from './api/employee/employee.module';
import { FileModule } from './api/file/file.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			expandVariables: true,
			load: [config]
		}),
		ThrottlerModule.forRoot([{
			ttl: 60000,
			limit: 1000
		}]),
		// app:start
		// app:end
		KnexModule,
		UsersModule,
		AdminModule,
		EmployeeModule,
		FileModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
