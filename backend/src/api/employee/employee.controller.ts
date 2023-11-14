import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { KnexService } from 'src/db/knex.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('employee')
export class EmployeeController {
	constructor( private knex: KnexService ){}
}
