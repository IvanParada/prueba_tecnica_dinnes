import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceRequest } from '../service-requests/entities/service-request.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ServiceRequest,
        ]),
    ],
    controllers: [
        DashboardController,
    ],
    providers: [
        DashboardService,
    ],
})
export class DashboardModule {}