import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { RequestStatus } from '../enums/request-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum DateSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FindServiceRequestsQueryDto {
  @ApiPropertyOptional({
    example: 'Juan',
    description:
      'Busca por número, descripción, nombre, correo o teléfono',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: RequestStatus,
    example: RequestStatus.PENDIENTE,
  })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @ApiPropertyOptional({
    enum: DateSortOrder,
    default: DateSortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(DateSortOrder)
  sortOrder: DateSortOrder = DateSortOrder.DESC;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}