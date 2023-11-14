import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, {Knex} from 'knex';
import { Config } from '../config';


declare module 'knex/types/tables' {
	interface Record {
		id: string
		employee_id: string
		customer_id: number
		address: string
		date: string
		worked_hour: number
		hourly_wage: number
		is_paid: number
		note: string
		created_at: string
		updated_at: string
	}

	interface Customer {
		id: number
		name: string
		address: string
		date: string
		phone: string
		status: string
		note: string
		created_at: string
		updated_at: string
	}

	interface Login {
		id: number
		uid: string
		token: string
		token_key: string
		created_at: string
		updated_at: string
	}

	interface User {
		id: string
		username: string
		password: string
		usertype: 'admin'|'employee'
		name: string
		profile_img?: string
		created_at: string
		updated_at: string
	}

	interface Tables {
		records: Record
		customers: Customer
		logins: Login
		users: User
	}
}

@Injectable()
export class KnexService {
	pg: Knex<any, unknown[]>;
	constructor(private config: ConfigService<Config>) {
		this.pg = knex({
			client: 'pg',
			connection: this.config.get<string>('database_url')
		})
	}
}
