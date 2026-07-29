import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';

export class CreateServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  number: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customerName: string;

  @IsEmail()
  @MaxLength(150)
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  customerPhone: string;

  @IsEnum(RequestType)
  requestType: RequestType;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;
}