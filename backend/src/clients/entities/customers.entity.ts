import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ServiceRequest } from '../../service-requests/entities/service-request.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
  })
  name: string;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 150,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  phone: string;

  @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest.customer)
  serviceRequests: ServiceRequest[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
