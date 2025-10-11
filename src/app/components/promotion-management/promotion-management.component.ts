import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  PromotionModalComponent,
  PromotionFormData,
} from '../promotion-modal/promotion-modal.component';
import { DotGiamGiaService, DotGiamGia, DotGiamGiaRequest } from '../../services/dot-giam-gia.service';

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
export class PromotionManagementComponent implements OnInit {
  searchTerm = '';
  showModal = false;
  isEditMode = false;
  selectedPromotion: Promotion | null = null;
  loading = false;
  error: string | null = null;

  // DotGiamGia data
  dotGiamGiaList: DotGiamGia[] = [];
  filteredDotGiamGiaList: DotGiamGia[] = [];
  promotions: Promotion[] = [];

  // Filter criteria
  filterCriteria = {
    searchTerm: '',
    discountType: '',
    status: '',
    startDate: '',
    endDate: '',
    discountPercentageMax: 100,
    maxDiscountAmount: 50000000
  };

  constructor(
    private dotGiamGiaService: DotGiamGiaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDotGiamGiaList();
  }

  // Load DotGiamGia data from API
  loadDotGiamGiaList() {
    this.loading = true;
    this.error = null;

    this.dotGiamGiaService.getAllDotGiamGiaWithoutPagination().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dotGiamGiaList = response.data;
          this.filteredDotGiamGiaList = [...this.dotGiamGiaList];
          this.convertToPromotions();
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Lỗi khi tải danh sách đợt giảm giá: ' + error.message;
        this.loading = false;
      }
    });
  }

  // Convert DotGiamGia to Promotion format for display
  convertToPromotions() {
    this.promotions = this.filteredDotGiamGiaList.map(dotGiamGia => ({
      id: dotGiamGia.id?.toString() || '',
      code: dotGiamGia.maDotGiamGia,
      name: dotGiamGia.tenDotGiamGia,
      discountType: dotGiamGia.loaiDotGiamGia || 'Phần trăm',
      discountValue: dotGiamGia.giaTriDotGiam ? `${dotGiamGia.giaTriDotGiam}%` : 
                    dotGiamGia.soTien ? this.formatCurrency(dotGiamGia.soTien) : 'N/A',
      startDate: this.formatDate(dotGiamGia.ngayBatDau),
      endDate: this.formatDate(dotGiamGia.ngayKetThuc),
      condition: dotGiamGia.moTa || '',
      status: dotGiamGia.trangThai ? 'Đang hoạt động' : 'Tạm dừng'
    }));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Đang hoạt động':
        return 'status-active';
      case 'Tạm dừng':
        return 'status-inactive';
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
    this.applyFilters();
  }

  onFilter() {
    this.applyFilters();
  }

  applyFilters() {
    this.loading = true;
    this.error = null;

    // Start with all data
    let filteredData = [...this.dotGiamGiaList];

    // Apply search term filter
    if (this.filterCriteria.searchTerm.trim()) {
      const searchTerm = this.filterCriteria.searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.maDotGiamGia?.toLowerCase().includes(searchTerm) ||
        item.tenDotGiamGia?.toLowerCase().includes(searchTerm) ||
        item.moTa?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply discount type filter
    if (this.filterCriteria.discountType) {
      filteredData = filteredData.filter(item => {
        if (this.filterCriteria.discountType === 'PHAN_TRAM') {
          return item.giaTriDotGiam && parseFloat(item.giaTriDotGiam) > 0;
        } else if (this.filterCriteria.discountType === 'SO_TIEN') {
          return item.soTien && item.soTien > 0;
        }
        return true;
      });
    }

    // Apply status filter
    if (this.filterCriteria.status) {
      filteredData = filteredData.filter(item => {
        const currentDate = new Date();
        const startDate = new Date(item.ngayBatDau);
        const endDate = new Date(item.ngayKetThuc);

        switch (this.filterCriteria.status) {
          case 'ACTIVE':
            return item.trangThai && currentDate >= startDate && currentDate <= endDate;
          case 'UPCOMING':
            return item.trangThai && currentDate < startDate;
          case 'ENDED':
            return currentDate > endDate;
          case 'INACTIVE':
            return !item.trangThai;
          default:
            return true;
        }
      });
    }

    // Apply date range filter
    if (this.filterCriteria.startDate) {
      const startDate = new Date(this.filterCriteria.startDate);
      filteredData = filteredData.filter(item => {
        const itemStartDate = new Date(item.ngayBatDau);
        return itemStartDate >= startDate;
      });
    }

    if (this.filterCriteria.endDate) {
      const endDate = new Date(this.filterCriteria.endDate);
      filteredData = filteredData.filter(item => {
        const itemEndDate = new Date(item.ngayKetThuc);
        return itemEndDate <= endDate;
      });
    }

    // Apply discount percentage filter
    if (this.filterCriteria.discountPercentageMax < 100) {
      filteredData = filteredData.filter(item => {
        return !item.giaTriDotGiam || parseFloat(item.giaTriDotGiam) <= this.filterCriteria.discountPercentageMax;
      });
    }

    // Apply max discount amount filter
    if (this.filterCriteria.maxDiscountAmount < 50000000) {
      filteredData = filteredData.filter(item => {
        return !item.soTien || item.soTien <= this.filterCriteria.maxDiscountAmount;
      });
    }

    this.filteredDotGiamGiaList = filteredData;
    this.convertToPromotions();
    this.loading = false;
  }

  resetFilter() {
    this.filterCriteria = {
      searchTerm: '',
      discountType: '',
      status: '',
      startDate: '',
      endDate: '',
      discountPercentageMax: 100,
      maxDiscountAmount: 50000000
    };
    this.filteredDotGiamGiaList = [...this.dotGiamGiaList];
    this.convertToPromotions();
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
    this.router.navigate(['/promotions/new']);
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
      this.loading = true;
      this.error = null;

      this.dotGiamGiaService.deleteDotGiamGia(parseInt(promotion.id)).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadDotGiamGiaList();
          } else {
            this.error = response.message;
          }
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Lỗi khi xóa đợt giảm giá: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  onModalClose() {
    this.showModal = false;
    this.selectedPromotion = null;
  }

  onModalSave(formData: PromotionFormData) {
    const dotGiamGiaRequest: DotGiamGiaRequest = {
      maDotGiamGia: formData.code,
      tenDotGiamGia: formData.name,
      loaiDotGiamGia: formData.discountType,
      giaTriDotGiam: formData.discountValue.replace('%', ''),
      soTien: formData.discountValue.includes('₫') ? 
        parseInt(formData.discountValue.replace(/[^\d]/g, '')) : undefined,
      moTa: formData.condition,
      ngayBatDau: formData.startDate,
      ngayKetThuc: formData.endDate,
      soLuongSuDung: 1000, // Default value
      trangThai: formData.status === 'Đang hoạt động'
    };

    this.loading = true;
    this.error = null;

    if (this.isEditMode && this.selectedPromotion) {
      // Update existing
      this.dotGiamGiaService.updateDotGiamGia(parseInt(this.selectedPromotion.id), dotGiamGiaRequest).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadDotGiamGiaList();
            this.showModal = false;
            this.selectedPromotion = null;
          } else {
            this.error = response.message;
          }
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Lỗi khi cập nhật đợt giảm giá: ' + error.message;
          this.loading = false;
        }
      });
    } else {
      // Create new
      this.dotGiamGiaService.createDotGiamGia(dotGiamGiaRequest).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadDotGiamGiaList();
            this.showModal = false;
            this.selectedPromotion = null;
          } else {
            this.error = response.message;
          }
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Lỗi khi tạo đợt giảm giá: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  // Helper methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}
