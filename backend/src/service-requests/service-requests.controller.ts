import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';

import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequestsService } from './service-requests.service';
import { FindServiceRequestsQueryDto } from './dto/find-service-requests-query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Solicitudes')
@Controller('solicitudes')
export class ServiceRequestsController {
    constructor(
        private readonly serviceRequestsService:
            ServiceRequestsService,
    ) { }

    @Post()
    create(
        @Body()
        createServiceRequestDto: CreateServiceRequestDto,
    ) {
        return this.serviceRequestsService.createServiceRequest(
            createServiceRequestDto,
        );
    }

    @Get()
    findAll(
        @Query() queryDto: FindServiceRequestsQueryDto,
    ) {
        return this.serviceRequestsService.findAll(queryDto);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.serviceRequestsService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        updateServiceRequestDto: UpdateServiceRequestDto,
    ) {
        return this.serviceRequestsService.update(
            id,
            updateServiceRequestDto,
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.serviceRequestsService.remove(id);
    }
}