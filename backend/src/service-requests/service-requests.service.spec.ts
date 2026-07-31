import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Customer } from '../customers/entities/customers.entity';
import { ServiceRequest } from './entities/service-request.entity';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { RequestStatus } from './enums/request-status.enum';
import { RequestType } from './enums/request-type.enum';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;

  let serviceRequestRepository: {
    findOne: jest.Mock;
    exists: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
    merge: jest.Mock;
  };

  let customerRepository: {
    findOneBy: jest.Mock;
    create: jest.Mock;
    merge: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    serviceRequestRepository = {
      findOne: jest.fn(),
      exists: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      merge: jest.fn(),
    };

    customerRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      merge: jest.fn(),
      save: jest.fn(),
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
          useValue: customerRepository,
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

  describe('createServiceRequest', () => {
    const requestType = Object.values(RequestType)[0];
    const requestStatus = Object.values(RequestStatus)[0];

    const createDto: CreateServiceRequestDto = {
      number: ' req-002 ',
      date: '2026-07-31',
      customerName: ' Cliente de prueba ',
      customerEmail: 'CLIENTE@EJEMPLO.CL ',
      customerPhone: ' 912345678 ',
      requestType,
      description: ' Solicitud creada desde una prueba ',
      status: requestStatus,
    };

    it('should create and save a service request', async () => {
      const customer = {
        id: 1,
        name: 'Cliente de prueba',
        email: 'cliente@ejemplo.cl',
        phone: '912345678',
      } as Customer;

      const unsavedServiceRequest = {
        number: 'REQ-002',
        date: createDto.date,
        requestType,
        description: 'Solicitud creada desde una prueba',
        status: requestStatus,
        customer,
      } as ServiceRequest;

      const savedServiceRequest = {
        ...unsavedServiceRequest,
        id: 2,
      };

      serviceRequestRepository.exists.mockResolvedValue(false);
      customerRepository.findOneBy.mockResolvedValue(null);
      customerRepository.create.mockReturnValue(customer);
      customerRepository.save.mockResolvedValue(customer);
      serviceRequestRepository.create.mockReturnValue(unsavedServiceRequest);
      serviceRequestRepository.save.mockResolvedValue(savedServiceRequest);

      const result = await service.createServiceRequest(createDto);

      expect(serviceRequestRepository.exists).toHaveBeenCalledWith({
        where: {
          number: 'REQ-002',
        },
      });

      expect(customerRepository.findOneBy).toHaveBeenCalledWith({
        email: 'cliente@ejemplo.cl',
      });

      expect(customerRepository.create).toHaveBeenCalledWith({
        name: 'Cliente de prueba',
        email: 'cliente@ejemplo.cl',
        phone: '912345678',
      });

      expect(serviceRequestRepository.create).toHaveBeenCalledWith({
        number: 'REQ-002',
        date: createDto.date,
        requestType,
        description: 'Solicitud creada desde una prueba',
        status: requestStatus,
        customer,
      });

      expect(serviceRequestRepository.save).toHaveBeenCalledWith(
        unsavedServiceRequest,
      );

      expect(result).toEqual(savedServiceRequest);
    });

    it('should throw ConflictException when the number already exists', async () => {
      serviceRequestRepository.exists.mockResolvedValue(true);

      await expect(service.createServiceRequest(createDto)).rejects.toThrow(
        ConflictException,
      );

      expect(serviceRequestRepository.exists).toHaveBeenCalledWith({
        where: {
          number: 'REQ-002',
        },
      });

      expect(customerRepository.findOneBy).not.toHaveBeenCalled();
      expect(serviceRequestRepository.create).not.toHaveBeenCalled();
      expect(serviceRequestRepository.save).not.toHaveBeenCalled();
    });

    it('should reuse and update an existing customer', async () => {
      const existingCustomer = {
        id: 10,
        name: 'Nombre anterior',
        email: 'cliente@ejemplo.cl',
        phone: '900000000',
      } as Customer;

      const updatedCustomer = {
        ...existingCustomer,
        name: 'Cliente de prueba',
        phone: '912345678',
      };

      const unsavedServiceRequest = {
        number: 'REQ-002',
        date: createDto.date,
        requestType,
        description: 'Solicitud creada desde una prueba',
        status: requestStatus,
        customer: updatedCustomer,
      } as ServiceRequest;

      const savedServiceRequest = {
        ...unsavedServiceRequest,
        id: 3,
      };

      serviceRequestRepository.exists.mockResolvedValue(false);

      customerRepository.findOneBy.mockResolvedValue(existingCustomer);

      customerRepository.merge.mockReturnValue(updatedCustomer);
      customerRepository.save.mockResolvedValue(updatedCustomer);

      serviceRequestRepository.create.mockReturnValue(unsavedServiceRequest);

      serviceRequestRepository.save.mockResolvedValue(savedServiceRequest);

      const result = await service.createServiceRequest(createDto);

      expect(customerRepository.findOneBy).toHaveBeenCalledWith({
        email: 'cliente@ejemplo.cl',
      });

      expect(customerRepository.merge).toHaveBeenCalledWith(existingCustomer, {
        name: 'Cliente de prueba',
        email: 'cliente@ejemplo.cl',
        phone: '912345678',
      });

      expect(customerRepository.create).not.toHaveBeenCalled();

      expect(customerRepository.save).toHaveBeenCalledWith(updatedCustomer);

      expect(serviceRequestRepository.create).toHaveBeenCalledWith({
        number: 'REQ-002',
        date: createDto.date,
        requestType,
        description: 'Solicitud creada desde una prueba',
        status: requestStatus,
        customer: updatedCustomer,
      });

      expect(result).toEqual(savedServiceRequest);
    });
  });

  describe('remove', () => {
    it('should delete a service request', async () => {
      serviceRequestRepository.delete.mockResolvedValue({
        affected: 1,
      });

      await expect(service.remove(1)).resolves.toBeUndefined();

      expect(serviceRequestRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when no request was deleted', async () => {
      serviceRequestRepository.delete.mockResolvedValue({
        affected: 0,
      });

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Service request with ID 999 was not found'),
      );

      expect(serviceRequestRepository.delete).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a service request without changing the customer', async () => {
      const status = Object.values(RequestStatus)[1];

      const customer = {
        id: 1,
        name: 'Cliente de prueba',
        email: 'cliente@ejemplo.cl',
        phone: '912345678',
      } as Customer;

      const existingServiceRequest = {
        id: 1,
        number: 'REQ-001',
        description: 'Descripción anterior',
        status: Object.values(RequestStatus)[0],
        customer,
      } as ServiceRequest;

      const updateDto: UpdateServiceRequestDto = {
        description: ' Descripción actualizada ',
        status,
      };

      const updatedServiceRequest = {
        ...existingServiceRequest,
        description: 'Descripción actualizada',
        status,
      };

      serviceRequestRepository.findOne.mockResolvedValue(
        existingServiceRequest,
      );

      serviceRequestRepository.merge.mockImplementation(
        (entity: ServiceRequest, data: Partial<ServiceRequest>) => {
          Object.assign(entity, data);
          return entity;
        },
      );

      serviceRequestRepository.save.mockResolvedValue(updatedServiceRequest);

      const result = await service.update(1, updateDto);

      expect(serviceRequestRepository.merge).toHaveBeenCalledWith(
        existingServiceRequest,
        {
          number: undefined,
          date: undefined,
          requestType: undefined,
          description: 'Descripción actualizada',
          status,
        },
      );

      expect(customerRepository.findOneBy).not.toHaveBeenCalled();
      expect(customerRepository.save).not.toHaveBeenCalled();

      expect(serviceRequestRepository.save).toHaveBeenCalledWith(
        existingServiceRequest,
      );

      expect(result).toEqual(updatedServiceRequest);
    });

    it('should throw ConflictException when updating to an existing number', async () => {
      const customer = {
        id: 1,
        name: 'Cliente de prueba',
        email: 'cliente@ejemplo.cl',
        phone: '912345678',
      } as Customer;

      const existingServiceRequest = {
        id: 1,
        number: 'REQ-001',
        description: 'Descripción actual',
        customer,
      } as ServiceRequest;

      const updateDto: UpdateServiceRequestDto = {
        number: ' req-002 ',
      };

      serviceRequestRepository.findOne.mockResolvedValue(
        existingServiceRequest,
      );

      serviceRequestRepository.exists.mockResolvedValue(true);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        ConflictException,
      );

      expect(serviceRequestRepository.exists).toHaveBeenCalledWith({
        where: {
          number: 'REQ-002',
        },
      });

      expect(serviceRequestRepository.merge).not.toHaveBeenCalled();
      expect(serviceRequestRepository.save).not.toHaveBeenCalled();
      expect(customerRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should update the current customer when the email remains the same', async () => {
      const customer = {
        id: 1,
        name: 'Nombre anterior',
        email: 'cliente@ejemplo.cl',
        phone: '900000000',
      } as Customer;

      const existingServiceRequest = {
        id: 1,
        number: 'REQ-001',
        description: 'Descripción actual',
        customer,
      } as ServiceRequest;

      const updateDto: UpdateServiceRequestDto = {
        customerName: ' Cliente actualizado ',
        customerEmail: 'CLIENTE@EJEMPLO.CL ',
        customerPhone: ' 912345678 ',
      };

      serviceRequestRepository.findOne.mockResolvedValue(
        existingServiceRequest,
      );

      customerRepository.save.mockImplementation((customerToSave: Customer) =>
        Promise.resolve(customerToSave),
      );

      serviceRequestRepository.merge.mockImplementation(
        (entity: ServiceRequest, data: Partial<ServiceRequest>) => {
          Object.assign(entity, data);
          return entity;
        },
      );

      serviceRequestRepository.save.mockImplementation(
        (requestToSave: ServiceRequest) => Promise.resolve(requestToSave),
      );

      const result = await service.update(1, updateDto);

      expect(customerRepository.findOneBy).not.toHaveBeenCalled();
      expect(customerRepository.create).not.toHaveBeenCalled();
      expect(customerRepository.merge).not.toHaveBeenCalled();

      expect(customerRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: 'Cliente actualizado',
          email: 'cliente@ejemplo.cl',
          phone: '912345678',
        }),
      );

      expect(serviceRequestRepository.save).toHaveBeenCalledWith(
        existingServiceRequest,
      );

      expect(result.customer).toEqual(
        expect.objectContaining({
          id: 1,
          name: 'Cliente actualizado',
          email: 'cliente@ejemplo.cl',
          phone: '912345678',
        }),
      );
    });
  });
});
