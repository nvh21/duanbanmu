import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() menuToggle = new EventEmitter<void>();

  isLoggedIn = false;
  currentUser: any = null;
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Subscribe to authentication state
    this.authSubscription.add(
      this.authService.isAuthenticated$.subscribe((isAuth: boolean) => {
        this.isLoggedIn = isAuth;
      })
    );

    this.authSubscription.add(
      this.authService.currentUser$.subscribe((user: any) => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  onToggleMenu() {
    this.menuToggle.emit();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
