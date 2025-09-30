import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface InventoryItem {
  id: number;
  productCode: string;
  productName: string;
  manufacturer: string;
  color: string;
  size: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  lastUpdated: Date;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstock';
  location: string;
  image: string;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedLocation: string = 'all';
  showModal: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  selectedItem: InventoryItem | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  newItem: InventoryItem = {
    id: 0,
    productCode: '',
    productName: '',
    manufacturer: '',
    color: '',
    size: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    totalValue: 0,
    lastUpdated: new Date(),
    status: 'In Stock',
    location: '',
    image: '',
  };

  ngOnInit() {
    this.loadSampleData();
    this.filteredItems = [...this.inventoryItems];
  }

  loadSampleData() {
    this.inventoryItems = [
      {
        id: 1,
        productCode: 'P001',
        productName: 'AGV K1 Helmet',
        manufacturer: 'AGV',
        color: 'Đen mờ',
        size: 'M',
        currentStock: 15,
        minStock: 5,
        maxStock: 50,
        unitPrice: 2500000,
        totalValue: 37500000,
        lastUpdated: new Date('2024-01-15'),
        status: 'In Stock',
        location: 'Kho A - Kệ 1',
        image: 'https://via.placeholder.com/60x45/FF5733/FFFFFF?text=AGV+K1',
      },
      {
        id: 2,
        productCode: 'P002',
        productName: 'Shoei X14 Helmet',
        manufacturer: 'Shoei',
        color: 'Đỏ',
        size: 'L',
        currentStock: 3,
        minStock: 5,
        maxStock: 30,
        unitPrice: 3500000,
        totalValue: 10500000,
        lastUpdated: new Date('2024-01-20'),
        status: 'Low Stock',
        location: 'Kho A - Kệ 2',
        image: 'https://via.placeholder.com/60x45/3366FF/FFFFFF?text=Shoei+X14',
      },
      {
        id: 3,
        productCode: 'P003',
        productName: 'Arai RX7V Helmet',
        manufacturer: 'Arai',
        color: 'Trắng',
        size: 'XL',
        currentStock: 0,
        minStock: 2,
        maxStock: 20,
        unitPrice: 4200000,
        totalValue: 0,
        lastUpdated: new Date('2024-01-25'),
        status: 'Out of Stock',
        location: 'Kho B - Kệ 3',
        image: 'https://via.placeholder.com/60x45/33FF57/000000?text=Arai+RX7V',
      },
      {
        id: 4,
        productCode: 'P004',
        productName: 'HJC RPHA 11 Helmet',
        manufacturer: 'HJC',
        color: 'Xanh dương',
        size: 'M',
        currentStock: 25,
        minStock: 10,
        maxStock: 40,
        unitPrice: 1800000,
        totalValue: 45000000,
        lastUpdated: new Date('2024-02-01'),
        status: 'In Stock',
        location: 'Kho A - Kệ 4',
        image: 'https://via.placeholder.com/60x45/FF33CC/FFFFFF?text=HJC+RPHA11',
      },
      {
        id: 5,
        productCode: 'P005',
        productName: 'Bell Race Star Helmet',
        manufacturer: 'Bell',
        color: 'Vàng',
        size: 'L',
        currentStock: 60,
        minStock: 15,
        maxStock: 50,
        unitPrice: 2800000,
        totalValue: 168000000,
        lastUpdated: new Date('2024-02-05'),
        status: 'Overstock',
        location: 'Kho B - Kệ 5',
        image: 'https://via.placeholder.com/60x45/33FFFF/000000?text=Bell+RaceStar',
      },
    ];
  }

  filterItems() {
    this.filteredItems = this.inventoryItems.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || item.status === this.selectedStatus;
      const matchesLocation =
        this.selectedLocation === 'all' || item.location === this.selectedLocation;
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }

  onSearchChange() {
    this.filterItems();
  }

  onStatusChange() {
    this.filterItems();
  }

  onLocationChange() {
    this.filterItems();
  }

  saveItem() {
    if (this.isEditMode && this.selectedItem) {
      // Cập nhật item
      const index = this.inventoryItems.findIndex((i) => i.id === this.selectedItem!.id);
      if (index !== -1) {
        this.newItem.totalValue = this.newItem.currentStock * this.newItem.unitPrice;
        this.newItem.lastUpdated = new Date();
        this.updateItemStatus();
        this.inventoryItems[index] = { ...this.newItem };
      }
    } else {
      // Thêm item mới
      this.newItem.id = Math.max(...this.inventoryItems.map((i) => i.id)) + 1;
      this.newItem.totalValue = this.newItem.currentStock * this.newItem.unitPrice;
      this.newItem.lastUpdated = new Date();
      this.updateItemStatus();
      this.inventoryItems.push({ ...this.newItem });
    }

    this.filterItems();
    this.closeModal();
  }

  updateItemStatus() {
    if (this.newItem.currentStock === 0) {
      this.newItem.status = 'Out of Stock';
    } else if (this.newItem.currentStock <= this.newItem.minStock) {
      this.newItem.status = 'Low Stock';
    } else if (this.newItem.currentStock >= this.newItem.maxStock) {
      this.newItem.status = 'Overstock';
    } else {
      this.newItem.status = 'In Stock';
    }
  }

  deleteItem(item: InventoryItem) {
    if (confirm(`Bạn có chắc chắn muốn xóa item "${item.productName}"?`)) {
      const index = this.inventoryItems.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        this.inventoryItems.splice(index, 1);
        this.filterItems();
      }
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In Stock':
        return 'status-in-stock';
      case 'Low Stock':
        return 'status-low-stock';
      case 'Out of Stock':
        return 'status-out-of-stock';
      case 'Overstock':
        return 'status-overstock';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'In Stock':
        return 'Còn hàng';
      case 'Low Stock':
        return 'Sắp hết';
      case 'Out of Stock':
        return 'Hết hàng';
      case 'Overstock':
        return 'Tồn kho cao';
      default:
        return status;
    }
  }

  getLocations(): string[] {
    return [...new Set(this.inventoryItems.map((item) => item.location))];
  }

  // Getter methods for stats cards
  get inStockCount(): number {
    return this.inventoryItems.filter((item) => item.status === 'In Stock').length;
  }

  get lowStockCount(): number {
    return this.inventoryItems.filter((item) => item.status === 'Low Stock').length;
  }

  get outOfStockCount(): number {
    return this.inventoryItems.filter((item) => item.status === 'Out of Stock').length;
  }

  get overstockCount(): number {
    return this.inventoryItems.filter((item) => item.status === 'Overstock').length;
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedItem = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.newItem = {
      id: 0,
      productCode: '',
      productName: '',
      manufacturer: '',
      color: '',
      size: '',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unitPrice: 0,
      totalValue: 0,
      lastUpdated: new Date(),
      status: 'In Stock',
      location: '',
      image: '',
    };
    this.showModal = true;
  }

  openEditModal(item: InventoryItem) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selectedItem = item;
    this.selectedFile = null;
    this.imagePreview = null;
    this.newItem = { ...item };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedItem = null;
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  viewItem(item: InventoryItem) {
    this.isViewMode = true;
    this.isEditMode = false;
    this.selectedItem = item;
    this.selectedFile = null;
    this.imagePreview = null;
    this.newItem = { ...item };
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
        this.newItem.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.newItem.image = '';
  }
}
