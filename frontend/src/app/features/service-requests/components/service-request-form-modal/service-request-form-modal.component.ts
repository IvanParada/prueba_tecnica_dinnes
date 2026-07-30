import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';

import { RequestStatus } from '../../enums/request-status.enum';
import { RequestType } from '../../enums/request-type.enum';
import {
  SaveServiceRequestRequest,
  ServiceRequest,
} from '../../interfaces/service-request.interface';
import { ServiceRequestsService } from '../../services/service-request.service';
import { CustomerLookupService } from '../../services/customer-lookup.service';

@Component({
  selector: 'app-service-request-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './service-request-form-modal.component.html',
})
export default class ServiceRequestFormModalComponent {
  private readonly formBuilder = inject(FormBuilder);

  private readonly serviceRequestsService = inject(
    ServiceRequestsService,
  );
  private readonly customerLookupService = inject(CustomerLookupService);

  readonly request = input<ServiceRequest | null>(null);

  readonly closed = output<void>();
  readonly saved = output<void>();

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly isEditing = computed(
    () => this.request() !== null,
  );

  readonly requestTypes = Object.values(RequestType);
  readonly requestStatuses = Object.values(RequestStatus);

  readonly isLookingUpCustomer = signal(false);
  readonly customerLookupMessage = signal<string | null>(null);
  readonly customerLookupHasError = signal(false);

  readonly requestForm =
    this.formBuilder.nonNullable.group({
      number: [
        'SOL-',
        [
          Validators.required,
          Validators.pattern(/^SOL-\d{1,10}$/i),
          Validators.maxLength(14),
        ],
      ],
      date: [
        this.getCurrentDate(),
        [Validators.required],
      ],
      customerName: [
        '',
        [
          Validators.required,
          Validators.maxLength(150),
        ],
      ],
      customerEmail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(150),
        ],
      ],
      customerPhone: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
        ],
      ],
      requestType: [
        RequestType.SOPORTE_TECNICO,
        [Validators.required],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(2000),
        ],
      ],
      status: [
        RequestStatus.PENDIENTE,
        [Validators.required],
      ],
    });

  constructor() {
    effect(() => {
      const request = this.request();

      this.errorMessage.set(null);

      if (request) {
        this.requestForm.reset({
          number: request.number,
          date: request.date,
          customerName: request.customer.name,
          customerEmail: request.customer.email,
          customerPhone: request.customer.phone,
          requestType: request.requestType,
          description: request.description,
          status: request.status,
        });

        return;
      }

      this.requestForm.reset({
        number: 'SOL-',
        date: this.getCurrentDate(),
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        requestType: RequestType.SOPORTE_TECNICO,
        description: '',
        status: RequestStatus.PENDIENTE,
      });
    });
  }

  onSubmit(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();

      this.errorMessage.set(
        'Por favor, complete todos los campos correctamente.',
      );

      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: SaveServiceRequestRequest =
      this.requestForm.getRawValue();

    const selectedRequest = this.request();

    const request$ = selectedRequest
      ? this.serviceRequestsService.update(
        selectedRequest.id,
        payload,
      )
      : this.serviceRequestsService.create(payload);

    request$
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.saved.emit();
        },
        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to save service request:',
            error,
          );

          if (error.status === 409) {
            this.errorMessage.set(
              'Ya existe una solicitud con ese número.',
            );
            return;
          }

          if (error.status === 0) {
            this.errorMessage.set(
              'No se pudo conectar con el servidor.',
            );
            return;
          }

          this.errorMessage.set(
            'No se pudo guardar la solicitud.',
          );
        },
      });
  }

  closeModal(): void {
    if (this.isLoading()) {
      return;
    }

    this.closed.emit();
  }

  private getCurrentDate(): string {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset();

    return new Date(
      date.getTime() - timezoneOffset * 60_000,
    )
      .toISOString()
      .slice(0, 10);
  }

  lookupCustomer(): void {
    const emailControl =
      this.requestForm.controls.customerEmail;

    emailControl.markAsTouched();

    if (emailControl.invalid) {
      this.customerLookupHasError.set(true);
      this.customerLookupMessage.set(
        'Ingrese un correo electrónico válido.',
      );
      return;
    }

    this.isLookingUpCustomer.set(true);
    this.customerLookupMessage.set(null);
    this.customerLookupHasError.set(false);

    this.customerLookupService
      .lookupByEmail(emailControl.value)
      .pipe(
        finalize(() => {
          this.isLookingUpCustomer.set(false);
        }),
      )
      .subscribe({
        next: (customer) => {
          this.requestForm.patchValue({
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
          });

          this.customerLookupMessage.set(
            'Cliente encontrado. Sus datos fueron completados.',
          );
        },

        error: (error: HttpErrorResponse) => {
          this.customerLookupHasError.set(true);

          if (error.status === 404) {
            this.customerLookupMessage.set(
              'Cliente no encontrado. Puede ingresar sus datos manualmente.',
            );
            return;
          }

          if (error.status === 408) {
            this.customerLookupMessage.set(
              'La consulta excedió el tiempo máximo.',
            );
            return;
          }

          if (error.status === 502) {
            this.customerLookupMessage.set(
              'El servicio externo de clientes no está disponible.',
            );
            return;
          }

          this.customerLookupMessage.set(
            'No se pudo consultar la información del cliente.',
          );
        },
      });
  }
  
  onNumberInput(): void {
  const control = this.requestForm.controls.number;
  const digits = control.value
    .replace(/\D/g, '')
    .slice(0, 10);

  control.setValue(`SOL-${digits}`, {
    emitEvent: false,
  });
}
}