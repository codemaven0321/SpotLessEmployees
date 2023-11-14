import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Knex } from 'knex';
import { Customer } from 'knex/types/tables';
import { KnexService } from 'src/db/knex.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('customers')
@UseGuards(AuthGuard(['admin']))
export class CustomersController {
	constructor( private knex: KnexService, ){}

	@Get()
	async index(@Query('status') status='', @Query('date') date='', @Query('sort') sort=''){
		const order_by = function(builder: Knex.QueryBuilder<Customer>){
			if(sort==='Date (Desc)') builder.orderBy('date', 'desc');
			else if(sort==='Date (Asc)') builder.orderBy('date', 'asc');
			else builder.orderBy('date', 'asc');
		};
		const where = function(builder: Knex.QueryBuilder<Customer>){
			if(status) builder.where('status', status);
			else builder.whereNotIn('status', ['completed', 'rejected']);
			if(date) builder.whereRaw(`date >= '${date}T00:00:00' and date < '${date}T23:59:59'`)
		};
		const customers = await this.knex.pg('customers').modify(where).modify(order_by);
		for(const customer of customers){
			const records = await this.knex.pg('records').where('records.customer_id', customer.id).join('users', 'users.id', 'records.employee_id').orderBy('users.name', 'asc').select(['users.name', 'users.profile_img', 'records.worked_hour', 'records.hourly_wage', 'records.is_paid']);
			customer.records = records;
		}
		return customers;
	}

	@Get(':id')
	async show(@Param('id', ParseIntPipe) id: number){
		return await this.knex.pg('customers').where('id', id).first() ?? false;
	}

	@Post()
	async create(@Body() body){
		await this.knex.pg('customers').insert({
			name: body.name,
			address: body.address,
			date: JSON.stringify(new Date(body.date)),
			phone: body.phone,
			status: body.status,
			note: body.note,
			updated_at: this.knex.pg.fn.now()
		});
	}

	@Post('/update/:id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() body)
	{
		await this.knex.pg('customers').where('id', id).update({
			name: body.name,
			address: body.address,
			date: JSON.stringify(new Date(body.date)),
			phone: body.phone,
			status: body.status,
			note: body.note,
			updated_at: this.knex.pg.fn.now()
		});
	}

	@Delete(':id')
	async del(@Param('id', ParseIntPipe) id: number){
		await this.knex.pg('customers').where('id', id).del();
	}

}
