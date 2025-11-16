import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DashboardData, DashboardStats, MedicinesByCategory, ExpiredMedicinesData, NotificationItem } from '../domain/model/dashboard.entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {
  private readonly API_URL = `${environment.apiUrl}/medicines`;
  private http = inject(HttpClient);

  async getDashboardData(): Promise<DashboardData> {
    try {
      // Fetch medicines from API using HttpClient (goes through authInterceptor)
      const medicines = await firstValueFrom(this.http.get<any[]>(this.API_URL));

      // Calculate dashboard statistics
      return this.calculateDashboardData(medicines);
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      throw error;
    }
  }

  private calculateDashboardData(medicines: any[]): DashboardData {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Calculate stats
    const totalMedicines = medicines.length;
    const expiredMedicines = medicines.filter(m => new Date(m.expirationDate) < today).length;
    const expiringSoon = medicines.filter(m => {
      const expDate = new Date(m.expirationDate);
      return expDate >= today && expDate <= thirtyDaysFromNow;
    }).length;
    const activeMedicines = totalMedicines - expiredMedicines;

    const stats: DashboardStats = {
      totalMedicines,
      activeMedicines,
      expiredMedicines,
      expiringSoon
    };

    // Group medicines by type (simplified categorization)
    const medicinesByCategory = this.categorizeMedicines(medicines);

    // Generate expired trend data (mock data for now)
    const expiredTrend = this.generateExpiredTrend(medicines);

    // Generate notifications for expiring/expired medicines
    const notifications = this.generateNotifications(medicines, today, thirtyDaysFromNow);

    return {
      stats,
      medicinesByCategory,
      expiredTrend,
      notifications
    };
  }

  private categorizeMedicines(medicines: any[]): MedicinesByCategory[] {
    // Categorize by medicine name patterns
    const categories = new Map<string, number>();

    medicines.forEach(medicine => {
      const name = medicine.name.toLowerCase();
      let category = 'Others';

      if (name.includes('insulin')) {
        category = 'Insulin';
      } else if (name.includes('penicil') || name.includes('cef') || name.includes('vanco')) {
        category = 'Antibiotics';
      } else if (name.includes('analgesic') || name.includes('pain')) {
        category = 'Pain Relief';
      }

      categories.set(category, (categories.get(category) || 0) + 1);
    });

    const total = medicines.length;
    return Array.from(categories.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }

  private generateExpiredTrend(medicines: any[]): ExpiredMedicinesData[] {
    // Generate mock trend data for the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const today = new Date();

    return months.map((month, index) => ({
      month,
      count: Math.floor(Math.random() * 30) + 20 // Mock data
    }));
  }

  private generateNotifications(medicines: any[], today: Date, thirtyDaysFromNow: Date): NotificationItem[] {
    const notifications: NotificationItem[] = [];

    medicines.forEach(medicine => {
      const expDate = new Date(medicine.expirationDate);

      if (expDate < today) {
        notifications.push({
          id: medicine.id,
          medicineName: medicine.name,
          expirationDate: medicine.expirationDate,
          type: 'expired'
        });
      } else if (expDate <= thirtyDaysFromNow) {
        notifications.push({
          id: medicine.id,
          medicineName: medicine.name,
          expirationDate: medicine.expirationDate,
          type: 'expiring'
        });
      }
    });

    // Sort by expiration date (earliest first)
    return notifications.sort((a, b) =>
      new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
    ).slice(0, 10); // Return top 10
  }
}
