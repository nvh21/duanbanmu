import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProductApiService,
  SanPhamResponse,
  PageResponse,
} from '../../services/product-api.service';

interface ProductDetail {
  id: number;
  productId: number;
  productCode: string;
  productName: string;
  category: string;
  material: string;
  weight: number;
  dimensions: string;
  safetyStandards: string[];
  features: string[];
  warranty: string;
  careInstructions: string;
  compatibility: string[];
  colors: string[];
  sizes: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface HelmetProduct {
  id: number;
  image: string;
  code: string;
  name: string;
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

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss', './table-responsive.scss'],
})
export class ProductDetailsComponent implements OnInit {
  productDetails: ProductDetail[] = [];
  filteredDetails: ProductDetail[] = [];
  helmetProducts: HelmetProduct[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  selectedProduct: string = 'all';
  showModal: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  selectedDetail: ProductDetail | null = null;
  showDeleteModal: boolean = false;
  detailToDelete: ProductDetail | null = null;
  newDetail: ProductDetail = {
    id: 0,
    productId: 0,
    productCode: '',
    productName: '',
    category: '',
    material: '',
    weight: 0,
    dimensions: '',
    safetyStandards: [],
    features: [],
    warranty: '',
    careInstructions: '',
    compatibility: [],
    colors: [],
    sizes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  categories = [
    'Mũ bảo hiểm nửa đầu',
    'Mũ bảo hiểm toàn đầu',
    'Mũ bảo hiểm mở mặt',
    'Mũ bảo hiểm đua xe',
    'Mũ bảo hiểm thể thao',
    'Mũ bảo hiểm touring',
    'Mũ bảo hiểm off-road',
    'Mũ bảo hiểm dual-sport',
  ];

  materials = [
    'Polycarbonate',
    'ABS (Acrylonitrile Butadiene Styrene)',
    'Carbon Fiber',
    'Fiberglass',
    'Kevlar',
    'Composite',
    'Thermoplastic',
    'Polyethylene',
  ];

  safetyStandards = [
    'ECE 22.05',
    'ECE 22.06',
    'DOT (FMVSS 218)',
    'SNELL M2020',
    'SNELL M2015',
    'JIS T8133',
    'AS/NZS 1698',
    'GB 811-2010',
  ];

  features = [
    'Pinlock visor',
    'Drop-down sun visor',
    'Bluetooth ready',
    'Aerodynamic design',
    'Ventilation system',
    'Removable liner',
    'Quick release buckle',
    'Anti-fog coating',
    'UV protection',
    'Noise reduction',
    'Moisture wicking',
    'Adjustable fit system',
  ];

  constructor(private productApi: ProductApiService) {}

  ngOnInit() {
    this.loadHelmetProducts();
    this.loadSampleData();
    this.filteredDetails = [...this.productDetails];
  }

  loadHelmetProducts() {
    this.productApi
      .search({ page: 0, size: 50, sort: 'id,desc' })
      .subscribe((res: PageResponse<SanPhamResponse>) => {
        this.helmetProducts = res.content.map((p) => ({
          id: p.id,
          image: '',
          code: p.maSanPham,
          name: p.tenSanPham,
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
      });
  }

  loadSampleData() {
    this.productDetails = [];
  }

  filterDetails() {
    this.filteredDetails = this.productDetails.filter((detail) => {
      const matchesSearch =
        detail.productCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        detail.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        detail.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        detail.material.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory =
        this.selectedCategory === 'all' || detail.category === this.selectedCategory;
      const matchesProduct =
        this.selectedProduct === 'all' || detail.productId.toString() === this.selectedProduct;
      return matchesSearch && matchesCategory && matchesProduct;
    });
  }

  onSearchChange() {
    this.filterDetails();
  }

  onCategoryChange() {
    this.filterDetails();
  }

  onProductChange() {
    // Tự động điền mã sản phẩm và tên sản phẩm khi chọn sản phẩm
    if (this.newDetail.productId) {
      const selectedProduct = this.helmetProducts.find((p) => p.id === this.newDetail.productId);
      if (selectedProduct) {
        this.newDetail.productCode = selectedProduct.code;
        this.newDetail.productName = selectedProduct.name;
      }
    }
    this.filterDetails();
  }

  closeModal() {
    this.showModal = false;
    this.selectedDetail = null;
    this.isEditMode = false;
    this.isViewMode = false;
  }

  saveDetail() {
    // Validation: Kiểm tra các trường bắt buộc
    if (
      !this.newDetail.productId ||
      !this.newDetail.category.trim() ||
      !this.newDetail.material.trim()
    ) {
      alert('Vui lòng điền đầy đủ thông tin chi tiết sản phẩm!');
      return;
    }

    // Cập nhật tên sản phẩm
    const product = this.helmetProducts.find((p) => p.id === this.newDetail.productId);
    if (product) {
      this.newDetail.productName = product.name;
    }

    if (this.isEditMode && this.selectedDetail) {
      // Cập nhật chi tiết sản phẩm
      const index = this.productDetails.findIndex((d) => d.id === this.selectedDetail!.id);
      if (index !== -1) {
        this.productDetails[index] = { ...this.newDetail, updatedAt: new Date() };
      }
    } else {
      // Thêm chi tiết sản phẩm mới
      this.newDetail.id = Math.max(...this.productDetails.map((d) => d.id)) + 1;
      this.newDetail.createdAt = new Date();
      this.newDetail.updatedAt = new Date();
      this.productDetails.push({ ...this.newDetail });
    }

    this.filterDetails();
    this.closeModal();
  }

  deleteDetail(detail: ProductDetail) {
    this.detailToDelete = detail;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.detailToDelete) {
      const index = this.productDetails.findIndex((d) => d.id === this.detailToDelete!.id);
      if (index !== -1) {
        this.productDetails.splice(index, 1);
        this.filterDetails();
      }
    }
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.detailToDelete = null;
  }

  viewDetail(detail: ProductDetail) {
    this.isViewMode = true;
    this.isEditMode = false;
    this.selectedDetail = detail;
    this.newDetail = { ...detail };
    this.showModal = true;
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedDetail = null;
    this.newDetail = {
      id: 0,
      productId: 0,
      productCode: '',
      productName: '',
      category: '',
      material: '',
      weight: 0,
      dimensions: '',
      safetyStandards: [],
      features: [],
      warranty: '',
      careInstructions: '',
      compatibility: [],
      colors: [],
      sizes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.showModal = true;
  }

  openEditModal(detail: ProductDetail) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selectedDetail = detail;
    this.newDetail = { ...detail };
    this.showModal = true;
  }

  toggleArrayItem(array: string[], item: string) {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
  }

  isArrayItemSelected(array: string[], item: string): boolean {
    return array.includes(item);
  }

  addCustomItem(array: string[], input: HTMLInputElement) {
    const value = input.value.trim();
    if (value && !array.includes(value)) {
      array.push(value);
      input.value = '';
    }
  }

  removeArrayItem(array: string[], item: string) {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  trackByDetailId(index: number, detail: ProductDetail): number {
    return detail.id;
  }
}
