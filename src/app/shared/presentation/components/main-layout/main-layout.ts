import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { TopBar } from '../top-bar/top-bar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MatSidenavModule, TopBar, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  // User data (will come from auth service later)
  protected userName = signal('User Example');
  protected userRole = signal('Nurse');
  protected userAvatar = signal('/assets/images/img.png');
  protected mailCount = signal(3);
  protected notificationCount = signal(2);

  // Mobile drawer state
  protected drawerOpened = signal(false);

  // Responsive check
  private breakpointObserver = inject(BreakpointObserver);

  protected isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );

  protected toggleDrawer(): void {
    this.drawerOpened.set(!this.drawerOpened());
  }

  protected closeDrawer(): void {
    this.drawerOpened.set(false);
  }

  protected handleLogout(): void {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  }
}
