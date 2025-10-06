import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ManufacturerApiService,
  ManufacturerResponse,
  PageResponse,
} from '../../services/manufacturer-api.service';

interface Manufacturer {
  id: number;
  name: string;
  description: string;
  status: boolean;
  country?: string;
}

@Component({
  selector: 'app-manufacturers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.scss'],
})
export class ManufacturersComponent implements OnInit {
  manufacturers: Manufacturer[] = [];
  filteredManufacturers: Manufacturer[] = [];
  searchTerm: string = '';
  selectedCountry: string = 'all';
  // Paging & sorting
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  sort: string = 'id,desc';
  showModal: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  selectedManufacturer: Manufacturer | null = null;
  showDeleteModal: boolean = false;
  manufacturerToDelete: Manufacturer | null = null;
  newManufacturer: Manufacturer = {
    id: 0,
    name: '',
    description: '',
    status: true,
  };

  constructor(private manufacturerApi: ManufacturerApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchManufacturers();
  }

  fetchManufacturers(page: number = 0) {
    this.manufacturerApi
      .search({ keyword: this.searchTerm || undefined, page, size: this.pageSize, sort: this.sort })
      .subscribe((res: PageResponse<ManufacturerResponse>) => {
        this.manufacturers = res.content.map((m) => ({
          id: m.id,
          name: m.ten,
          description: m.moTa || '',
          status: !!m.trangThai,
          country: m.quocGia || '-',
        }));
        this.filteredManufacturers = [...this.manufacturers];
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = res.number;
        // Zoneless change detection: trigger view update after async work
        this.cdr.detectChanges();
      });
  }

  // legacy sample left empty after switch to BE

  filterManufacturers() {
    this.filteredManufacturers = this.manufacturers.filter((manufacturer) => {
      const matchesSearch =
        manufacturer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        manufacturer.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesSearch;
    });
  }

  onSearchChange() {
    this.currentPage = 0;
    this.fetchManufacturers(0);
  }

  onCountryChange() {
    this.currentPage = 0;
    this.fetchManufacturers(0);
  }

  closeModal() {
    this.showModal = false;
    this.selectedManufacturer = null;
    this.isEditMode = false;
    this.isViewMode = false;
  }

  saveManufacturer() {
    // Validation: Kiểm tra các trường bắt buộc
    if (!this.newManufacturer.name.trim()) {
      alert('Vui lòng điền đầy đủ thông tin nhà sản xuất!');
      return;
    }

    if (this.isEditMode && this.selectedManufacturer) {
      this.manufacturerApi
        .update(this.selectedManufacturer.id, {
          ten: this.newManufacturer.name,
          moTa: this.newManufacturer.description,
          trangThai: this.newManufacturer.status,
          quocGia: this.newManufacturer.country,
        })
        .subscribe({
          next: () => {
            this.fetchManufacturers(0);
            this.closeModal();
          },
          error: (err) => {
            console.error(err);
            alert('Cập nhật nhà sản xuất thất bại.');
          },
        });
    } else {
      // Gọi API BE tạo mới và refresh danh sách
      this.manufacturerApi
        .create({
          ten: this.newManufacturer.name,
          moTa: this.newManufacturer.description,
          trangThai: this.newManufacturer.status,
          quocGia: this.newManufacturer.country,
        })
        .subscribe({
          next: () => {
            this.fetchManufacturers(0);
            this.closeModal();
          },
          error: (err) => {
            console.error(err);
            alert('Thêm nhà sản xuất thất bại.');
          },
        });
    }
  }

  deleteManufacturer(manufacturer: Manufacturer) {
    this.manufacturerToDelete = manufacturer;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.manufacturerToDelete) {
      this.manufacturerApi.delete(this.manufacturerToDelete.id).subscribe({
        next: () => {
          this.fetchManufacturers(0);
        },
        error: (err) => {
          console.error(err);
          alert('Xóa nhà sản xuất thất bại.');
        },
      });
    }
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.manufacturerToDelete = null;
  }

  viewManufacturer(manufacturer: Manufacturer) {
    this.isViewMode = true;
    this.isEditMode = false;
    this.selectedManufacturer = manufacturer;
    this.newManufacturer = { ...manufacturer };
    this.showModal = true;
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedManufacturer = null;
    this.newManufacturer = {
      id: 0,
      name: '',
      description: '',
      status: true,
    };
    this.showModal = true;
  }

  openEditModal(manufacturer: Manufacturer) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selectedManufacturer = manufacturer;
    this.newManufacturer = { ...manufacturer };
    this.showModal = true;
  }

  // Sorting controller
  setSort(field: 'tenNhaSanXuat' | 'quocGia' | 'moTa' | 'trangThai') {
    const [currentField, direction] = this.sort.split(',');
    const nextDir = currentField === field && direction === 'asc' ? 'desc' : 'asc';
    this.sort = `${field},${nextDir}`;
    this.fetchManufacturers(0);
  }

  // Paging controls
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.fetchManufacturers(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.fetchManufacturers(this.currentPage - 1);
    }
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.fetchManufacturers(0);
  }

  // Sort helpers for UI arrows
  private get sortParts(): [string, string] {
    const [f, d] = this.sort.split(',');
    return [f, d];
  }

  getSortSymbol(field: 'tenNhaSanXuat' | 'quocGia' | 'moTa' | 'trangThai'): string {
    const [f, d] = this.sortParts;
    if (f !== field) return '';
    return d === 'asc' ? '▲' : '▼';
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  trackByManufacturerId(index: number, manufacturer: Manufacturer): number {
    return manufacturer.id;
  }
}
