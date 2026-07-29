import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { DashboardStats } from './interfaces/dashboard.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
})
export default class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly stats = signal<DashboardStats | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.dashboardService
      .getStats()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (stats) => {
          this.stats.set(stats);
        },
        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to retrieve dashboard stats:',
            error,
          );

          if (error.status === 0) {
            this.errorMessage.set(
              'No se pudo conectar con el servidor.',
            );
            return;
          }

          this.errorMessage.set(
            'No se pudieron cargar las estadísticas.',
          );
        },
      });
  }
}