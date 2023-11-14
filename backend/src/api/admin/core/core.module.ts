import { Module } from '@nestjs/common';
import { EmployeesModule } from './employees/employees.module';
import { RouterModule } from '@nestjs/core';
import { RecordsModule } from './records/records.module';
import { CustomersModule } from './customers/customers.module';

@Module({
	imports: [
		EmployeesModule,
		RecordsModule,
		CustomersModule,
		RouterModule.register([
			{ path: 'admin/core', module: EmployeesModule },
			{ path: 'admin/core', module: RecordsModule },
			{ path: 'admin/core', module: CustomersModule },
		]),
	],
})
export class CoreModule {}

