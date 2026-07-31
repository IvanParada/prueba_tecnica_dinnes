import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Customer } from '../customers/entities/customers.entity';
import { ServiceRequest } from './entities/service-request.entity';
import { ServiceRequestsService } from './service-requests.service';

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;

  let serviceRequestRepository: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    serviceRequestRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceRequestsService,
        {
          provide: getRepositoryToken(ServiceRequest),
          useValue: serviceRequestRepository,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ServiceRequestsService>(ServiceRequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a service request when it exists', async () => {
      const existingServiceRequest = {
        id: 1,
        number: 'REQ-001',
      } as ServiceRequest;

      serviceRequestRepository.findOne.mockResolvedValue(
        existingServiceRequest,
      );

      const result = await service.findOne(1);

      expect(result).toEqual(existingServiceRequest);

      expect(serviceRequestRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        relations: {
          customer: true,
        },
      });
    });

    it('should throw NotFoundException when the request does not exist', async () => {
      serviceRequestRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Service request with ID 999 was not found'),
      );

      expect(serviceRequestRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
        relations: {
          customer: true,
        },
      });
    });
  });
});
