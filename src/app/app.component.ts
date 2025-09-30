import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Helmet Store';
  sidebarHidden = false;

  toggleSidebar() {
    console.log('Toggle sidebar called, current state:', this.sidebarHidden);
    this.sidebarHidden = !this.sidebarHidden;
    console.log('New state:', this.sidebarHidden);
  }
}
