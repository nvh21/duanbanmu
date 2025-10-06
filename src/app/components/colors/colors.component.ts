import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorApiService, ColorResponse, PageResponse } from '../../services/color-api.service';

interface ColorVM {
  id: number;
  name: string;
  code: string;
  status: boolean;
}

@Component({
  selector: 'app-colors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
})
export class ColorsComponent implements OnInit {
  colors: ColorVM[] = [];
  filtered: ColorVM[] = [];
  searchTerm = '';
  showModal = false;
  isEditMode = false;
  isViewMode = false;
  selected: ColorVM | null = null;
  newColor: ColorVM = { id: 0, name: '', code: '', status: true };
  showDeleteModal = false;
  colorToDelete: ColorVM | null = null;

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  sort = 'id,desc';

  constructor(private api: ColorApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetch();
  }

  fetch(page: number = 0) {
    this.api
      .search({ keyword: this.searchTerm || undefined, page, size: this.pageSize, sort: this.sort })
      .subscribe((res: PageResponse<ColorResponse>) => {
        this.colors = res.content.map((c) => ({
          id: c.id,
          name: c.tenMau,
          code: c.maMau,
          status: !!c.trangThai,
        }));
        this.filtered = [...this.colors];
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = res.number;
        this.cdr.detectChanges();
      });
  }

  onSearchChange() {
    this.fetch(0);
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selected = null;
    this.newColor = { id: 0, name: '', code: '', status: true };
    this.showModal = true;
  }
  openEditModal(c: ColorVM) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selected = c;
    this.newColor = { ...c };
    this.showModal = true;
  }
  viewColor(c: ColorVM) {
    this.isViewMode = true;
    this.isEditMode = false;
    this.selected = c;
    this.newColor = { ...c };
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
    this.selected = null;
    this.isEditMode = false;
    this.isViewMode = false;
  }

  save() {
    if (!this.newColor.name.trim()) {
      alert('Vui lòng nhập tên màu');
      return;
    }
    if (this.isEditMode && this.selected) {
      this.api
        .update(this.selected.id, {
          tenMau: this.newColor.name,
          maMau: this.newColor.code,
          trangThai: this.newColor.status,
        })
        .subscribe({
          next: () => {
            this.fetch(0);
            this.closeModal();
          },
          error: () => alert('Cập nhật thất bại'),
        });
    } else {
      this.api
        .create({
          tenMau: this.newColor.name,
          maMau: this.newColor.code,
          trangThai: this.newColor.status,
        })
        .subscribe({
          next: () => {
            this.fetch(0);
            this.closeModal();
          },
          error: () => alert('Thêm mới thất bại'),
        });
    }
  }

  delete(c: ColorVM) {
    this.colorToDelete = c;
    this.showDeleteModal = true;
  }

  // sort helpers
  setSort(field: 'tenMau' | 'maMau' | 'trangThai') {
    const [f, d] = this.sort.split(',');
    const nextDir = f === field && d === 'asc' ? 'desc' : 'asc';
    this.sort = `${field},${nextDir}`;
    this.fetch(0);
  }
  getSortSymbol(field: 'tenMau' | 'maMau' | 'trangThai') {
    const [f, d] = this.sort.split(',');
    return f === field ? (d === 'asc' ? '▲' : '▼') : '';
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) this.fetch(this.currentPage + 1);
  }
  prevPage() {
    if (this.currentPage > 0) this.fetch(this.currentPage - 1);
  }
  changePageSize(size: number) {
    this.pageSize = size;
    this.fetch(0);
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.colorToDelete = null;
  }

  confirmDelete() {
    if (!this.colorToDelete) return;
    this.api.delete(this.colorToDelete.id).subscribe({
      next: () => {
        this.fetch(0);
        this.closeDeleteModal();
      },
      error: () => alert('Xóa thất bại'),
    });
  }
}
