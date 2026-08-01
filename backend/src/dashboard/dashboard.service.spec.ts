import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ServiceRequest } from '../service-requests/entities/service-request.entity';
import { RequestStatus } from '../service-requests/enums/request-status.enum';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  let serviceRequestRepository: {
    count: jest.Mock;
    countBy: jest.Mock;
  };

  beforeEach(async () => {
    serviceRequestRepository = {
      count: jest.fn(),
      countBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(ServiceRequest),
          useValue: serviceRequestRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return the dashboard summary', async () => {
      serviceRequestRepository.count.mockResolvedValue(20);

      serviceRequestRepository.countBy
        .mockResolvedValueOnce(8)
        .mockResolvedValueOnce(7)
        .mockResolvedValueOnce(5);

      const result = await service.getSummary();

      expect(serviceRequestRepository.count).toHaveBeenCalledTimes(1);

      expect(serviceRequestRepository.countBy).toHaveBeenNthCalledWith(1, {
        status: RequestStatus.PENDIENTE,
      });

      expect(serviceRequestRepository.countBy).toHaveBeenNthCalledWith(2, {
        status: RequestStatus.FINALIZADA,
      });

      expect(serviceRequestRepository.countBy).toHaveBeenNthCalledWith(3, {
        status: RequestStatus.EN_PROCESO,
      });

      expect(result).toEqual({
        total: 20,
        pending: 8,
        completed: 7,
        inProgress: 5,
      });
    });

    it('should propagate repository errors', async () => {
      const repositoryError = new Error('Database unavailable');

      serviceRequestRepository.count.mockRejectedValue(repositoryError);

      serviceRequestRepository.countBy.mockResolvedValue(0);

      await expect(service.getSummary()).rejects.toThrow(repositoryError);
    });
  });
});
