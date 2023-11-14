import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { KnexService } from 'src/db/knex.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { hash } from 'argon2';

@Controller('employees')

@UseGuards(AuthGuard(['admin']))
export class EmployeesController {
	constructor( private knex: KnexService, ){}

	@Get('')
	async index(@Query('search') search=''){
		return await this.knex.pg('users').where('usertype', 'employee').whereILike('name', `%${search}%`).orderBy('id', 'desc').select('id', 'username', 'created_at', 'updated_at', 'usertype', 'name', 'profile_img');
	}

	@Get(':id')
	async show(@Param('id') id: string){
		return await this.knex.pg('users').where({id, usertype: 'employee'}).first('id', 'username', 'created_at', 'updated_at', 'usertype', 'name', 'profile_img');
	}

	@Post('')
	async create(@Body() body)
	{
		const is_username_exists = Boolean(await this.knex.pg('users').where('username', body.username).first());
		if(!is_username_exists){
			await this.knex.pg('users').insert({
				username: body.username,
				password: await hash(body.password),
				usertype: 'employee',
				name: body.name,
				updated_at: this.knex.pg.fn.now()
			});
			return true;
		}
		return false;
	}

	@Post(':employee_id')
	async update(@Param('employee_id') employee_id: string, @Body() body)
	{
		if('name' in body){
			await this.knex.pg('users').where('id', employee_id).update({
				name: body.name,
				updated_at: this.knex.pg.fn.now()
			});
			return true;
		}
		if('username' in body && body.username){
			const is_username_exists = Boolean(await this.knex.pg('users').where('username', body.username).first());
			if(!is_username_exists){
				await this.knex.pg('users').where('id', employee_id).update({
					username: body.username,
					updated_at: this.knex.pg.fn.now()
				});
				return true;
			}
		}
		if('password' in body && body.password){
			await this.knex.pg('users').where('id', employee_id).update({
				password: await hash(body.password),
				updated_at: this.knex.pg.fn.now()
			});
			return true;
		}
		return false;
	}

	@Delete(':id')
	async destroy(@Param('id') id: string)
	{
		await this.knex.pg('users').where({id, usertype: "employee"}).del();
		await this.knex.pg('records').where('employee_id', id).del();
		await this.knex.pg('logins').where('uid', id).del();
	}

}
