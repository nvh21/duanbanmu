import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PhieuGiamGiaService } from '../../services/phieu-giam-gia.service';
import { PhieuGiamGiaResponse } from '../../interfaces/phieu-giam-gia.interface';

@Component({
  selector: 'app-phieu-giam-gia-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phieu-giam-gia-list.component.html',
  styleUrls: ['./phieu-giam-gia-list.component.scss']
})
export class PhieuGiamGiaListComponent implements OnInit {
  
  private phieuGiamGiaService = inject(PhieuGiamGiaService);
  private router = inject(Router);
  
  // Filter properties
  searchTerm = '';
  selectedType = 'all';
  selectedStatus = 'all';
  startDate = '';
  endDate = '';
  minValue = 0;
  maxValue = 5000000; // Mặc định là giá trị cao nhất
  
  // Data
  phieuGiamGiaList: PhieuGiamGiaResponse[] = [];
  filteredList: PhieuGiamGiaResponse[] = [];
  loading = false; // Tắt loading
  error = '';
  
  // Edit modal
  showEditModal = false;
  editingPhieu: PhieuGiamGiaResponse | null = null;
  editForm = {
    maPhieu: '',
    tenPhieuGiamGia: '',
    loaiPhieuGiamGia: true,
    giaTriGiam: 0,
    giaTriToiThieu: 0,
    soTienToiDa: 0,
    hoaDonToiThieu: 0,
    soLuongDung: 0,
    ngayBatDau: '',
    ngayKetThuc: '',
    trangThai: true
  };
  isUpdating = false;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  ngOnInit() {
    this.loadPhieuGiamGiaList();
  }

