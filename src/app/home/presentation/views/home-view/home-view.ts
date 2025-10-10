import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { DashboardStore } from '../../../application/dashboard.store';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './home-view.html',
  styleUrl: './home-view.css'
})
export class HomeView implements OnInit {
  protected dashboardStore = inject(DashboardStore);

  ngOnInit(): void {
    this.dashboardStore.loadDashboardData();
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  }

  protected getNotificationIcon(type: string): string {
    return type === 'expired' ? 'warning' : 'notification_important';
  }

  protected getColor(index: number): string {
    const colors = ['#5C6BC0', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#26C6DA'];
    return colors[index % colors.length];
  }

  protected getPieSlicePath(index: number, categories: any[]): string {
    const total = categories.reduce((sum, cat) => sum + cat.count, 0);
    let currentAngle = 0;

    // Calculate start angle for this slice
    for (let i = 0; i < index; i++) {
      currentAngle += (categories[i].count / total) * 360;
    }

    const sliceAngle = (categories[index].count / total) * 360;
    const startAngle = currentAngle - 90; // Start from top
    const endAngle = startAngle + sliceAngle;

    const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    return `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  }

  protected getLineChartPoints(): string {
    const trend = this.dashboardStore.expiredTrend();
    return trend.map((point, i) => {
      const x = 50 + (i * 80);
      const y = 250 - (point.count * 2);
      return `${x},${y}`;
    }).join(' ');
  }
}
