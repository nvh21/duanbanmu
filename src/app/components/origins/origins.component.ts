import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OriginApiService, OriginResponse, PageResponse } from '../../services/origin-api.service';

interface OriginVM {
  id: number;
  tenXuatXu: string;
  moTa?: string;
  trangThai: boolean;
}

@Component({
  selector: 'app-origins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './origins.component.html',
  styleUrls: ['./origins.component.scss'],
})
export class OriginsComponent implements OnInit {
  items: OriginVM[] = [];
  filtered: OriginVM[] = [];
  display: OriginVM[] = [];
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
  selected: OriginVM | null = null;
  showDeleteModal = false;
  toDelete: OriginVM | null = null;

  form: OriginVM = { id: 0, tenXuatXu: '', moTa: '', trangThai: true };

  constructor(private api: OriginApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetch();
  }

  fetch(page: number = 0) {
    this.api.getAllActive().subscribe((list: OriginResponse[]) => {
      this.items = (list || []).map((x) => ({
        id: x.id,
        tenXuatXu: x.tenXuatXu,
        moTa: x.moTa || '',
        trangThai: !!x.trangThai,
      }));
      this.applyFilterSort();
      this.totalElements = this.filtered.length;
      this.totalPages = Math.max(1, Math.ceil(this.totalElements / this.size));
      this.page = Math.min(page, this.totalPages - 1);
      this.updateDisplay();
      this.cdr.detectChanges();
    });
  }

  filter() {
    this.filtered = this.items.filter((x) => {
      const matchesSearch =
        x.tenXuatXu.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (x.moTa || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus =
        this.selectedStatus === 'all' ||
        (this.selectedStatus === 'active' ? x.trangThai : !x.trangThai);
      return matchesSearch && matchesStatus;
    });
    this.updateDisplay();
  }

  onSearchChange() {
    this.page = 0;
    this.fetch(0);
  }
  onStatusChange() {
    this.page = 0;
    this.fetch(0);
  }

  setSort(field: 'tenXuatXu' | 'moTa' | 'trangThai') {
    const [f, d] = this.sort.split(',');
    const next = f === field && d === 'asc' ? 'desc' : 'asc';
    this.sort = `${field},${next}`;
    this.applyFilterSort();
    this.page = 0;
    this.updateDisplay();
  }

  prevPage() {
    if (this.page > 0) {
      this.page -= 1;
      this.updateDisplay();
    }
  }
  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page += 1;
      this.updateDisplay();
    }
  }
  changePageSize(size: number) {
    this.size = Number(size) || 10;
    this.totalPages = Math.max(1, Math.ceil(this.filtered.length / this.size));
    this.page = 0;
    this.updateDisplay();
  }

  private applyFilterSort() {
    this.filter();
    const [field, dir] = this.sort.split(',');
    const factor = dir === 'asc' ? 1 : -1;
    this.filtered.sort((a: any, b: any) => {
      const va = (a as any)[field];
      const vb = (b as any)[field];
      if (va == null && vb == null) return 0;
      if (va == null) return -1 * factor;
      if (vb == null) return 1 * factor;
      if (typeof va === 'boolean') return (va === vb ? 0 : va ? 1 : -1) * factor;
      return String(va).localeCompare(String(vb)) * factor;
    });
  }

  private updateDisplay() {
    const start = this.page * this.size;
    const end = start + this.size;
    this.display = this.filtered.slice(start, end);
    this.totalElements = this.filtered.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalElements / this.size));
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selected = null;
    this.form = { id: 0, tenXuatXu: '', moTa: '', trangThai: true };
    this.showModal = true;
  }
  openEditModal(x: OriginVM) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selected = x;
    this.form = { ...x };
    this.showModal = true;
  }
  viewItem(x: OriginVM) {
    this.isViewMode = true;
    this.isEditMode = false;
    this.selected = x;
    this.form = { ...x };
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.isViewMode = false;
    this.selected = null;
  }

  save() {
    if (!this.form.tenXuatXu.trim()) {
      alert('Vui lòng nhập tên xuất xứ');
      return;
    }
    const payload = {
      tenXuatXu: this.form.tenXuatXu,
      moTa: this.form.moTa,
      trangThai: this.form.trangThai,
    };
    if (this.isEditMode && this.selected) {
      this.api.update(this.selected.id, payload).subscribe({
        next: () => {
          this.fetch(0);
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          const msg =
            (err?.error && (err.error.message || err.error.error)) ||
            (err?.status === 409
              ? 'Tên xuất xứ đã tồn tại, vui lòng dùng tên khác.'
              : err?.status === 400
              ? 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại.'
              : 'Cập nhật xuất xứ thất bại');
          alert(msg);
        },
      });
    } else {
      this.api.create(payload).subscribe({
        next: () => {
          this.fetch(0);
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          const msg =
            (err?.error && (err.error.message || err.error.error)) ||
            (err?.status === 409
              ? 'Tên xuất xứ đã tồn tại, vui lòng dùng tên khác.'
              : err?.status === 400
              ? 'Dữ liệu không hợp lệ, vui lòng nhập tên xuất xứ.'
              : 'Thêm xuất xứ thất bại');
          alert(msg);
        },
      });
    }
  }

  delete(x: OriginVM) {
    this.toDelete = x;
    this.showDeleteModal = true;
  }
  confirmDelete() {
    if (this.toDelete) {
      this.api.delete(this.toDelete.id).subscribe({
        next: () => {
          this.fetch(0);
        },
        error: (err) => {
          console.error(err);
          const msg =
            (err?.error && (err.error.message || err.error.error)) || 'Xóa xuất xứ thất bại';
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

  trackById(i: number, x: OriginVM) {
    return x.id;
  }
}
