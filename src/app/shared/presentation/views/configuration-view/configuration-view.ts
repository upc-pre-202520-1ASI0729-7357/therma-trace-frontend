import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {TranslatePipe} from '@ngx-translate/core';

interface SettingItem {
  label: string;
  checked?: boolean;
}

@Component({
  selector: 'app-configuration-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    TranslatePipe
  ],
  templateUrl: './configuration-view.html',
  styleUrl: './configuration-view.css'
})
export class ConfigurationView {
  // Datos para las secciones
  notifications = [
    { name: 'Expiration alerts', icon: 'notification_important' },
    { name: 'System Updates', icon: 'system_update' },
    { name: 'Customer Notifications', icon: 'people' },
    { name: 'Push Notifications', icon: 'notifications' }
  ];

  securityItems = [
    { name: 'Change Password', icon: 'lock' },
    { name: '2FA Authentication', icon: 'security' },
    { name: 'Sessions Management', icon: 'devices' },
    { name: 'Add Alternate mail address', icon: 'alternate_email' }
  ];

  supportItems = [
    { name: 'Features', icon: 'star' },
    { name: 'About', icon: 'info' },
  ];
}
