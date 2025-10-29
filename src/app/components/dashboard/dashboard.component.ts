import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  constructor(private cdr: ChangeDetectorRef) {}

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

  // Line chart data (last 7 days revenue)
  last7Days: string[] = [];
  dailyRevenue: number[] = [];
  lineChartWidth = 600;
  lineChartHeight = 220;
  linePoints: { x: number; y: number }[] = [];
  linePath = '';
  lineAreaPath = '';

  // Bar chart data (category revenues)
  categoryRevenues: { name: string; value: number }[] = [
    { name: 'AGV', value: 12500000 },
    { name: 'Shoei', value: 8200000 },
    { name: 'Arai', value: 6800000 },
    { name: 'HJC', value: 4500000 },
  ];
  get maxCategoryValue(): number {
    return Math.max(...this.categoryRevenues.map((c) => c.value));
  }

  // Donut chart data (stock status)
  stockStatus: { label: string; value: number; color: string }[] = [
    { label: 'Còn hàng', value: 120, color: '#22c55e' },
    { label: 'Sắp hết', value: 25, color: '#f59e0b' },
    { label: 'Hết hàng', value: 10, color: '#ef4444' },
    { label: 'Tồn kho cao', value: 8, color: '#0ea5e9' },
  ];
  circumference = 2 * Math.PI * 45; // r=45 from template
  donutSegments: { arc: number; offset: number; color: string }[] = [];

  ngOnInit() {
    this.generateLast7Days();
    this.generateFakeData();
    this.generateLineChart();
    this.generateDonutSegments();
    this.cdr.markForCheck();
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

  // Helpers for line chart
  private generateLast7Days() {
    const labels: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
    }
    this.last7Days = labels;
  }

  // Sinh dữ liệu giả động cho biểu đồ và thẻ
  private generateFakeData() {
    // 1) Doanh thu 7 ngày (VND)
    this.dailyRevenue = Array.from({ length: 7 }, () => this.rand(2_000_000, 8_000_000));

    // 2) Doanh thu theo danh mục
    const brands = ['AGV', 'Shoei', 'Arai', 'HJC'];
    this.categoryRevenues = brands.map((name) => ({
      name,
      value: this.rand(3_000_000, 15_000_000),
    }));

    // 3) Trạng thái tồn kho
    const total = this.rand(150, 320);
    const inStock = this.rand(Math.floor(total * 0.5), Math.floor(total * 0.7));
    const lowStock = this.rand(10, 40);
    const outStock = this.rand(5, 25);
    const overStock = Math.max(total - inStock - lowStock - outStock, 0);
    this.stockStatus = [
      { label: 'Còn hàng', value: inStock, color: '#22c55e' },
      { label: 'Sắp hết', value: lowStock, color: '#f59e0b' },
      { label: 'Hết hàng', value: outStock, color: '#ef4444' },
      { label: 'Tồn kho cao', value: overStock, color: '#0ea5e9' },
    ];

    // 4) Cập nhật stat cards
    const totalRevenueMonth = this.dailyRevenue.reduce((s, v) => s + v, 0);
    const ordersToday = this.rand(20, 80);
    const totalProducts = this.rand(120, 380);
    const customers = this.rand(200, 600);
    this.statCards = [
      {
        icon: 'bi-shield',
        title: 'Sản phẩm',
        value: String(totalProducts),
        change: '+12%',
        changeType: 'positive',
      },
      {
        icon: 'bi-file-text',
        title: 'Hóa đơn hôm nay',
        value: String(ordersToday),
        change: '+8%',
        changeType: 'positive',
      },
      {
        icon: 'bi-people',
        title: 'Khách hàng',
        value: String(customers),
        change: '+15%',
        changeType: 'positive',
      },
      {
        icon: 'bi-currency-dollar',
        title: 'Doanh thu tháng',
        value: this.toMillion(totalRevenueMonth),
        change: '+22%',
        changeType: 'positive',
      },
    ];
  }

  private generateLineChart() {
    const padding = 20;
    const w = this.lineChartWidth - padding * 2;
    const h = this.lineChartHeight - padding * 2;
    const max = Math.max(...this.dailyRevenue);
    const stepX = w / (this.dailyRevenue.length - 1);

    this.linePoints = this.dailyRevenue.map((v, i) => ({
      x: padding + i * stepX,
      y: padding + (1 - v / max) * h,
    }));

    this.linePath = this.linePoints
      .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
      .join(' ');

    const areaPoints = [
      ...this.linePoints,
      { x: padding + (this.dailyRevenue.length - 1) * stepX, y: padding + h },
      { x: padding, y: padding + h },
    ];
    this.lineAreaPath = areaPoints
      .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
      .join(' ');
  }

  private generateDonutSegments() {
    const total = this.stockStatus.reduce((s, x) => s + x.value, 0);
    let acc = 0;
    this.donutSegments = this.stockStatus.map((s) => {
      const arc = (s.value / total) * this.circumference;
      const seg = { arc, offset: this.circumference - acc, color: s.color };
      acc += arc;
      return seg;
    });
  }

  private rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private toMillion(vnd: number): string {
    const m = vnd / 1_000_000;
    return `${m.toFixed(1)}M`;
  }
}
