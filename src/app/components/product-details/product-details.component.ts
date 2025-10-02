import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  ngOnInit() {
    this.loadHelmetProducts();
    this.loadSampleData();
    this.filteredDetails = [...this.productDetails];
  }

  loadHelmetProducts() {
    // Giả lập dữ liệu sản phẩm mũ bảo hiểm
    this.helmetProducts = [
      {
        id: 1,
        image: '',
        code: 'P001',
        name: 'AGV K1 Helmet',
        manufacturerId: 1,
        manufacturerName: 'AGV',
        color: 'Đen mờ',
        size: 'M',
        quantity: 15,
        price: 2500000,
        status: 'Đang bán',
        description: '',
        specifications: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        image: '',
        code: 'P002',
        name: 'Shoei X14 Helmet',
        manufacturerId: 2,
        manufacturerName: 'Shoei',
        color: 'Đỏ',
        size: 'L',
        quantity: 8,
        price: 3500000,
        status: 'Đang bán',
        description: '',
        specifications: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        image: '',
        code: 'P003',
        name: 'Arai RX7V Helmet',
        manufacturerId: 3,
        manufacturerName: 'Arai',
        color: 'Trắng',
        size: 'XL',
        quantity: 0,
        price: 4200000,
        status: 'Ngừng bán',
        description: '',
        specifications: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        image: '',
        code: 'P004',
        name: 'HJC RPHA 11 Helmet',
        manufacturerId: 4,
        manufacturerName: 'HJC',
        color: 'Xanh dương',
        size: 'M',
        quantity: 12,
        price: 1800000,
        status: 'Đang bán',
        description: '',
        specifications: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        image: '',
        code: 'P005',
        name: 'Bell Race Star Helmet',
        manufacturerId: 5,
        manufacturerName: 'Bell',
        color: 'Vàng',
        size: 'L',
        quantity: 5,
        price: 2800000,
        status: 'Đang bán',
        description: '',
        specifications: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  loadSampleData() {
    this.productDetails = [
      {
        id: 1,
        productId: 1,
        productCode: 'P001',
        productName: 'AGV K1 Helmet',
        category: 'Mũ bảo hiểm toàn đầu',
        material: 'Polycarbonate',
        weight: 1.2,
        dimensions: '30cm x 25cm x 20cm',
        safetyStandards: ['ECE 22.05', 'DOT (FMVSS 218)'],
        features: [
          'Pinlock visor',
          'Ventilation system',
          'Removable liner',
          'Quick release buckle',
        ],
        warranty: '2 năm',
        careInstructions: 'Làm sạch bằng nước ấm và xà phòng nhẹ. Tránh sử dụng hóa chất mạnh.',
        compatibility: ['Xe máy', 'Xe tay ga', 'Xe số'],
        colors: ['Đen mờ', 'Trắng', 'Đỏ', 'Xanh dương'],
        sizes: ['S', 'M', 'L', 'XL'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 2,
        productId: 2,
        productCode: 'P002',
        productName: 'Shoei X14 Helmet',
        category: 'Mũ bảo hiểm đua xe',
        material: 'Carbon Fiber',
        weight: 1.1,
        dimensions: '32cm x 26cm x 22cm',
        safetyStandards: ['ECE 22.06', 'SNELL M2020'],
        features: [
          'Aerodynamic design',
          'Drop-down sun visor',
          'Bluetooth ready',
          'Anti-fog coating',
        ],
        warranty: '3 năm',
        careInstructions:
          'Làm sạch bằng nước ấm. Sử dụng chất tẩy rửa chuyên dụng cho mũ bảo hiểm.',
        compatibility: ['Xe đua', 'Xe thể thao'],
        colors: ['Đỏ', 'Đen', 'Trắng', 'Xanh lá'],
        sizes: ['M', 'L', 'XL'],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: 3,
        productId: 3,
        productCode: 'P003',
        productName: 'Arai RX7V Helmet',
        category: 'Mũ bảo hiểm toàn đầu',
        material: 'Fiberglass',
        weight: 1.3,
        dimensions: '31cm x 25cm x 21cm',
        safetyStandards: ['ECE 22.05', 'SNELL M2015'],
        features: [
          'Pinlock visor',
          'Ventilation system',
          'Adjustable fit system',
          'Noise reduction',
        ],
        warranty: '2 năm',
        careInstructions: 'Làm sạch bằng nước ấm và xà phòng nhẹ. Bảo quản nơi khô ráo.',
        compatibility: ['Xe máy', 'Xe touring'],
        colors: ['Trắng', 'Đen', 'Xám'],
        sizes: ['L', 'XL', 'XXL'],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-25'),
      },
    ];
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
