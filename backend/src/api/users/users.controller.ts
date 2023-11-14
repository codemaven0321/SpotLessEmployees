import { Controller, Delete, Get, Headers, Param, Post, Query, UseGuards } from '@nestjs/common';
import { KnexService } from 'src/db/knex.service';
import { verify } from 'argon2';
import { encode, decode } from './jwt';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { hash } from 'argon2';

@Controller('users')
export class UsersController {
	constructor(private knex: KnexService){}

	@Get('login')
	async login(@Query('username') username='', @Query('password') password=''){
		const user = await this.knex.pg('users').where({username}).first('id', 'password', 'usertype');

		// verify the user
		if (user && (await verify(user.password, password))){
			const token = await encode({
				uid: user.id,
				usertype: user.usertype,
				iat: Date.now()
			});

			await this.knex.pg('logins').insert({
				uid: user.id,
				token: token.jwt,
				token_key: token.key,
				updated_at: this.knex.pg.fn.now()
			});
			
			return token.jwt;
		}

		return false;
	}

	@Get('authentication')
	async authentication(@Headers('User-Authorization') token=''){
		if (token) {
			const login = await this.knex.pg('logins').where({token}).first('token_key', 'id');
			if (login && login.token_key) {
				await this.knex.pg('logins').update({
					updated_at: this.knex.pg.fn.now()
				}).where('id', login.id);
				return (await decode(token, login.token_key)) as {
					uid: string;
					created_at: string;
					iat: number;
				};
			}
		}
		return false;
	}

	@Delete('logout')
	async logout(@Headers('User-Authorization') token: string){
		await this.knex.pg('logins').where({token}).del();
	}

	@Get('profile')
	@UseGuards(AuthGuard(['admin', 'employee']))
	async getProfile(@Headers('auth-uid') id:string){
		return await this.knex.pg('users').where('id', id).first('name', 'username', 'profile_img');
	}


	@Post('update_username/:new_username')
	@UseGuards(AuthGuard(['admin', 'employee']))
	async updateUsername(@Headers('auth-uid') id:string, @Param('new_username') new_username: string){
		const is_username_exists = Boolean(await this.knex.pg('users').where('username', new_username).first());
		if(!is_username_exists){
			await this.knex.pg('users').where('id', id).update({username: new_username});
			return true;
		}
		return false;
	}

	@Post('update_password/:password')
	@UseGuards(AuthGuard(['admin', 'employee']))
	async updatePassword(@Headers('auth-uid') id:string, @Param('password') password: string){
		await this.knex.pg('users').where('id', id).update({password: await hash(password)});
	}

}
