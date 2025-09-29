import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface OrderDetail {
  id: number;
  ma_don_hang: string;
  ma_san_pham: string;
  so_luong: number;
  gia_ban: number;
  thanh_tien: number;
  ghi_chu: string;
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  searchTerm = '';

  orderDetails: OrderDetail[] = [
    {
      id: 1,
      ma_don_hang: 'MA_DON_HANG_001',
      ma_san_pham: 'SP001',
      so_luong: 2,
      gia_ban: 1500000,
      thanh_tien: 3000000,
      ghi_chu: 'ghi_chu_data_1',
    },
    {
      id: 2,
      ma_don_hang: 'MA_DON_HANG_002',
      ma_san_pham: 'SP002',
      so_luong: 1,
      gia_ban: 2500000,
      thanh_tien: 2500000,
      ghi_chu: 'ghi_chu_data_2',
    },
    {
      id: 3,
      ma_don_hang: 'MA_DON_HANG_003',
      ma_san_pham: 'SP003',
      so_luong: 3,
      gia_ban: 800000,
      thanh_tien: 2400000,
      ghi_chu: 'ghi_chu_data_3',
    },
    {
      id: 4,
      ma_don_hang: 'MA_DON_HANG_004',
      ma_san_pham: 'SP004',
      so_luong: 1,
      gia_ban: 3200000,
      thanh_tien: 3200000,
      ghi_chu: 'ghi_chu_data_4',
    },
    {
      id: 5,
      ma_don_hang: 'MA_DON_HANG_005',
      ma_san_pham: 'SP005',
      so_luong: 2,
      gia_ban: 1200000,
      thanh_tien: 2400000,
      ghi_chu: 'ghi_chu_data_5',
    },
    {
      id: 6,
      ma_don_hang: 'MA_DON_HANG_006',
      ma_san_pham: 'SP006',
      so_luong: 1,
      gia_ban: 1800000,
      thanh_tien: 1800000,
      ghi_chu: 'ghi_chu_data_6',
    },
    {
      id: 7,
      ma_don_hang: 'MA_DON_HANG_007',
      ma_san_pham: 'SP007',
      so_luong: 4,
      gia_ban: 600000,
      thanh_tien: 2400000,
      ghi_chu: 'ghi_chu_data_7',
    },
    {
      id: 8,
      ma_don_hang: 'MA_DON_HANG_008',
      ma_san_pham: 'SP008',
      so_luong: 1,
      gia_ban: 2800000,
      thanh_tien: 2800000,
      ghi_chu: 'ghi_chu_data_8',
    },
    {
      id: 9,
      ma_don_hang: 'MA_DON_HANG_009',
      ma_san_pham: 'SP009',
      so_luong: 2,
      gia_ban: 950000,
      thanh_tien: 1900000,
      ghi_chu: 'ghi_chu_data_9',
    },
    {
      id: 10,
      ma_don_hang: 'MA_DON_HANG_010',
      ma_san_pham: 'SP010',
      so_luong: 1,
      gia_ban: 2200000,
      thanh_tien: 2200000,
      ghi_chu: 'ghi_chu_data_10',
    },
  ];

  ngOnInit() {
    console.log('Order Details component initialized');
  }

  onSearch() {
    console.log('Searching for:', this.searchTerm);
  }

  onFilter() {
    console.log('Filtering data');
  }

  onExport() {
    console.log('Exporting data');
  }

  onImport() {
    console.log('Importing data');
  }

  onAddNew() {
    console.log('Adding new order detail');
  }

  onView(detail: OrderDetail) {
    console.log('Viewing order detail:', detail);
  }

  onEdit(detail: OrderDetail) {
    console.log('Editing order detail:', detail);
  }

  onDelete(detail: OrderDetail) {
    if (confirm('Bạn có chắc chắn muốn xóa chi tiết đơn hàng này?')) {
      this.orderDetails = this.orderDetails.filter((d) => d.id !== detail.id);
      console.log('Deleted order detail:', detail);
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }
}
