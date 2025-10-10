import { Component, output, input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-top-bar',
  imports: [MatIconModule, MatButtonModule, MatBadgeModule, LanguageSwitcher],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css'
})
export class TopBar {
  // Inputs
  userName = input<string>('User');
  userRole = input<string>('Role');
  userAvatar = input<string>('/assets/images/img.png');
  mailCount = input<number>(0);
  notificationCount = input<number>(0);

  // Outputs
  menuToggle = output<void>();

  // Responsive check
  private breakpointObserver = inject(BreakpointObserver);

  protected isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );
}