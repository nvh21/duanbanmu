import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Helmet Store';
  sidebarHidden = false;
  isLoginPage = false;
  private routerSubscription: Subscription = new Subscription();

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Kiểm tra route hiện tại để xác định có phải trang login không
    this.routerSubscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.isLoginPage = event.url === '/login';
        })
    );

    // Kiểm tra route ban đầu
    this.isLoginPage = this.router.url === '/login';
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  toggleSidebar() {
    console.log('Toggle sidebar called, current state:', this.sidebarHidden);
    this.sidebarHidden = !this.sidebarHidden;
    console.log('New state:', this.sidebarHidden);
  }
}
