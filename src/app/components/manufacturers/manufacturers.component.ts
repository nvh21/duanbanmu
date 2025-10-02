import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  showModal: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  selectedManufacturer: Manufacturer | null = null;
  showDeleteModal: boolean = false;
  manufacturerToDelete: Manufacturer | null = null;
  newManufacturer: Manufacturer = {
    id: 0,
    code: '',
    name: '',
    country: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  countries = [
    'Việt Nam',
    'Thái Lan',
    'Indonesia',
    'Malaysia',
    'Singapore',
    'Philippines',
    'Myanmar',
    'Cambodia',
    'Laos',
    'Brunei',
    'Trung Quốc',
    'Nhật Bản',
    'Hàn Quốc',
    'Đài Loan',
    'Hồng Kông',
    'Mỹ',
    'Canada',
    'Mexico',
    'Brazil',
    'Argentina',
    'Anh',
    'Pháp',
    'Đức',
    'Ý',
    'Tây Ban Nha',
    'Hà Lan',
    'Bỉ',
    'Thụy Sĩ',
    'Áo',
    'Thụy Điển',
    'Na Uy',
    'Đan Mạch',
    'Phần Lan',
    'Ba Lan',
    'Cộng hòa Séc',
    'Hungary',
    'Romania',
    'Bulgaria',
    'Croatia',
    'Slovenia',
    'Slovakia',
    'Estonia',
    'Latvia',
    'Lithuania',
    'Ukraine',
    'Nga',
    'Belarus',
    'Moldova',
    'Georgia',
    'Armenia',
    'Azerbaijan',
    'Kazakhstan',
    'Uzbekistan',
    'Kyrgyzstan',
    'Tajikistan',
    'Turkmenistan',
    'Mông Cổ',
    'Afghanistan',
    'Pakistan',
    'Ấn Độ',
    'Bangladesh',
    'Sri Lanka',
    'Nepal',
    'Bhutan',
    'Maldives',
    'Úc',
    'New Zealand',
    'Fiji',
    'Papua New Guinea',
    'Samoa',
    'Tonga',
    'Vanuatu',
    'Solomon Islands',
    'Palau',
    'Micronesia',
    'Marshall Islands',
    'Kiribati',
    'Tuvalu',
    'Nauru',
    'Cook Islands',
    'Niue',
    'Tokelau',
    'Pitcairn Islands',
    'Norfolk Island',
    'Christmas Island',
    'Cocos Islands',
    'Heard Island',
    'McDonald Islands',
    'Ashmore and Cartier Islands',
    'Coral Sea Islands',
    'Australian Antarctic Territory',
    'French Southern Territories',
    'South Georgia and South Sandwich Islands',
    'Bouvet Island',
    'Peter I Island',
    'Queen Maud Land',
    'Ross Dependency',
    'Adélie Land',
    'Australian Antarctic Territory',
    'British Antarctic Territory',
    'Chilean Antarctic Territory',
    'Argentine Antarctica',
    'Norwegian Antarctic Territory',
    'Marie Byrd Land',
    'Wilkes Land',
    'Victoria Land',
    'George V Land',
    'Oates Land',
    'Adélie Land',
    'Wilkes Land',
    'Queen Mary Land',
    'Princess Elizabeth Land',
    'Kaiser Wilhelm II Land',
    'Queen Maud Land',
    'Coats Land',
    'Caird Coast',
    'Luitpold Coast',
    'Princess Martha Coast',
    'Princess Astrid Coast',
    'Princess Ragnhild Coast',
    'Prince Harald Coast',
    'Prince Olav Coast',
    'Bouvet Island',
    'Peter I Island',
    'Queen Maud Land',
    'Ross Dependency',
    'Adélie Land',
  ];

  ngOnInit() {
    this.loadSampleData();
    this.filteredManufacturers = [...this.manufacturers];
  }

  loadSampleData() {
    this.manufacturers = [
      {
        id: 1,
        code: 'AGV001',
        name: 'AGV',
        country: 'Italy',
        description:
          'Nhà sản xuất mũ bảo hiểm cao cấp từ Italy, chuyên về mũ bảo hiểm thể thao và đua xe',
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
        description:
          'Thương hiệu mũ bảo hiểm nổi tiếng từ Nhật Bản, được biết đến với chất lượng và công nghệ tiên tiến',
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
        description:
          'Nhà sản xuất mũ bảo hiểm chất lượng cao từ Nhật Bản, chuyên về mũ bảo hiểm đua xe và thể thao',
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
        description:
          'Thương hiệu mũ bảo hiểm giá cả hợp lý từ Hàn Quốc, cung cấp sản phẩm chất lượng tốt với giá phải chăng',
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
        description:
          'Nhà sản xuất mũ bảo hiểm thể thao từ Mỹ, chuyên về mũ bảo hiểm đua xe và mô tô',
        contactEmail: 'info@bellhelmets.com',
        contactPhone: '+1 555 123 4567',
        address: '456 Main St, Los Angeles, CA, USA',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
    ];
  }

  filterManufacturers() {
    this.filteredManufacturers = this.manufacturers.filter((manufacturer) => {
      const matchesSearch =
        manufacturer.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        manufacturer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        manufacturer.country.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        manufacturer.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCountry =
        this.selectedCountry === 'all' || manufacturer.country === this.selectedCountry;
      return matchesSearch && matchesCountry;
    });
  }

  onSearchChange() {
    this.filterManufacturers();
  }

  onCountryChange() {
    this.filterManufacturers();
  }

  closeModal() {
    this.showModal = false;
    this.selectedManufacturer = null;
    this.isEditMode = false;
    this.isViewMode = false;
  }

  saveManufacturer() {
    // Validation: Kiểm tra các trường bắt buộc
    if (
      !this.newManufacturer.code.trim() ||
      !this.newManufacturer.name.trim() ||
      !this.newManufacturer.country.trim()
    ) {
      alert('Vui lòng điền đầy đủ thông tin nhà sản xuất!');
      return;
    }

    if (this.isEditMode && this.selectedManufacturer) {
      // Cập nhật nhà sản xuất
      const index = this.manufacturers.findIndex((m) => m.id === this.selectedManufacturer!.id);
      if (index !== -1) {
        this.manufacturers[index] = { ...this.newManufacturer, updatedAt: new Date() };
      }
    } else {
      // Thêm nhà sản xuất mới
      this.newManufacturer.id = Math.max(...this.manufacturers.map((m) => m.id)) + 1;
      this.newManufacturer.createdAt = new Date();
      this.newManufacturer.updatedAt = new Date();
      this.manufacturers.push({ ...this.newManufacturer });
    }

    this.filterManufacturers();
    this.closeModal();
  }

  deleteManufacturer(manufacturer: Manufacturer) {
    this.manufacturerToDelete = manufacturer;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.manufacturerToDelete) {
      const index = this.manufacturers.findIndex((m) => m.id === this.manufacturerToDelete!.id);
      if (index !== -1) {
        this.manufacturers.splice(index, 1);
        this.filterManufacturers();
      }
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
      code: '',
      name: '',
      country: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      createdAt: new Date(),
      updatedAt: new Date(),
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

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  trackByManufacturerId(index: number, manufacturer: Manufacturer): number {
    return manufacturer.id;
  }
}
