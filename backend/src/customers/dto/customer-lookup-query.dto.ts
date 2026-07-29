import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
} from 'class-validator';

export class CustomerLookupQueryDto {
    @ApiProperty({
        example: 'jhon.doe@email.cl',
        description:
            'Correo utilizado para consultar los datos del cliente',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}