import { Controller, Get, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import {z} from 'zod';
import { Config } from 'src/config';
import { KnexService } from './db/knex.service';
import { hash } from 'argon2';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private knex: KnexService,
		private config: ConfigService<Config>
		// private I18n: I18nContext
	) {}

	@Get('status')
	async status(@Query('page') page, @Query('per_page') per_page) {
		console.log('hi');
		// await this.knex.pg('users').insert({
		// 	username: 'wife',
		// 	password: await hash('husband'),
		// 	created_at: this.knex.pg.fn.now(),
		// 	updated_at: this.knex.pg.fn.now()
		// }).returning('id');
	}


	@Get()
	getHello(@Res() res: Response) {
		return res.redirect(this.config.get<string>('app_frontend_url'));
	}
}
