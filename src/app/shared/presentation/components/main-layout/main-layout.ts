import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { TopBar } from '../top-bar/top-bar';
import { Sidebar } from '../sidebar/sidebar';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MatSidenavModule, TopBar, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {
  // Services
  private authService = inject(AuthService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  // User data from AuthService
  protected userName = signal('User');
  protected userRole = signal('User');
  protected userAvatar = signal('/assets/images/img.png');
  protected mailCount = signal(0);
  protected notificationCount = signal(0);

  // Mobile drawer state
  protected drawerOpened = signal(false);

  // Responsive check
  protected isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      // Set user name (fullName is computed in AuthService)
      this.userName.set(currentUser.fullName || `${currentUser.firstName} ${currentUser.lastName}`);

      // Set user avatar (use default if not provided)
      this.userAvatar.set(currentUser.avatar || '/assets/images/img.png');

      // Role will be loaded from profile later
      this.userRole.set('User');
    } else {
      // No user logged in, redirect to login
      console.warn('No user data found, redirecting to login');
      this.router.navigate(['/login']);
    }
  }

  protected toggleDrawer(): void {
    this.drawerOpened.set(!this.drawerOpened());
  }

  protected closeDrawer(): void {
    this.drawerOpened.set(false);
  }

  protected handleLogout(): void {
    console.log('Logging out user...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
