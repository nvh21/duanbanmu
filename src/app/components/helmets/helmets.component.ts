import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  ngOnInit() {
    this.loadManufacturers();
    this.loadSampleData();
    this.filteredProducts = [...this.helmetProducts];
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

  loadSampleData() {
    this.helmetProducts = [
      {
        id: 1,
        image: 'https://via.placeholder.com/150x150/007bff/ffffff?text=AGV+K1',
        code: 'P001',
        name: 'AGV K1 Helmet',
        manufacturerId: 1,
        manufacturerName: 'AGV',
        color: 'Đen mờ',
        size: 'M',
        quantity: 15,
        price: 2500000,
        status: 'Đang bán',
        description: 'Mũ bảo hiểm AGV K1 chất lượng cao, phù hợp cho xe máy',
        specifications: 'Chuẩn ECE 22.05, Trọng lượng: 1.2kg, Kích thước: M (55-56cm)',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 2,
        image: 'https://via.placeholder.com/150x150/28a745/ffffff?text=Shoei+X14',
        code: 'P002',
        name: 'Shoei X14 Helmet',
        manufacturerId: 2,
        manufacturerName: 'Shoei',
        color: 'Đỏ',
        size: 'L',
        quantity: 8,
        price: 3500000,
        status: 'Đang bán',
        description: 'Mũ bảo hiểm Shoei X14 cao cấp, thiết kế thể thao',
        specifications: 'Chuẩn ECE 22.06, Trọng lượng: 1.1kg, Kích thước: L (57-58cm)',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: 3,
        image: 'https://via.placeholder.com/150x150/dc3545/ffffff?text=Arai+RX7V',
        code: 'P003',
        name: 'Arai RX7V Helmet',
        manufacturerId: 3,
        manufacturerName: 'Arai',
        color: 'Trắng',
        size: 'XL',
        quantity: 0,
        price: 4200000,
        status: 'Ngừng bán',
        description: 'Mũ bảo hiểm Arai RX7V cao cấp, đã ngừng sản xuất',
        specifications: 'Chuẩn ECE 22.05, Trọng lượng: 1.3kg, Kích thước: XL (59-60cm)',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-25'),
      },
      {
        id: 4,
        image: 'https://via.placeholder.com/150x150/ffc107/000000?text=HJC+RPHA+11',
        code: 'P004',
        name: 'HJC RPHA 11 Helmet',
        manufacturerId: 4,
        manufacturerName: 'HJC',
        color: 'Xanh dương',
        size: 'M',
        quantity: 12,
        price: 1800000,
        status: 'Đang bán',
        description: 'Mũ bảo hiểm HJC RPHA 11 giá rẻ, chất lượng tốt',
        specifications: 'Chuẩn ECE 22.05, Trọng lượng: 1.4kg, Kích thước: M (55-56cm)',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
      {
        id: 5,
        image: 'https://via.placeholder.com/150x150/6f42c1/ffffff?text=Bell+Race+Star',
        code: 'P005',
        name: 'Bell Race Star Helmet',
        manufacturerId: 5,
        manufacturerName: 'Bell',
        color: 'Vàng',
        size: 'L',
        quantity: 5,
        price: 2800000,
        status: 'Đang bán',
        description: 'Mũ bảo hiểm Bell Race Star thiết kế đua xe',
        specifications: 'Chuẩn ECE 22.06, Trọng lượng: 1.0kg, Kích thước: L (57-58cm)',
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05'),
      },
    ];
  }

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
    // Validation: Kiểm tra ảnh bắt buộc
    if (!this.newProduct.image || this.newProduct.image.trim() === '') {
      alert('Vui lòng chọn ảnh sản phẩm!');
      return;
    }

    // Validation: Kiểm tra các trường bắt buộc
    if (
      !this.newProduct.name.trim() ||
      !this.newProduct.code.trim() ||
      !this.newProduct.manufacturerId
    ) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
      return;
    }

    // Cập nhật tên nhà sản xuất
    const manufacturer = this.manufacturers.find((m) => m.id === this.newProduct.manufacturerId);
    if (manufacturer) {
      this.newProduct.manufacturerName = manufacturer.name;
    }

    if (this.isEditMode && this.selectedProduct) {
      // Cập nhật sản phẩm
      const index = this.helmetProducts.findIndex((p) => p.id === this.selectedProduct!.id);
      if (index !== -1) {
        this.helmetProducts[index] = { ...this.newProduct, updatedAt: new Date() };
      }
    } else {
      // Thêm sản phẩm mới
      this.newProduct.id = Math.max(...this.helmetProducts.map((p) => p.id)) + 1;
      this.newProduct.createdAt = new Date();
      this.newProduct.updatedAt = new Date();
      this.helmetProducts.push({ ...this.newProduct });
    }

    this.filterProducts();
    this.closeModal();
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
