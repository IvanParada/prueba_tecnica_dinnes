import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ServiceRequest } from '../service-requests/entities/service-request.entity';
import { RequestStatus } from '../service-requests/enums/request-status.enum';

export interface DashboardSummary {
    total: number;
    pending: number;
    completed: number;
    inProgress: number;
}

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(ServiceRequest)
        private readonly serviceRequestRepository:
            Repository<ServiceRequest>,
    ) { }

    async getSummary(): Promise<DashboardSummary> {
        const [
            total,
            pending,
            completed,
            inProgress,
        ] = await Promise.all([
            this.serviceRequestRepository.count(),

            this.serviceRequestRepository.countBy({
                status: RequestStatus.PENDIENTE,
            }),

            this.serviceRequestRepository.countBy({
                status: RequestStatus.FINALIZADA,
            }),

            this.serviceRequestRepository.countBy({
                status: RequestStatus.EN_PROCESO,
            }),
        ]);

        return {
            total,
            pending,
            completed,
            inProgress,
        };
    }
}