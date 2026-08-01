import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customers.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), HttpModule],
  exports: [TypeOrmModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
