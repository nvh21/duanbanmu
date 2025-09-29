import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface StatCard {
  icon: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  statCards: StatCard[] = [
    {
      icon: 'bi-shield',
      title: 'Sản phẩm',
      value: '150',
      change: '+12%',
      changeType: 'positive',
    },
    {
      icon: 'bi-file-text',
      title: 'Hóa đơn hôm nay',
      value: '45',
      change: '+8%',
      changeType: 'positive',
    },
    {
      icon: 'bi-people',
      title: 'Khách hàng',
      value: '320',
      change: '+15%',
      changeType: 'positive',
    },
    {
      icon: 'bi-currency-dollar',
      title: 'Doanh thu tháng',
      value: '25.5M',
      change: '+22%',
      changeType: 'positive',
    },
  ];

  recentActivities = [
    {
      icon: 'bi-plus-circle',
      text: 'Thêm sản phẩm mới: Mũ bảo hiểm AGV K1',
      time: '2 phút trước',
      type: 'success',
    },
    {
      icon: 'bi-file-earmark-text',
      text: 'Tạo hóa đơn #HD001 cho khách hàng Nguyễn Văn A',
      time: '15 phút trước',
      type: 'info',
    },
    {
      icon: 'bi-person-plus',
      text: 'Đăng ký khách hàng mới: Trần Thị B',
      time: '1 giờ trước',
      type: 'primary',
    },
    {
      icon: 'bi-gift',
      text: 'Tạo chương trình khuyến mãi "Giảm giá mùa hè"',
      time: '2 giờ trước',
      type: 'warning',
    },
  ];

  topProducts = [
    { name: 'Mũ bảo hiểm AGV K1', sales: 25, revenue: '12.5M' },
    { name: 'Mũ bảo hiểm Shoei X-14', sales: 18, revenue: '8.2M' },
    { name: 'Mũ bảo hiểm Arai RX-7V', sales: 15, revenue: '6.8M' },
    { name: 'Mũ bảo hiểm HJC RPHA 11', sales: 12, revenue: '4.5M' },
  ];

  ngOnInit() {
    // Initialize dashboard data
    console.log('Dashboard initialized');
  }

  getChangeClass(changeType: string): string {
    switch (changeType) {
      case 'positive':
        return 'change-positive';
      case 'negative':
        return 'change-negative';
      default:
        return 'change-neutral';
    }
  }

  getActivityClass(type: string): string {
    switch (type) {
      case 'success':
        return 'activity-success';
      case 'info':
        return 'activity-info';
      case 'primary':
        return 'activity-primary';
      case 'warning':
        return 'activity-warning';
      default:
        return 'activity-default';
    }
  }
}
