import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
	optimizable = ['jpg', 'png', 'webp'];
	categories = {
		profile_img: {
			extensions: ['jpg', 'png', 'webp'],
			maxMiB: 30
		}
	} as const;
	optimize = { quality: 80, sizes: [128, 256, 768, 1280, 2048] } as const;

	ensureDirectory(directory) {
		if (!existsSync(directory)) mkdirSync(directory, { recursive: true });
	}

	/**
	 *
	 * @return {object} {success: true,  data: string}
	 *               		{success: false, error: string}
	 * data: filename
	 * error: 'category' | 'size' | 'extension'
	 * later:
	 * 1. true extension
	 * 2. after optimization, some image becomes larger than original. in this case, use the raw image
	 */
	async add(
		category: keyof typeof this.categories,
		file: Express.Multer.File,
		filename?: string
	): Promise<	{success: false; error: string;} | {success: true; data: string;} > {
		if (!file) return { success: false, error: 'no_file' };
		const c = this.categories[category];
		if (c) {
			// ensure max MiB and extension
			if (Number((file.size / 1048576).toFixed(4)) > c.maxMiB)
				return { success: false, error: 'size' };
			const ext = file.originalname.split('.').pop();
			if (!(c.extensions as unknown as string[]).includes(ext))
				return { success: false, error: 'extension' };
			// filename
			if (!filename) filename = randomUUID();
			filename += `.${ext}`;

			// optimization
			if (this.optimizable.includes(ext)) {
				const img = sharp(file.buffer);
				for (const size of this.optimize.sizes) {
					this.ensureDirectory(`storage/gfs/${category}/${size}`);
					await img
						.clone()
						.resize({ width: size })
						.toFile(`storage/gfs/${category}/${size}/${filename}`);
				}
			}
			this.ensureDirectory(`storage/gfs/${category}`);
			writeFileSync(`storage/gfs/${category}/${filename}`, file.buffer);
			return { success: true, data: filename };
		} else return { success: false, error: 'category' };
	}

	// get file path
	get(category: string, filename: string, size?: number) {
		const c = this.categories[category];
		if (c) {
			const ext = filename.split('.').pop();
			let path = '';

			if (this.optimizable.includes(ext) && size > 0) {
				path = `storage/gfs/${category}/${size}/${filename}`;
				if (existsSync(path)) return path;

				for (const s of this.optimize.sizes)
					if (size < s) {
						path = `storage/gfs/${category}/${s}/${filename}`;
						if (existsSync(path)) return path;
					}
			}

			// use raw file
			path = `storage/gfs/${category}/${filename}`;
			if (existsSync(path)) return path;
		}
		return false;
	}

	remove(category: keyof typeof this.categories, filename: string) {
		const c = this.categories[category];
		if (c) {
			if (existsSync(`storage/gfs/${category}/${filename}`))
				rmSync(`storage/gfs/${category}/${filename}`);

			const ext = filename.split('.').pop();
			if (this.optimizable.includes(ext))
				for (const size of this.optimize.sizes)
					if (existsSync(`storage/gfs/${category}/${size}/${filename}`))
						rmSync(`storage/gfs/${category}/${size}/${filename}`);
		}
	}
}
