import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Knex } from 'knex';
import { Record } from 'knex/types/tables';
import { KnexService } from 'src/db/knex.service';

@Controller('records')
export class RecordsController {
	constructor( private knex: KnexService){}

	@Get(':employee_id')
	async index(@Param('employee_id') employee_id: string, @Query('date') date='', @Query('sort') sort='', @Query('customer_id') customer_id=''){
		const order_by = function(builder: Knex.QueryBuilder<Record>){
			if(sort==='Date (Desc)') builder.orderBy('date', 'desc');
			else if(sort==='Date (Asc)') builder.orderBy('date', 'asc');
			else builder.orderBy('date', 'desc');
		};
		const where = function(builder: Knex.QueryBuilder<Record>){
			if(date) builder.whereRaw(`date >= '${date}T00:00:00' and date < '${date}T23:59:59'`)
			if(customer_id==='none') builder.where('customer_id', null);
		};
		return await this.knex.pg('records').where('employee_id', employee_id).modify(where).modify(order_by);
	}

	@Get('show/:record_id')
	async show(@Param('record_id') record_id: string){
		return await this.knex.pg('records').where('id', record_id).first();
	}

	@Post(':employee_id')
	async create(@Param('employee_id') employee_id: string, @Body() body)
	{
		const data = await this.knex.pg('records').insert({
			employee_id,
			address: body.address,
			date: JSON.stringify(new Date(body.date)),
			worked_hour: body.worked_hour,
			hourly_wage: body.hourly_wage,
			is_paid: body.is_paid,
			customer_id: body.customer_id || null,
			note: body.note,
			updated_at: this.knex.pg.fn.now()
		}).returning('id');
		return data[0].id;
	}

	@Post('/update/:record_id')
	async update(@Param('record_id') record_id: string, @Body() body)
	{
		const data = await this.knex.pg('records').where('id', record_id).update({
			address: body.address,
			date: JSON.stringify(new Date(body.date)),
			worked_hour: body.worked_hour,
			hourly_wage: body.hourly_wage,
			is_paid: body.is_paid,
			customer_id: body.customer_id || null,
			note: body.note,
			updated_at: this.knex.pg.fn.now()
		});
	}

	@Delete(':id')
	async del(@Param('id') id: string)
	{
		await this.knex.pg('records').where('id', id).del();
	}
}
