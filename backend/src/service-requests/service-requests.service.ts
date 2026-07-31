import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest } from './entities/service-request.entity';
import { Customer } from '../customers/entities/customers.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import {
  DateSortOrder,
  FindServiceRequestsQueryDto,
} from './dto/find-service-requests-query.dto';

@Injectable()
export class ServiceRequestsService {
  private readonly logger = new Logger(ServiceRequestsService.name);

  constructor(
    @InjectRepository(ServiceRequest)
    private readonly serviceRequestRepository: Repository<ServiceRequest>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createServiceRequest(
    dto: CreateServiceRequestDto,
  ): Promise<ServiceRequest> {
    await this.ensureNumberIsAvailable(dto.number);

    const customer = await this.findOrCreateCustomer(
      dto.customerName,
      dto.customerEmail,
      dto.customerPhone,
    );

    const serviceRequest = this.serviceRequestRepository.create({
      number: dto.number.trim().toUpperCase(),
      date: dto.date,
      requestType: dto.requestType,
      description: dto.description.trim(),
      status: dto.status,
      customer,
    });

    return this.serviceRequestRepository.save(serviceRequest);
  }

  async update(
    id: number,
    dto: UpdateServiceRequestDto,
  ): Promise<ServiceRequest> {
    const serviceRequest = await this.findOne(id);

    if (
      dto.number !== undefined &&
      dto.number.trim() !== serviceRequest.number
    ) {
      await this.ensureNumberIsAvailable(dto.number);
    }

    if (this.hasCustomerChanges(dto)) {
      serviceRequest.customer = await this.resolveCustomerForUpdate(
        serviceRequest.customer,
        dto,
      );
    }

    this.serviceRequestRepository.merge(serviceRequest, {
      number: dto.number !== undefined ? dto.number.trim() : undefined,

      date: dto.date,

      requestType: dto.requestType,

      description:
        dto.description !== undefined ? dto.description.trim() : undefined,

      status: dto.status,
    });

    return this.serviceRequestRepository.save(serviceRequest);
  }

  async remove(id: number): Promise<void> {
    const result = await this.serviceRequestRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(
        `Service request with ID ${id} was not found`,
      );
    }
  }

  async findAll(queryDto: FindServiceRequestsQueryDto) {
    try {
      const {
        search,
        status,
        sortOrder = DateSortOrder.DESC,
        page = 1,
        limit = 10,
      } = queryDto;

      const query = this.serviceRequestRepository
        .createQueryBuilder('request')
        .leftJoinAndSelect('request.customer', 'customer');

      if (search?.trim()) {
        query.andWhere(
          `(
          request.number ILIKE :search
          OR request.description ILIKE :search
          OR customer.name ILIKE :search
          OR customer.email ILIKE :search
          OR customer.phone ILIKE :search
        )`,
          {
            search: `%${search.trim()}%`,
          },
        );
      }

      if (status) {
        query.andWhere('request.status = :status', {
          status,
        });
      }

      query
        .orderBy('request.date', sortOrder)
        .addOrderBy('request.id', sortOrder)
        .skip((page - 1) * limit)
        .take(limit);

      const [data, total] = await query.getManyAndCount();

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(
        'Failed to retrieve service requests',
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException(
        'Unable to retrieve service requests',
      );
    }
  }

  async findOne(id: number): Promise<ServiceRequest> {
    const serviceRequest = await this.serviceRequestRepository.findOne({
      where: { id },
      relations: {
        customer: true,
      },
    });

    if (!serviceRequest) {
      throw new NotFoundException(
        `Service request with ID ${id} was not found`,
      );
    }

    return serviceRequest;
  }

  private hasCustomerChanges(dto: UpdateServiceRequestDto): boolean {
    return [dto.customerName, dto.customerEmail, dto.customerPhone].some(
      (value) => value !== undefined,
    );
  }

  private async resolveCustomerForUpdate(
    currentCustomer: Customer,
    updateServiceRequestDto: UpdateServiceRequestDto,
  ): Promise<Customer> {
    const name = updateServiceRequestDto.customerName ?? currentCustomer.name;

    const email =
      updateServiceRequestDto.customerEmail ?? currentCustomer.email;

    const phone =
      updateServiceRequestDto.customerPhone ?? currentCustomer.phone;

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== currentCustomer.email) {
      return this.findOrCreateCustomer(name, normalizedEmail, phone);
    }

    currentCustomer.name = name.trim();
    currentCustomer.phone = phone.trim();

    return this.customerRepository.save(currentCustomer);
  }

  private async findOrCreateCustomer(
    name: string,
    email: string,
    phone: string,
  ): Promise<Customer> {
    const customerData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    };

    const existingCustomer = await this.customerRepository.findOneBy({
      email: customerData.email,
    });

    const customer = existingCustomer
      ? this.customerRepository.merge(existingCustomer, customerData)
      : this.customerRepository.create(customerData);

    return this.customerRepository.save(customer);
  }

  private async ensureNumberIsAvailable(number: string): Promise<void> {
    const normalizedNumber = number.trim().toUpperCase();

    const exists = await this.serviceRequestRepository.exists({
      where: {
        number: normalizedNumber,
      },
    });

    if (exists) {
      throw new ConflictException(
        `Service request number ${normalizedNumber} already exists`,
      );
    }
  }
}
