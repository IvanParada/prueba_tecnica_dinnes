import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Customer } from '../../customers/entities/customers.entity';
import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';

@Entity('service_requests')
export class ServiceRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 30,
        unique: true,
    })
    number: string;

    @Index()
    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE',
    })
    date: string;

    @ManyToOne(
        () => Customer,
        (customer) => customer.serviceRequests,
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'customer_id',
    })
    customer: Customer;

    @Column({
        name: 'request_type',
        type: 'enum',
        enum: RequestType,
        enumName: 'request_type_enum',
    })
    requestType: RequestType;

    @Column({
        type: 'text',
    })
    description: string;

    @Index()
    @Column({
        type: 'enum',
        enum: RequestStatus,
        enumName: 'request_status_enum',
        default: RequestStatus.PENDIENTE,
    })
    status: RequestStatus;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt: Date;
}
