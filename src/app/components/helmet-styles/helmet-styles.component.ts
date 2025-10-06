import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HelmetStyleApiService,
  HelmetStyleResponse,
  PageResponse,
} from '../../services/helmet-style-api.service';

interface HelmetStyleVM {
  id: number;
  name: string;
  description?: string;
  status: boolean;
}

@Component({
  selector: 'app-helmet-styles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './helmet-styles.component.html',
  styleUrls: ['./helmet-styles.component.scss'],
})
export class HelmetStylesComponent implements OnInit {
  items: HelmetStyleVM[] = [];
  filtered: HelmetStyleVM[] = [];
  searchTerm = '';
  showModal = false;
  isEditMode = false;
  isViewMode = false;
  selected: HelmetStyleVM | null = null;
  newItem: HelmetStyleVM = { id: 0, name: '', description: '', status: true };
  showDeleteModal = false;
  itemToDelete: HelmetStyleVM | null = null;

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  sort = 'id,desc';

  constructor(private api: HelmetStyleApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetch();
  }

  fetch(page: number = 0) {
    this.api
      .search({ keyword: this.searchTerm || undefined, page, size: this.pageSize, sort: this.sort })
      .subscribe((res: PageResponse<HelmetStyleResponse>) => {
        this.items = res.content.map((k) => ({
          id: k.id,
          name: k.tenKieuDang,
          description: k.moTa,
          status: !!k.trangThai,
        }));
        this.filtered = [...this.items];
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
    this.newItem = { id: 0, name: '', description: '', status: true };
    this.showModal = true;
  }
  openEditModal(i: HelmetStyleVM) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selected = i;
    this.newItem = { ...i };
    this.showModal = true;
  }
  view(i: HelmetStyleVM) {
    this.isViewMode = true;
    this.isEditMode = false;
    this.selected = i;
    this.newItem = { ...i };
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
    this.selected = null;
    this.isEditMode = false;
    this.isViewMode = false;
  }

  save() {
    if (!this.newItem.name.trim()) {
      alert('Vui lòng nhập tên kiểu dáng');
      return;
    }
    if (this.isEditMode && this.selected) {
      this.api
        .update(this.selected.id, {
          tenKieuDang: this.newItem.name,
          moTa: this.newItem.description,
          trangThai: this.newItem.status,
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
          tenKieuDang: this.newItem.name,
          moTa: this.newItem.description,
          trangThai: this.newItem.status,
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

  delete(i: HelmetStyleVM) {
    this.itemToDelete = i;
    this.showDeleteModal = true;
  }
  confirmDelete() {
    if (!this.itemToDelete) return;
    this.api.delete(this.itemToDelete.id).subscribe({
      next: () => {
        this.fetch(0);
        this.closeDeleteModal();
      },
      error: () => alert('Xóa thất bại'),
    });
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  setSort(field: 'tenKieuDang' | 'trangThai') {
    const [f, d] = this.sort.split(',');
    const nextDir = f === field && d === 'asc' ? 'desc' : 'asc';
    this.sort = `${field},${nextDir}`;
    this.fetch(0);
  }
  getSortSymbol(field: 'tenKieuDang' | 'trangThai') {
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
}
