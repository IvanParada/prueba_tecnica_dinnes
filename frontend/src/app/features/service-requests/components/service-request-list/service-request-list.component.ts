import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { PaginationMeta, ServiceRequest } from '../../interfaces/service-request.interface';
import { ServiceRequestsService } from '../../services/service-request.service';
import { finalize, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestStatus } from '../../enums/request-status.enum';
import ServiceRequestFormModalComponent from '../service-request-form-modal/service-request-form-modal.component';

@Component({
  selector: 'app-service-request-list',
  imports: [ServiceRequestFormModalComponent],
  templateUrl: './service-request-list.component.html',
})
export default class ServiceRequestList implements OnInit {

  private readonly serviceRequestsService = inject(ServiceRequestsService);

  readonly requests = signal<ServiceRequest[]>([]);
  readonly pagination = signal<PaginationMeta | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly search = signal('');
  readonly selectedStatus = signal<RequestStatus | ''>('');
  readonly sortOrder = signal<'ASC' | 'DESC'>('DESC');
  readonly currentPage = signal(1);
  readonly pageSize = signal(8);

  readonly requestStatuses = Object.values(RequestStatus);

  readonly isFormModalOpen = signal(false);
  readonly selectedRequest = signal<ServiceRequest | null>(null);

  readonly requestsChanged = output<void>();

  readonly processingRequestId = signal<number | null>(null);
  readonly requestStatus = RequestStatus;

  readonly actionErrorMessage = signal<string | null>(null);

  readonly finalStatus = RequestStatus.FINALIZADA;

  readonly canGoPrevious = computed(
    () => this.currentPage() > 1,
  );

  readonly canGoNext = computed(() => {
    const pagination = this.pagination();

    return (
      pagination !== null &&
      this.currentPage() < pagination.totalPages
    );
  });


  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.serviceRequestsService
      .getAll({
        search: this.search().trim() || undefined,
        status: this.selectedStatus() || undefined,
        sortOrder: this.sortOrder(),
        page: this.currentPage(),
        limit: this.pageSize(),
      })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.requests.set(response.data);
          this.pagination.set(response.meta);
          this.currentPage.set(response.meta.page);
        },
        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to retrieve service requests:',
            error,
          );

          if (error.status === 0) {
            this.errorMessage.set(
              'No se pudo conectar con el servidor.',
            );
            return;
          }

          this.errorMessage.set(
            'No se pudieron cargar las solicitudes.',
          );
        },
      });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.search.set(input.value);
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedStatus.set(
      select.value as RequestStatus | '',
    );

    this.currentPage.set(1);
    this.loadRequests();
  }

  onSortOrderChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.sortOrder.set(
      select.value as 'ASC' | 'DESC',
    );

    this.currentPage.set(1);
    this.loadRequests();
  }

  applySearch(): void {
    this.currentPage.set(1);
    this.loadRequests();
  }

  clearFilters(): void {
    this.search.set('');
    this.selectedStatus.set('');
    this.sortOrder.set('DESC');
    this.currentPage.set(1);

    this.loadRequests();
  }

  previousPage(): void {
    if (!this.canGoPrevious()) {
      return;
    }

    this.currentPage.update((page) => page - 1);
    this.loadRequests();
  }

  nextPage(): void {
    if (!this.canGoNext()) {
      return;
    }

    this.currentPage.update((page) => page + 1);
    this.loadRequests();
  }

  openCreateModal(): void {
    this.selectedRequest.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(request: ServiceRequest): void {
    this.selectedRequest.set(request);
    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.selectedRequest.set(null);
  }

  onRequestSaved(): void {
    this.closeFormModal();
    this.currentPage.set(1);
    this.loadRequests();
    this.requestsChanged.emit();
  }

  finalizeRequest(request: ServiceRequest): void {
    if (
      request.status === RequestStatus.FINALIZADA ||
      !confirm(`¿Finalizar la solicitud ${request.number}?`)
    ) {
      return;
    }

    this.executeAction(
      request.id,
      this.serviceRequestsService.finalizeRequest(request.id),
    );
  }

  deleteRequest(request: ServiceRequest): void {
    const confirmed = confirm(
      `¿Eliminar la solicitud ${request.number}? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    this.executeAction(
      request.id,
      this.serviceRequestsService.deleteRequest(request.id),
    );
  }

  private executeAction(
    requestId: number,
    action$: Observable<unknown>,
  ): void {
    this.processingRequestId.set(requestId);
    this.errorMessage.set(null);

    action$
      .pipe(
        finalize(() => {
          this.processingRequestId.set(null);
        }),
      )
      .subscribe({
        next: () => {
          this.loadRequests();
          this.requestsChanged.emit();
        },
        error: () => {
          this.errorMessage.set(
            'No se pudo completar la acción.',
          );
        },
      });
  }
}
