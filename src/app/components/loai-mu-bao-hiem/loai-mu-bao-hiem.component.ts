import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  LoaiMuBaoHiemApiService,
  LoaiMuBaoHiemRequest,
  LoaiMuBaoHiemResponse,
  PageResponse,
} from '../../services/loai-mu-bao-hiem-api.service';

@Component({
  selector: 'app-loai-mu-bao-hiem',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './loai-mu-bao-hiem.component.html',
  styleUrls: ['./loai-mu-bao-hiem.component.scss'],
})
export class LoaiMuBaoHiemComponent implements OnInit {
  items: LoaiMuBaoHiemResponse[] = [];
  filteredItems: LoaiMuBaoHiemResponse[] = [];
  loading = false;

  // Pagination
  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  // Search and filter
  keyword = '';
  trangThai: boolean | null = null; // null = hiển thị tất cả
  sortField = 'id';
  sortDirection = 'desc';

  // Form
  showModal = false;
  isEdit = false;
  editingItem: LoaiMuBaoHiemResponse | null = null;
  form: LoaiMuBaoHiemRequest = {
    tenLoai: '',
    moTa: '',
    trangThai: true,
  };

  // Track which fields have been touched by user
  touchedFields: Set<string> = new Set();

  // Status options
  statusOptions = [
    { value: null, label: 'Tất cả' },
    { value: true, label: 'Đang dùng' },
    { value: false, label: 'Không dùng nữa' },
  ];

  constructor(private api: LoaiMuBaoHiemApiService, private cdr: ChangeDetectorRef) {
    console.log('LoaiMuBaoHiemComponent constructor called');
  }

  ngOnInit() {
    console.log('LoaiMuBaoHiemComponent initialized');
    // Mặc định hiển thị tất cả items (không filter theo trạng thái)
    this.trangThai = null;
    this.loadData();

    // Force refresh after a short delay to ensure component is fully loaded
    setTimeout(() => {
      if (this.items.length === 0) {
        console.log('No data loaded, trying again...');
        this.loadData();
      }
    }, 500);
  }

  loadData() {
    console.log('Loading data with filter:', {
      keyword: this.keyword,
      trangThai: this.trangThai,
      page: this.page,
      size: this.size,
    });
    this.loading = true;

    this.api
      .search({
        keyword: this.keyword || undefined,
        trangThai: this.trangThai,
        page: this.page,
        size: this.size,
        sort: `${this.sortField},${this.sortDirection}`,
      })
      .subscribe({
        next: (response: PageResponse<LoaiMuBaoHiemResponse>) => {
          console.log('API Response:', response);
          this.items = response.content || [];
          this.totalElements = response.totalElements || 0;
          this.totalPages = response.totalPages || 0;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.loading = false;
          // Fallback to getAllActive if search fails
          console.log('Trying fallback with getAllActive...');
          this.api.getAllActive().subscribe({
            next: (data) => {
              console.log('Fallback success:', data);
              this.items = data || [];
              this.totalElements = data?.length || 0;
              this.totalPages = 1;
              this.cdr.detectChanges();
            },
            error: (fallbackError) => {
              console.error('Fallback also failed:', fallbackError);
              alert('Lỗi khi tải dữ liệu: ' + (error.message || 'Không thể kết nối đến server'));
            },
          });
        },
      });
  }

  onSearchChange() {
    this.loadData();
  }

  onStatusChange() {
    this.loadData();
  }

  setSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadData();
  }

  prevPage() {
    if (this.page > 0) {
      this.page = this.page - 1;
      this.loadData();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page = this.page + 1;
      this.loadData();
    }
  }

  changePageSize(newSize: number) {
    this.size = newSize;
    this.loadData();
  }

  openAddModal() {
    this.isEdit = false;
    this.editingItem = null;
    this.form = {
      tenLoai: '',
      moTa: '',
      trangThai: true,
    };
    this.resetTouchedFields();
    this.showModal = true;
  }

  openEditModal(item: LoaiMuBaoHiemResponse) {
    this.isEdit = true;
    this.editingItem = item;
    this.form = {
      tenLoai: item.tenLoai,
      moTa: item.moTa || '',
      trangThai: item.trangThai,
    };
    this.resetTouchedFields();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEdit = false;
    this.editingItem = null;
  }

  save() {
    // Mark all fields as touched when user tries to submit
    this.touchedFields.add('tenLoai');
    this.touchedFields.add('moTa');

    // Validation chi tiết
    const validationErrors: string[] = [];

    // Kiểm tra tên loại mũ bảo hiểm
    if (!this.form.tenLoai?.trim()) {
      validationErrors.push('Tên loại mũ bảo hiểm không được để trống');
    } else if (this.form.tenLoai.trim().length < 2) {
      validationErrors.push('Tên loại mũ bảo hiểm phải có ít nhất 2 ký tự');
    } else if (this.form.tenLoai.trim().length > 100) {
      validationErrors.push('Tên loại mũ bảo hiểm không được vượt quá 100 ký tự');
    }

    // Kiểm tra mô tả (nếu có)
    if (this.form.moTa?.trim() && this.form.moTa.trim().length > 500) {
      validationErrors.push('Mô tả không được vượt quá 500 ký tự');
    }

    // Hiển thị lỗi nếu có
    if (validationErrors.length > 0) {
      // Không hiển thị alert, chỉ mark fields as touched để hiển thị validation errors
      return;
    }

    const request: LoaiMuBaoHiemRequest = {
      tenLoai: this.form.tenLoai.trim(),
      moTa: this.form.moTa?.trim() || null,
      trangThai: this.form.trangThai,
    };

    const operation =
      this.isEdit && this.editingItem
        ? this.api.update(this.editingItem.id, request)
        : this.api.create(request);

    operation.subscribe({
      next: (response) => {
        console.log('Save operation successful:', response);
        this.closeModal();
        this.loadData();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error saving:', error);
        if (error.status === 409) {
          console.error('Tên loại mũ bảo hiểm đã tồn tại');
        } else {
          console.error('Có lỗi xảy ra khi lưu dữ liệu');
        }
      },
    });
  }

  confirmDelete(item: LoaiMuBaoHiemResponse) {
    if (confirm(`Bạn có chắc chắn muốn xóa loại mũ "${item.tenLoai}"?`)) {
      this.api.delete(item.id).subscribe({
        next: () => {
          this.loadData();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error deleting:', error);
          console.error('Có lỗi xảy ra khi xóa dữ liệu');
        },
      });
    }
  }

  getStatusBadgeClass(trangThai: boolean | null | undefined): string {
    if (trangThai === true) {
      return 'badge bg-success';
    } else if (trangThai === false) {
      return 'badge bg-secondary';
    } else {
      return 'badge bg-warning';
    }
  }

  getStatusText(trangThai: boolean | null | undefined): string {
    if (trangThai === true) {
      return 'Đang dùng';
    } else if (trangThai === false) {
      return 'Không dùng nữa';
    } else {
      return 'Chưa xác định';
    }
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return 'bi-arrow-down-up';
    }
    return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  // Validation methods
  markFieldTouched(field: string) {
    this.touchedFields.add(field);
  }

  hasFieldError(field: string): boolean {
    if (!this.touchedFields.has(field)) {
      return false;
    }

    switch (field) {
      case 'tenLoai':
        return !this.form.tenLoai?.trim() || 
               this.form.tenLoai.trim().length < 2 || 
               this.form.tenLoai.trim().length > 100;
      case 'moTa':
        return !!(this.form.moTa?.trim() && this.form.moTa.trim().length > 500);
      default:
        return false;
    }
  }

  getFieldError(field: string): string | null {
    if (!this.hasFieldError(field)) {
      return null;
    }

    switch (field) {
      case 'tenLoai':
        if (!this.form.tenLoai?.trim()) return 'Tên loại mũ bảo hiểm không được để trống';
        if (this.form.tenLoai.trim().length < 2) return 'Tên loại mũ bảo hiểm phải có ít nhất 2 ký tự';
        if (this.form.tenLoai.trim().length > 100) return 'Tên loại mũ bảo hiểm không được vượt quá 100 ký tự';
        break;
      case 'moTa':
        return 'Mô tả không được vượt quá 500 ký tự';
    }
    return null;
  }

  resetTouchedFields() {
    this.touchedFields.clear();
  }
}
