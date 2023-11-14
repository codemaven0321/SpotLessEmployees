import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { RecordsModule } from './records/records.module';
import { RouterModule } from '@nestjs/core';

@Module({
  controllers: [EmployeeController],
  imports: [
		RecordsModule
	]
})
export class EmployeeModule {}