  loadPhieuGiamGiaList() {
    // Không set loading = true để tắt loading overlay
    this.phieuGiamGiaService.getAllPhieuGiamGia(0, 1000, 'id', 'desc').subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.phieuGiamGiaList = response.data.data || [];
          this.filteredList = [...this.phieuGiamGiaList];
          this.totalItems = this.filteredList.length;
        }
        // Không set loading = false vì đã tắt loading
      },
      error: (error: any) => {
        console.error('Error loading phiếu giảm giá:', error);
        this.error = 'Không thể tải danh sách phiếu giảm giá';
        // Không set loading = false vì đã tắt loading
      }
    });
  }

  // Filter methods
  applyFilters() {
    this.filteredList = this.phieuGiamGiaList.filter(phieu => {
      // Search filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        if (!phieu.maPhieu.toLowerCase().includes(searchLower) && 
            !phieu.tenPhieuGiamGia.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Type filter
      if (this.selectedType !== 'all') {
        const isTienMat = this.selectedType === 'tien_mat';
        if (phieu.loaiPhieuGiamGia !== isTienMat) {
          return false;
        }
      }
      
      // Status filter
      if (this.selectedStatus !== 'all') {
        const isActive = this.selectedStatus === 'active';
        if (phieu.trangThai !== isActive) {
          return false;
        }
      }
      
      // Date range filter
      if (this.startDate && this.endDate) {
        const phieuStartDate = new Date(phieu.ngayBatDau);
        const phieuEndDate = new Date(phieu.ngayKetThuc);
        const filterStartDate = new Date(this.startDate);
        const filterEndDate = new Date(this.endDate);
        
        if (phieuStartDate < filterStartDate || phieuEndDate > filterEndDate) {
          return false;
        }
      }
      
      // Value range filter - chỉ filter theo maxValue
      if (phieu.giaTriGiam > this.maxValue) {
        return false;
      }
      
      return true;
    });
    
    this.totalItems = this.filteredList.length;
    this.currentPage = 1;
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedType = 'all';
    this.selectedStatus = 'all';
    this.startDate = '';
    this.endDate = '';
    this.minValue = 0;
    this.maxValue = 5000000; // Reset về giá trị cao nhất
    this.filteredList = [...this.phieuGiamGiaList];
    this.totalItems = this.filteredList.length;
    this.currentPage = 1;
  }

  exportExcel() {
    // TODO: Implement Excel export
    console.log('Export Excel functionality');
  }

  addPhieuGiamGia() {
    this.router.navigate(['/phieu-giam-gia-form']);
  }

  editPhieuGiamGia(phieu: PhieuGiamGiaResponse) {
    this.editingPhieu = phieu;
    this.editForm = {
      maPhieu: phieu.maPhieu,
      tenPhieuGiamGia: phieu.tenPhieuGiamGia,
      loaiPhieuGiamGia: phieu.loaiPhieuGiamGia,
      giaTriGiam: phieu.giaTriGiam,
      giaTriToiThieu: phieu.giaTriToiThieu,
      soTienToiDa: phieu.soTienToiDa,
      hoaDonToiThieu: phieu.hoaDonToiThieu,
      soLuongDung: phieu.soLuongDung,
      ngayBatDau: phieu.ngayBatDau,
      ngayKetThuc: phieu.ngayKetThuc,
      trangThai: phieu.trangThai
    };
    this.showEditModal = true;
  }

  toggleStatus(phieu: PhieuGiamGiaResponse) {
    // TODO: Implement toggle status
    console.log('Toggle status for:', phieu);
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  getStatusText(status: boolean): string {
    return status ? 'Đang diễn ra' : 'Không hoạt động';
  }

  getStatusClass(status: boolean): string {
    return status ? 'status-active' : 'status-inactive';
  }

  getTypeText(type: boolean): string {
    return type ? 'Tiền mặt' : 'Phần trăm';
  }

  getTypeClass(type: boolean): string {
    return type ? 'type-cash' : 'type-percentage';
  }

  // Pagination
  get paginatedList(): PhieuGiamGiaResponse[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredList.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Tính toán màu sắc cho slider dựa trên giá trị
  getSliderColor(): string {
    const percentage = (this.maxValue / 5000000) * 100;
    if (percentage <= 20) return '#dc3545'; // Đỏ
    if (percentage <= 40) return '#fd7e14'; // Cam
    if (percentage <= 60) return '#ffc107'; // Vàng
    if (percentage <= 80) return '#20c997'; // Xanh lá nhạt
    return '#28a745'; // Xanh lá đậm
  }

  // Tính toán độ dài thanh slider
  getSliderWidth(): string {
    return `${(this.maxValue / 5000000) * 100}%`;
  }

  // Modal methods
  closeEditModal() {
    this.showEditModal = false;
    this.editingPhieu = null;
    this.isUpdating = false;
  }

  updatePhieuGiamGia() {
    if (!this.editingPhieu) return;

    this.isUpdating = true;
    
    const updateData = {
      maPhieu: this.editForm.maPhieu,
      tenPhieuGiamGia: this.editForm.tenPhieuGiamGia,
      loaiPhieuGiamGia: this.editForm.loaiPhieuGiamGia,
      giaTriGiam: this.editForm.giaTriGiam,
      giaTriToiThieu: this.editForm.giaTriToiThieu,
      soTienToiDa: this.editForm.soTienToiDa,
      hoaDonToiThieu: this.editForm.hoaDonToiThieu,
      soLuongDung: this.editForm.soLuongDung,
      ngayBatDau: this.editForm.ngayBatDau,
      ngayKetThuc: this.editForm.ngayKetThuc,
      trangThai: this.editForm.trangThai
    };

    this.phieuGiamGiaService.updatePhieuGiamGia(this.editingPhieu.id, updateData).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Reload data
          this.loadPhieuGiamGiaList();
          this.closeEditModal();
        } else {
          this.error = response.message || 'Không thể cập nhật phiếu giảm giá';
        }
        this.isUpdating = false;
      },
      error: (error: any) => {
        console.error('Error updating phiếu giảm giá:', error);
        this.error = 'Lỗi khi cập nhật phiếu giảm giá: ' + error.message;
        this.isUpdating = false;
      }
    });
  }
}
