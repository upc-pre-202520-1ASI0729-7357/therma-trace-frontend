import { Injectable, signal, computed } from '@angular/core';
import { DashboardData } from '../domain/model/dashboard.entity';
import { DashboardApiService } from '../infrastructure/dashboard-api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardStore {
  private dashboardDataSignal = signal<DashboardData | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string>('');

  dashboardData = this.dashboardDataSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  // Computed signals for easy access
  stats = computed(() => this.dashboardDataSignal()?.stats || null);
  medicinesByCategory = computed(() => this.dashboardDataSignal()?.medicinesByCategory || []);
  expiredTrend = computed(() => this.dashboardDataSignal()?.expiredTrend || []);
  notifications = computed(() => this.dashboardDataSignal()?.notifications || []);

  constructor(private dashboardApiService: DashboardApiService) {}

  async loadDashboardData(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      const data = await this.dashboardApiService.getDashboardData();
      this.dashboardDataSignal.set(data);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'Error loading dashboard data');
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  refresh(): void {
    this.loadDashboardData();
  }
}
