import { APP_PIPE, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {Config} from 'src/config';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const config_service = app.get(ConfigService<Config>);
	app.enableVersioning({
		type: VersioningType.URI,
		prefix: false
	});
	app.use(helmet());
	app.enableCors({
		origin: [
			'http://localhost:3000',
			'http://localhost:3001',
			'https://spotlessemployees.com'
		]
	});

	app.useStaticAssets(join(__dirname, '..', 'public'));

	// port config
	await ConfigModule.envVariablesLoaded;
	const app_port = config_service.get('app_port', {infer: true});
	await app.listen(app_port);
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}

}
bootstrap();
