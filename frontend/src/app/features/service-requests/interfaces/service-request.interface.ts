import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ServiceRequest {
  id: number;
  number: string;
  date: string;
  customer: Customer;
  requestType: RequestType;
  description: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceRequestsResponse {
  data: ServiceRequest[];
  meta: PaginationMeta;
}

export interface ServiceRequestsQuery {
  search?: string;
  status?: RequestStatus;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface SaveServiceRequestRequest {
  number: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  requestType: RequestType;
  description: string;
  status: RequestStatus;
}