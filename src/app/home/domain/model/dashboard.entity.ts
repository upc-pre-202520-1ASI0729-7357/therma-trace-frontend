export interface DashboardStats {
  totalMedicines: number;
  activeMedicines: number;
  expiredMedicines: number;
  expiringSoon: number;
}

export interface MedicinesByCategory {
  category: string;
  count: number;
  percentage: number;
}

export interface ExpiredMedicinesData {
  month: string;
  count: number;
}

export interface NotificationItem {
  id: number;
  medicineName: string;
  expirationDate: string;
  type: 'expiring' | 'expired';
}

export interface DashboardData {
  stats: DashboardStats;
  medicinesByCategory: MedicinesByCategory[];
  expiredTrend: ExpiredMedicinesData[];
  notifications: NotificationItem[];
}
