import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from './entities/service-request.entity';
import { CustomersModule } from '../clients/customers.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRequest]), CustomersModule],
})
export class ServiceRequestsModule {}
