import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  menuItems = [
    {
      icon: 'bi-clipboard-data',
      label: 'Thống kê',
      route: '/dashboard',
      active: true,
      hasSubmenu: false,
      submenu: [],
    },
    {
      icon: 'bi-receipt',
      label: 'Hóa Đơn',
      route: '/invoices',
      active: false,
      hasSubmenu: false,
      submenu: [],
    },
    {
      icon: 'bi-cart',
      label: 'Bán Tại Quầy',
      route: '/invoices/orders',
      active: false,
      hasSubmenu: false,
      submenu: [],
    },
    {
      icon: 'bi-box-seam',
      label: 'Quản lý sản phẩm',
      route: '/products',
      active: false,
      hasSubmenu: true,
      isExpanded: true,
      submenu: [
        {
          label: 'Sản phẩm mũ bảo hiểm',
          route: '/products/helmets',
          active: false,
        },
        {
          label: 'Quản lý kho',
          route: '/products/inventory',
          active: false,
        },
      ],
    },
    {
      icon: 'bi-person',
      label: 'Quản lý tài khoản',
      route: '/management',
      active: false,
      hasSubmenu: false,
      submenu: [],
    },
    {
      icon: 'bi-person-workspace',
      label: 'Quản lý nhân viên',
      route: '/staff',
      active: false,
      hasSubmenu: false,
      submenu: [],
    },
    {
      icon: 'bi-people',
      label: 'Quản lý khách hàng',
      route: '/customers',
      active: false,
      hasSubmenu: false,
      submenu: [],
    },
    {
      icon: 'bi-megaphone',
      label: 'Quản lý khuyến mại',
      route: '/promotions',
      active: false,
      hasSubmenu: false,
      submenu: [],
    },
    {
      icon: 'bi-ticket-perforated',
      label: 'Quản lý voucher',
      route: '/promotions',
      active: false,
      hasSubmenu: false,
      submenu: [],
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateActiveMenuItem(event.url);
      });
  }

  updateActiveMenuItem(currentUrl: string) {
    this.menuItems.forEach((item) => {
      item.active = currentUrl === item.route;

      // Check submenu items
      if (item.hasSubmenu && item.submenu) {
        item.submenu.forEach((subItem) => {
          subItem.active = currentUrl === subItem.route;
        });

        // Expand parent if any submenu item is active
        if (item.submenu.some((subItem) => subItem.active)) {
          item.isExpanded = true;
        }
      }
    });
  }

  toggleSubmenu(item: any) {
    if (item.hasSubmenu) {
      item.isExpanded = !item.isExpanded;
    }
  }
}
