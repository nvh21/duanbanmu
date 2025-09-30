import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HelmetProduct {
  id: number;
  image: string;
  code: string;
  name: string;
  manufacturer: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  status: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-helmets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './helmets.component.html',
  styleUrls: ['./helmets.component.scss', './delete-modal.component.scss'],
})
export class HelmetsComponent implements OnInit {
  helmetProducts: HelmetProduct[] = [];
  filteredProducts: HelmetProduct[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
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
    manufacturer: '',
    color: '',
    size: '',
    quantity: 0,
    price: 0,
    status: 'Đang bán',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  ngOnInit() {
    this.loadSampleData();
    this.filteredProducts = [...this.helmetProducts];
  }

  loadSampleData() {
    this.helmetProducts = [
      {
        id: 1,
        image: 'https://via.placeholder.com/150x150/007bff/ffffff?text=AGV+K1',
        code: 'P001',
        name: 'AGV K1 Helmet',
        manufacturer: 'AGV',
        color: 'Đen mờ',
        size: 'M',
        quantity: 15,
        price: 2500000,
        status: 'Đang bán',
        description: 'Mũ bảo hiểm AGV K1 chất lượng cao, phù hợp cho xe máy',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 2,
        image: 'https://via.placeholder.com/150x150/28a745/ffffff?text=Shoei+X14',
        code: 'P002',
        name: 'Shoei X14 Helmet',
        manufacturer: 'Shoei',
        color: 'Đỏ',
        size: 'L',
        quantity: 8,
        price: 3500000,
        status: 'Đang bán',
        description: 'Mũ bảo hiểm Shoei X14 cao cấp, thiết kế thể thao',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: 3,
        image: 'https://via.placeholder.com/150x150/dc3545/ffffff?text=Arai+RX7V',
        code: 'P003',
        name: 'Arai RX7V Helmet',
        manufacturer: 'Arai',
        color: 'Trắng',
        size: 'XL',
        quantity: 0,
        price: 4200000,
        status: 'Ngừng bán',
        description: 'Mũ bảo hiểm Arai RX7V cao cấp, đã ngừng sản xuất',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-25'),
      },
      {
        id: 4,
        image: 'https://via.placeholder.com/150x150/ffc107/000000?text=HJC+RPHA+11',
        code: 'P004',
        name: 'HJC RPHA 11 Helmet',
        manufacturer: 'HJC',
        color: 'Xanh dương',
        size: 'M',
        quantity: 12,
        price: 1800000,
        status: 'Đang bán',
        description: 'Mũ bảo hiểm HJC RPHA 11 giá rẻ, chất lượng tốt',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
      {
        id: 5,
        image: 'https://via.placeholder.com/150x150/6f42c1/ffffff?text=Bell+Race+Star',
        code: 'P005',
        name: 'Bell Race Star Helmet',
        manufacturer: 'Bell',
        color: 'Vàng',
        size: 'L',
        quantity: 5,
        price: 2800000,
        status: 'Đang bán',
        description: 'Mũ bảo hiểm Bell Race Star thiết kế đua xe',
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
        product.manufacturer.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || product.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange() {
    this.filterProducts();
  }

  onStatusChange() {
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
      manufacturer: '',
      color: '',
      size: '',
      quantity: 0,
      price: 0,
      status: 'Đang bán',
      description: '',
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
}
