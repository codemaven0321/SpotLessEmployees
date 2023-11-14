import {
	Controller,
	Get,
	Headers,
	HttpCode,
	Param,
	Post,
	Query,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { FileService } from './file.service';
import type { Response } from 'express';
import { join } from 'path';
import { KnexService } from 'src/db/knex.service';

@Controller('file')
export class FileController {
	constructor(
		private file_service: FileService,
		private knex: KnexService
	) {}

	@Post('profile_img')
	@UseGuards(AuthGuard(['admin', 'employee']))
	@UseInterceptors(FileInterceptor('file'))
	async storeProfileImg(
		@Headers('auth-uid') auth_uid: string,
		@Headers('auth-usertype') auth_usertype: string,
		@Query('uid') query_uid: string,
		@UploadedFile() file: Express.Multer.File
	) {
		const result = await this.file_service.add('profile_img', file);
		if (result.success) {
			let uid = auth_uid;
			if(auth_usertype==='admin' && query_uid) uid = query_uid;

			// remove old file
			const { profile_img } = await this.knex.pg('users').where('id', uid).first('profile_img');
			if (profile_img) this.file_service.remove('profile_img', profile_img);

			// update profile_img
			await this.knex.pg('users').where('id', uid).update({
				profile_img: result.data,
				updated_at: this.knex.pg.fn.now()
			});
		}
		return result;
	}

	/**
	 * get image
	 */
	@Get(':category/:filename')
	@HttpCode(200)
	show(
		@Res() res: Response,
		@Param('category') category='',
		@Param('filename') filename='',
		@Query('size') size
	) {
		category = category.trim();
		filename = filename.trim();

		const path = this.file_service.get(category, filename, size);
		res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
		res.setHeader('Cross-Origin-Opener-Policy', 'same-site');
		res.statusCode = 200;
		if (path) return res.sendFile(join(__dirname, '..', path));

		return res.json(false);
	}
}
