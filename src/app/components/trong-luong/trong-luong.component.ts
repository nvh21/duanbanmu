import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TrongLuongApiService,
  TrongLuongResponse,
  PageResponse,
} from '../../services/trong-luong-api.service';

interface TrongLuongVM {
  id: number;
  giaTriTrongLuong: number;
  donVi: string;
  moTa?: string;
  trangThai: boolean;
}

@Component({
  selector: 'app-trong-luong',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trong-luong.component.html',
  styleUrls: ['./trong-luong.component.scss'],
})
export class TrongLuongComponent implements OnInit {
  items: TrongLuongVM[] = [];
  display: TrongLuongVM[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sort = 'id,desc';

  showModal = false;
  isEditMode = false;
  isViewMode = false;
  selected: TrongLuongVM | null = null;
  showDeleteModal = false;
  toDelete: TrongLuongVM | null = null;

  form: TrongLuongVM = {
    id: 0,
    giaTriTrongLuong: 0,
    donVi: '',
    moTa: '',
    trangThai: true,
  };

  constructor(private api: TrongLuongApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetch();
  }

  fetch(page: number = 0) {
    // Lấy tất cả trọng lượng (cả active và inactive) với pagination
    this.api
      .search({
        keyword: this.searchTerm,
        trangThai: this.selectedStatus === 'all' ? undefined : this.selectedStatus === 'active',
        page: page,
        size: this.size,
        sort: this.sort,
      })
      .subscribe((response: PageResponse<TrongLuongResponse>) => {
        this.items = (response.content || []).map((x) => ({
          id: x.id,
          giaTriTrongLuong: x.giaTriTrongLuong,
          donVi: x.donVi,
          moTa: x.moTa || '',
          trangThai: !!x.trangThai,
        }));
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.page = response.number;
        this.display = this.items; // Hiển thị trực tiếp từ API response
        this.cdr.detectChanges();
      });
  }

  onSearchChange() {
    this.page = 0;
    this.fetch(0);
  }

  onStatusChange() {
    this.page = 0;
    this.fetch(0);
  }

  setSort(field: 'giaTriTrongLuong' | 'donVi' | 'moTa' | 'trangThai') {
    const [f, d] = this.sort.split(',');
    const next = f === field && d === 'asc' ? 'desc' : 'asc';
    this.sort = `${field},${next}`;
    this.page = 0;
    this.fetch(0);
  }

  prevPage() {
    if (this.page > 0) {
      this.fetch(this.page - 1);
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.fetch(this.page + 1);
    }
  }

  changePageSize(size: number) {
    this.size = Number(size) || 10;
    this.page = 0;
    this.fetch(0);
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selected = null;
    this.form = {
      id: 0,
      giaTriTrongLuong: 0,
      donVi: '',
      moTa: '',
      trangThai: true,
    };
    this.showModal = true;
  }

  openEditModal(t: TrongLuongVM) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selected = t;
    this.form = { ...t };
    this.showModal = true;
  }

  viewItem(t: TrongLuongVM) {
    this.isViewMode = true;
    this.isEditMode = false;
    this.selected = t;
    this.form = { ...t };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.isViewMode = false;
    this.selected = null;
  }

  save() {
    if (!this.form.giaTriTrongLuong || this.form.giaTriTrongLuong <= 0) {
      alert('Vui lòng nhập giá trị trọng lượng hợp lệ');
      return;
    }
    if (!this.form.donVi.trim()) {
      alert('Vui lòng chọn đơn vị');
      return;
    }

    const payload = {
      giaTriTrongLuong: this.form.giaTriTrongLuong,
      donVi: this.form.donVi,
      moTa: this.form.moTa,
      trangThai: this.form.trangThai,
    };

    if (this.isEditMode && this.selected) {
      this.api.update(this.selected.id, payload).subscribe({
        next: () => {
          this.fetch(this.page); // Giữ nguyên trang hiện tại
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          const msg =
            (err?.error && (err.error.message || err.error.error)) ||
            (err?.status === 409
              ? 'Trọng lượng với giá trị và đơn vị này đã tồn tại, vui lòng dùng giá trị khác.'
              : err?.status === 400
              ? 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại.'
              : 'Cập nhật trọng lượng thất bại');
          alert(msg);
        },
      });
    } else {
      this.api.create(payload).subscribe({
        next: () => {
          this.fetch(0); // Về trang đầu sau khi tạo mới
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          const msg =
            (err?.error && (err.error.message || err.error.error)) ||
            (err?.status === 409
              ? 'Trọng lượng với giá trị và đơn vị này đã tồn tại, vui lòng dùng giá trị khác.'
              : err?.status === 400
              ? 'Dữ liệu không hợp lệ, vui lòng nhập đầy đủ thông tin.'
              : 'Thêm trọng lượng thất bại');
          alert(msg);
        },
      });
    }
  }

  delete(t: TrongLuongVM) {
    this.toDelete = t;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.toDelete) {
      this.api.delete(this.toDelete.id).subscribe({
        next: () => {
          this.fetch(this.page); // Giữ nguyên trang hiện tại
        },
        error: (err) => {
          console.error(err);
          const msg =
            (err?.error && (err.error.message || err.error.error)) || 'Xóa trọng lượng thất bại';
          alert(msg);
        },
      });
    }
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.toDelete = null;
  }

  trackById(i: number, t: TrongLuongVM) {
    return t.id;
  }
}

