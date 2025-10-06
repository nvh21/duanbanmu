import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ProductApiService,
  SanPhamResponse,
  PageResponse,
} from '../../services/product-api.service';

interface HelmetProduct {
  id: number;
  image: string;
  code: string;
  name: string;
  loaiMuBaoHiem?: string | null;
  nhaSanXuat?: string | null;
  chatLieuVo?: string | null;
  trongLuong?: string | null;
  xuatXu?: string | null;
  kieuDangMu?: string | null;
  congNgheAnToan?: string | null;
  // ID liên kết để tạo mới
  loaiMuBaoHiemId?: number | null;
  nhaSanXuatId?: number | null;
  chatLieuVoId?: number | null;
  trongLuongId?: number | null;
  xuatXuId?: number | null;
  kieuDangMuId?: number | null;
  congNgheAnToanId?: number | null;
  manufacturerId: number;
  manufacturerName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  status: string;
  description: string;
  specifications: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Manufacturer {
  id: number;
  code: string;
  name: string;
  country: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-helmets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './helmets.component.html',
  styleUrls: ['./helmets.component.scss', './table-styles.scss'],
})
export class HelmetsComponent implements OnInit {
  helmetProducts: HelmetProduct[] = [];
  filteredProducts: HelmetProduct[] = [];
  manufacturers: Manufacturer[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedManufacturer: string = 'all';
  showModal: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  selectedProduct: HelmetProduct | null = null;
  showDeleteModal: boolean = false;
  productToDelete: HelmetProduct | null = null;
  newProduct: HelmetProduct = {
    id: 0,
    image: '',
    code: '',
    name: '',
    loaiMuBaoHiemId: null,
    nhaSanXuatId: null,
    chatLieuVoId: null,
    trongLuongId: null,
    xuatXuId: null,
    kieuDangMuId: null,
    congNgheAnToanId: null,
    manufacturerId: 0,
    manufacturerName: '',
    color: '',
    size: '',
    quantity: 0,
    price: 0,
    status: 'Đang bán',
    description: '',
    specifications: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private productApi: ProductApiService) {}

  ngOnInit() {
    this.loadManufacturers();
    this.fetchProducts();
  }

  fetchProducts(page: number = 0) {
    this.productApi
      .search({ keyword: this.searchTerm || undefined, page, size: 20, sort: 'id,desc' })
      .subscribe((res: PageResponse<SanPhamResponse>) => {
        this.helmetProducts = res.content.map((p) => ({
          id: p.id,
          image: '',
          code: p.maSanPham,
          name: p.tenSanPham,
          loaiMuBaoHiem: p.loaiMuBaoHiem ?? null,
          nhaSanXuat: p.nhaSanXuat ?? null,
          chatLieuVo: p.chatLieuVo ?? null,
          trongLuong: p.trongLuong ?? null,
          xuatXu: p.xuatXu ?? null,
          kieuDangMu: p.kieuDangMu ?? null,
          congNgheAnToan: p.congNgheAnToan ?? null,
          manufacturerId: 0,
          manufacturerName: '',
          color: '',
          size: '',
          quantity: 0,
          price: p.giaBan,
          status: p.trangThai ? 'Đang bán' : 'Ngừng bán',
          description: p.moTa || '',
          specifications: '',
          createdAt: new Date(p.ngayTao || new Date()),
          updatedAt: new Date(),
        }));
        this.filteredProducts = [...this.helmetProducts];
      });
  }

  loadManufacturers() {
    this.manufacturers = [
      {
        id: 1,
        code: 'AGV001',
        name: 'AGV',
        country: 'Italy',
        description: 'Nhà sản xuất mũ bảo hiểm cao cấp từ Italy',
        contactEmail: 'info@agv.com',
        contactPhone: '+39 02 1234567',
        address: 'Via Roma 123, Milan, Italy',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 2,
        code: 'SHO001',
        name: 'Shoei',
        country: 'Japan',
        description: 'Thương hiệu mũ bảo hiểm nổi tiếng từ Nhật Bản',
        contactEmail: 'info@shoei.com',
        contactPhone: '+81 3 1234 5678',
        address: '1-2-3 Shibuya, Tokyo, Japan',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: 3,
        code: 'ARA001',
        name: 'Arai',
        country: 'Japan',
        description: 'Nhà sản xuất mũ bảo hiểm chất lượng cao',
        contactEmail: 'info@arai.com',
        contactPhone: '+81 6 1234 5678',
        address: '2-3-4 Osaka, Japan',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        id: 4,
        code: 'HJC001',
        name: 'HJC',
        country: 'South Korea',
        description: 'Thương hiệu mũ bảo hiểm giá cả hợp lý',
        contactEmail: 'info@hjc.com',
        contactPhone: '+82 2 1234 5678',
        address: '123 Gangnam-gu, Seoul, South Korea',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        id: 5,
        code: 'BEL001',
        name: 'Bell',
        country: 'USA',
        description: 'Nhà sản xuất mũ bảo hiểm thể thao từ Mỹ',
        contactEmail: 'info@bellhelmets.com',
        contactPhone: '+1 555 123 4567',
        address: '456 Main St, Los Angeles, CA, USA',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
    ];
  }

  // loadSampleData() { /* bỏ data giả, dùng BE */ }

  filterProducts() {
    this.filteredProducts = this.helmetProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.manufacturerName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || product.status === this.selectedStatus;
      const matchesManufacturer =
        this.selectedManufacturer === 'all' ||
        product.manufacturerId.toString() === this.selectedManufacturer;
      return matchesSearch && matchesStatus && matchesManufacturer;
    });
  }

