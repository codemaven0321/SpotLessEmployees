import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { Knex } from 'knex';
import { Record } from 'knex/types/tables';
import { KnexService } from 'src/db/knex.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('employee/records')
export class RecordsController {
	constructor( private knex: KnexService ){}

	@Get()
	@UseGuards(AuthGuard(['employee']))
	async show(@Headers('auth-uid') employee_id, @Query('date') date='', @Query('sort') sort=''){
		const order_by = function(builder: Knex.QueryBuilder<Record>){
			if(sort==='Date (Desc)') builder.orderBy('date', 'desc');
			else if(sort==='Date (Asc)') builder.orderBy('date', 'asc');
			else builder.orderBy('date', 'desc');
		};
		const where = function(builder: Knex.QueryBuilder<Record>){
			if(date) builder.whereRaw(`date >= '${date}T00:00:00' and date < '${date}T23:59:59'`)
		};
		return await this.knex.pg('records').where('employee_id', employee_id).modify(where).modify(order_by);
	}
}
