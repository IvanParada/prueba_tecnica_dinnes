import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  HttpException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CustomerLookup } from './interfaces/customer-lookup.interface';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CustomersService {
  private readonly apiUrl =
    process.env.CUSTOMERS_API_URL ||
    'https://jsonplaceholder.typicode.com/users';
  private readonly apiTimeout = parseInt(
    process.env.CUSTOMER_API_TIMEOUT || '3000',
    10,
  );

  constructor(private readonly httpService: HttpService) {}

  async lookupCustomerByEmail(email: string): Promise<CustomerLookup> {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<CustomerLookup[]>(this.apiUrl, {
          timeout: this.apiTimeout,
        }),
      );
      const customer = data.find(
        (c) => c.email.trim().toLowerCase() === normalizedEmail,
      );

      if (!customer) {
        throw new NotFoundException(
          'No existen datos para el correo ingresado',
        );
      }
      return {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (
        isAxiosError(error) &&
        (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT')
      ) {
        throw new RequestTimeoutException(
          'La consulta de clientes excedió el tiempo máximo',
        );
      }

      throw new BadGatewayException(
        'El servicio externo de clientes no está disponible',
      );
    }
  }
}
