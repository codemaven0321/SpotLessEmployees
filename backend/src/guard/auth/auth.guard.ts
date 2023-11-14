import { CanActivate, ExecutionContext, Inject, mixin } from '@nestjs/common';
import { Request } from 'express';
import { KnexService } from 'src/db/knex.service';
import { decode } from 'src/api/users/jwt';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthGuard = (
	usertypes: Array<'admin' | 'employee'>
) => {
	class AuthGuardMixin implements CanActivate {
		constructor(
			@Inject(KnexService) public knex: KnexService
		) {}
		async main( token: string): Promise<false | { uid: string; created_at: string; iat: number }> {
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
		async canActivate(context: ExecutionContext) {
			const req: Request = context.switchToHttp().getRequest();

			req.headers['auth-uid'] = '';
			req.headers['auth-usertype'] = '';

			let token = req.headers['user-authorization'] as string;
			if (!token) token = req.query['user-authorization'] as string;

			if (token && typeof token === 'string') {
				const r = await this.main(token);

				if (r) {
					const info = await this.knex.pg('users').where('id', r.uid).first('usertype');
					if (usertypes.includes(info.usertype)) {
						req.headers['auth-uid'] = r.uid;
						req.headers['auth-usertype'] = info.usertype;
						return true;
					}
				}
			}
			return false;
		}
	}

	const guard = mixin(AuthGuardMixin);
	return guard;
};

// @Injectable()