  onSearchChange() {
    this.filterProducts();
  }

  onStatusChange() {
    this.filterProducts();
  }

  onManufacturerChange() {
    this.filterProducts();
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  saveProduct() {
    // Validation tối thiểu cho thêm mới vào DB (khớp BE)
    if (!this.newProduct.name.trim() || !this.newProduct.code.trim()) {
      alert('Vui lòng nhập mã và tên sản phẩm');
      return;
    }
    if (!this.newProduct.price || this.newProduct.price <= 0) {
      alert('Giá bán phải > 0');
      return;
    }

    if (this.isEditMode && this.selectedProduct) {
      // Chưa triển khai cập nhật lên BE trong yêu cầu này
      alert('Tính năng cập nhật sẽ được bổ sung sau.');
      return;
    }

    // Chuyển các ô nhập ID (đang là text) sang số nếu hợp lệ
    const toId = (v: any) => {
      const n = Number(v);
      return Number.isInteger(n) && n > 0 ? n : undefined;
    };

    // Gọi API BE tạo mới Sản phẩm (BE chỉ nhận ID cho các liên kết)
    const payload = {
      maSanPham: this.newProduct.code,
      tenSanPham: this.newProduct.name,
      moTa: this.newProduct.description || '',
      giaBan: this.newProduct.price || 0,
      trangThai: this.newProduct.status !== 'Ngừng bán',
      loaiMuBaoHiemId: toId(this.newProduct.loaiMuBaoHiemId),
      nhaSanXuatId: toId(this.newProduct.nhaSanXuatId),
      chatLieuVoId: toId(this.newProduct.chatLieuVoId),
      trongLuongId: toId(this.newProduct.trongLuongId),
      xuatXuId: toId(this.newProduct.xuatXuId),
      kieuDangMuId: toId(this.newProduct.kieuDangMuId),
      congNgheAnToanId: toId(this.newProduct.congNgheAnToanId),
    } as any;

    this.productApi.create(payload).subscribe({
      next: () => {
        this.fetchProducts(0);
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        const msg =
          (err?.error && (err.error.message || err.error.error)) ||
          'Thêm mới thất bại. Vui lòng kiểm tra dữ liệu (mã SP không trùng, giá > 0).';
        alert(msg);
      },
    });
  }

  deleteProduct(product: HelmetProduct) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.productToDelete) {
      const index = this.helmetProducts.findIndex((p) => p.id === this.productToDelete!.id);
      if (index !== -1) {
        this.helmetProducts.splice(index, 1);
        this.filterProducts();
      }
    }
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  viewProduct(product: HelmetProduct) {
    this.isViewMode = true;
    this.isEditMode = false;
    this.selectedProduct = product;
    this.selectedFile = null;
    this.imagePreview = product.image;
    this.newProduct = { ...product };
    this.showModal = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Tạo preview ảnh
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.newProduct.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.newProduct.image = '';
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedProduct = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.newProduct = {
      id: 0,
      image: '',
      code: '',
      name: '',
      manufacturerId: 0,
      manufacturerName: '',
      color: '',
      size: '',
      quantity: 0,
      price: 0,
      status: 'Đang bán',
      description: '',
      specifications: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.showModal = true;
  }

  openEditModal(product: HelmetProduct) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selectedProduct = product;
    this.selectedFile = null;
    this.imagePreview = product.image;
    this.newProduct = { ...product };
    this.showModal = true;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  trackByProductId(index: number, product: HelmetProduct): number {
    return product.id;
  }
}
