import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-helmets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './helmets.component.html',
  styleUrls: ['./helmets.component.scss'],
})
export class HelmetsComponent {
  // Dữ liệu mẫu để dựng bảng sản phẩm mũ bảo hiểm
  helmetProducts = [
    {
      image: '/assets/images/agv-k1.jpg',
      code: 'P001',
      manufacturer: 'AGV',
      color: 'Đen mờ',
      size: 'M',
      quantity: 15,
      status: 'Đang bán',
    },
    {
      image: '/assets/images/shoei-x14.jpg',
      code: 'P002',
      manufacturer: 'Shoei',
      color: 'Đỏ',
      size: 'L',
      quantity: 8,
      status: 'Đang bán',
    },
    {
      image: '/assets/images/arai-rx7v.jpg',
      code: 'P003',
      manufacturer: 'Arai',
      color: 'Trắng',
      size: 'XL',
      quantity: 0,
      status: 'Ngừng bán',
    },
  ];
}
