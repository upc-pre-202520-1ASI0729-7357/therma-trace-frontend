import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import {TranslatePipe} from '@ngx-translate/core';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, LanguageSwitcher, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  // Inputs
  userName = input<string>('User');
  userRole = input<string>('Role');
  userAvatar = input<string>('/assets/images/img.png');

  // Outputs
  logout = output<void>();

  // Navigation items
  protected navItems: NavItem[] = [
    { label: 'nav.home', icon: 'home', route: '/home' },
    { label: 'nav.profile', icon: 'person', route: '/profile' },
    { label: 'nav.medicines', icon: 'medication', route: '/medicaments' },
    { label: 'nav.temperature', icon: 'thermostat', route: '/temperature' },
    { label: 'nav.configuration', icon: 'settings', route: '/configuration' }
  ];

  // Responsive check
  private breakpointObserver = inject(BreakpointObserver);

  protected isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );
}
