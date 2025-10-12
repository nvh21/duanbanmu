import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DotGiamGiaService, DotGiamGiaRequest } from '../../services/dot-giam-gia.service';
import { ProductApiService } from '../../services/product-api.service';

interface Product {
  id: number;
  maSanPham: string;
  tenSanPham: string;
  tenNhaSanXuat: string;
  soLuongTon: number;
  selected?: boolean;
}

interface PromotionFormData {
  maDotGiamGia: string;
  tenDotGiamGia: string;
  loaiDotGiamGia: string;
  giaTriDotGiam: string;
  soTien: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  moTa: string;
  selectedProducts: number[];
}

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.scss']
})
export class PromotionFormComponent implements OnInit {
  promotionData: PromotionFormData = {
    maDotGiamGia: '',
    tenDotGiamGia: '',
    loaiDotGiamGia: 'PHAN_TRAM',
    giaTriDotGiam: '0',
    soTien: 0,
    ngayBatDau: '',
    ngayKetThuc: '',
    moTa: '',
    selectedProducts: []
  };

  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error: string | null = null;

  // Filter criteria
  searchTerm = '';
  selectedManufacturer = '';
  manufacturers: string[] = [];

  constructor(
    private dotGiamGiaService: DotGiamGiaService,
    private productApiService: ProductApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.generatePromotionCode();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;

    this.productApiService.search({
      page: 0,
      size: 1000,
      trangThai: true
    }).subscribe({
      next: (response: any) => {
        this.products = response.content.map((product: any) => ({
          id: product.id,
          maSanPham: product.maSanPham,
          tenSanPham: product.tenSanPham,
          tenNhaSanXuat: product.nhaSanXuatTen || 'Chưa xác định',
          soLuongTon: 0, // ProductApiService không có field này
          selected: false
        }));
        
        this.filteredProducts = [...this.products];
        this.extractManufacturers();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Lỗi khi tải danh sách sản phẩm: ' + error.message;
        this.loading = false;
      }
    });
  }

  extractManufacturers() {
    const manufacturers = new Set<string>();
    this.products.forEach(product => {
      if (product.tenNhaSanXuat) {
        manufacturers.add(product.tenNhaSanXuat);
      }
    });
    this.manufacturers = Array.from(manufacturers).sort();
  }

  generatePromotionCode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    this.promotionData.maDotGiamGia = `KM${year}${month}${day}${random}`;
  }

  onSearch() {
    this.applyFilters();
  }

  onManufacturerChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.tenSanPham.toLowerCase().includes(searchTerm) ||
        product.maSanPham.toLowerCase().includes(searchTerm)
      );
    }

    // Apply manufacturer filter
    if (this.selectedManufacturer) {
      filtered = filtered.filter(product =>
        product.tenNhaSanXuat === this.selectedManufacturer
      );
    }

    this.filteredProducts = filtered;
  }

  onProductSelect(product: Product) {
    product.selected = !product.selected;
    
    if (product.selected) {
      if (!this.promotionData.selectedProducts.includes(product.id)) {
        this.promotionData.selectedProducts.push(product.id);
      }
    } else {
      this.promotionData.selectedProducts = this.promotionData.selectedProducts.filter(
        id => id !== product.id
      );
    }
  }

  isAllSelected(): boolean {
    return this.filteredProducts.length > 0 && this.filteredProducts.every(product => product.selected);
  }

  onSelectAll() {
    const allSelected = this.isAllSelected();
    
    this.filteredProducts.forEach(product => {
      product.selected = !allSelected;
      
      if (!allSelected) {
        if (!this.promotionData.selectedProducts.includes(product.id)) {
          this.promotionData.selectedProducts.push(product.id);
        }
      } else {
        this.promotionData.selectedProducts = this.promotionData.selectedProducts.filter(
          id => id !== product.id
        );
      }
    });
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    const request: DotGiamGiaRequest = {
      maDotGiamGia: this.promotionData.maDotGiamGia,
      tenDotGiamGia: this.promotionData.tenDotGiamGia,
      loaiDotGiamGia: this.promotionData.loaiDotGiamGia,
      giaTriDotGiam: this.promotionData.giaTriDotGiam,
      soTien: this.promotionData.soTien,
      moTa: this.promotionData.moTa,
      ngayBatDau: this.promotionData.ngayBatDau,
      ngayKetThuc: this.promotionData.ngayKetThuc,
      soLuongSuDung: 1000, // Default value
      trangThai: true
    };

    this.dotGiamGiaService.createDotGiamGia(request).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Tạo đợt giảm giá thành công!');
          this.router.navigate(['/promotion-management']);
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

  validateForm(): boolean {
    if (!this.promotionData.tenDotGiamGia.trim()) {
      alert('Vui lòng nhập tên đợt giảm giá!');
      return false;
    }

    if (!this.promotionData.ngayBatDau) {
      alert('Vui lòng chọn ngày bắt đầu!');
      return false;
    }

    if (!this.promotionData.ngayKetThuc) {
      alert('Vui lòng chọn ngày kết thúc!');
      return false;
    }

    if (new Date(this.promotionData.ngayBatDau) >= new Date(this.promotionData.ngayKetThuc)) {
      alert('Ngày kết thúc phải sau ngày bắt đầu!');
      return false;
    }

    if (this.promotionData.loaiDotGiamGia === 'PHAN_TRAM') {
      const percentage = parseFloat(this.promotionData.giaTriDotGiam);
      if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
        alert('Giá trị giảm giá phải từ 1% đến 100%!');
        return false;
      }
    } else if (this.promotionData.loaiDotGiamGia === 'SO_TIEN') {
      if (this.promotionData.soTien <= 0) {
        alert('Số tiền giảm giá phải lớn hơn 0!');
        return false;
      }
    }

    return true;
  }

  onBack() {
    this.router.navigate(['/promotion-management']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }
}
