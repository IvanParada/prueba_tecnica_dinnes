import { Controller, Get, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CustomerLookupQueryDto } from './dto/customer-lookup-query.dto';

@ApiTags('Clientes')
@Controller('clientes')
export class CustomersController {
    constructor(
        private readonly customersService: CustomersService
    ) { }

    @Get('lookup')
    @ApiOperation({ summary: 'Buscar cliente por correo electrónico' })
    @ApiOkResponse({
        description: 'Datos del cliente encontrados',
        schema: {
            example: {
                name: 'Leanne Graham',
                email: 'Sincere@april.biz',
                phone: '1-770-736-8031 x56442',
            },
        },
    })
    @ApiNotFoundResponse({
        description:
            'No existen datos para el correo ingresado',
    })
    @ApiResponse({
        status: 408,
        description:
            'La API externa excedió el tiempo máximo',
    })
    @ApiResponse({
        status: 502,
        description:
            'La API externa no está disponible',
    })
    lookupCustomerByEmail(
        @Query()
        queryDto: CustomerLookupQueryDto) {
        return this.customersService.lookupCustomerByEmail(queryDto.email,);
    }
}
