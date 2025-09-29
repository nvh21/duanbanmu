import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PromotionModalComponent,
  PromotionFormData,
} from '../promotion-modal/promotion-modal.component';

interface Promotion {
  id: string;
  code: string;
  name: string;
  discountType: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  condition: string;
  status: string;
}

@Component({
  selector: 'app-promotion-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PromotionModalComponent],
  templateUrl: './promotion-management.component.html',
  styleUrls: ['./promotion-management.component.scss'],
})
export class PromotionManagementComponent {
  searchTerm = '';
  showModal = false;
  isEditMode = false;
  selectedPromotion: Promotion | null = null;

  promotions: Promotion[] = [
    {
      id: '1',
      code: 'KM001',
      name: 'Giảm giá mùa hè',
      discountType: 'Phần trăm',
      discountValue: '15%',
      startDate: '1/6/2024',
      endDate: '31/8/2024',
      condition: 'Đơn hàng từ 500.000₫',
      status: 'Đang hoạt động',
    },
    {
      id: '2',
      code: 'KM002',
      name: 'Khuyến mãi sinh viên',
      discountType: 'Số tiền cố định',
      discountValue: '100.000 ₫',
      startDate: '1/9/2024',
      endDate: '31/12/2024',
      condition: 'Có thẻ sinh viên',
      status: 'Sắp diễn ra',
    },
    {
      id: '3',
      code: 'KM003',
      name: 'Black Friday 2024',
      discountType: 'Phần trăm',
      discountValue: '30%',
      startDate: '29/11/2024',
      endDate: '29/11/2024',
      condition: 'Không giới hạn',
      status: 'Chưa bắt đầu',
    },
    {
      id: '4',
      code: 'KM004',
      name: 'Mua 2 tặng 1',
      discountType: 'Sản phẩm tặng',
      discountValue: '1 sản phẩm',
      startDate: '1/3/2024',
      endDate: '31/3/2024',
      condition: 'Mua ít nhất 2 sản phẩm',
      status: 'Đã kết thúc',
    },
    {
      id: '5',
      code: 'KM005',
      name: 'Khách hàng VIP',
      discountType: 'Phần trăm',
      discountValue: '20%',
      startDate: '1/1/2024',
      endDate: '31/12/2024',
      condition: 'Khách hàng VIP',
      status: 'Đang hoạt động',
    },
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Đang hoạt động':
        return 'status-active';
      case 'Sắp diễn ra':
        return 'status-upcoming';
      case 'Chưa bắt đầu':
        return 'status-pending';
      case 'Đã kết thúc':
        return 'status-ended';
      default:
        return 'status-default';
    }
  }

  onSearch() {
    // Implement search logic
    console.log('Searching for:', this.searchTerm);
  }

  onFilter() {
    // Implement filter logic
    console.log('Filtering by status');
  }

  onExportExcel() {
    // Implement export logic
    console.log('Exporting to Excel');
  }

  onImportExcel() {
    // Implement import logic
    console.log('Importing from Excel');
  }

  onAddPromotion() {
    this.isEditMode = false;
    this.selectedPromotion = null;
    this.showModal = true;
  }

  onView(promotion: Promotion) {
    console.log('Viewing promotion:', promotion);
    // Implement view logic
  }

  onEdit(promotion: Promotion) {
    this.isEditMode = true;
    this.selectedPromotion = promotion;
    this.showModal = true;
  }

  onDelete(promotion: Promotion) {
    if (confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      this.promotions = this.promotions.filter((p) => p.id !== promotion.id);
      console.log('Deleted promotion:', promotion);
    }
  }

  onModalClose() {
    this.showModal = false;
    this.selectedPromotion = null;
  }

  onModalSave(formData: PromotionFormData) {
    if (this.isEditMode && this.selectedPromotion) {
      // Update existing promotion
      const index = this.promotions.findIndex((p) => p.id === this.selectedPromotion!.id);
      if (index !== -1) {
        this.promotions[index] = { ...this.selectedPromotion, ...formData };
      }
    } else {
      // Add new promotion
      const newPromotion: Promotion = {
        id: (this.promotions.length + 1).toString(),
        ...formData,
      };
      this.promotions.push(newPromotion);
    }
    this.showModal = false;
    this.selectedPromotion = null;
  }
}
