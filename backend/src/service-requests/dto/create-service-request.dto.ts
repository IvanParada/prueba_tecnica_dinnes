import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceRequestDto {
  @ApiProperty({
    example: 'SOL-001',
    description: 'Número único de la solicitud',
    maxLength: 30,
  })
  @Matches(/^SOL-\d{1,10}$/i, {
    message: 'El número debe tener el formato SOL-000001',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  number: string;

  @ApiProperty({
    example: '2026-07-28',
    description: 'Fecha de la solicitud',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customerName: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  @MaxLength(150)
  customerEmail: string;

  @ApiProperty({
    example: '+56912345678',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  customerPhone: string;

  @ApiProperty({
    enum: RequestType,
    example: RequestType.SOPORTE_TECNICO,
  })
  @IsEnum(RequestType)
  requestType: RequestType;

  @ApiProperty({
    example:
      'El cliente presenta problemas para ingresar al sistema.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(2000)
  description: string;

  @ApiProperty({
    enum: RequestStatus,
    example: RequestStatus.PENDIENTE,
  })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;
}