import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ProductApiService,
  SanPhamResponse,
  PageResponse,
} from '../../services/product-api.service';
import { QuickAddModalComponent } from '../quick-add-modal/quick-add-modal.component';
import {
  SearchableDropdownComponent,
  DropdownOption,
} from '../searchable-dropdown/searchable-dropdown.component';
import {
  LoaiMuBaoHiemApiService,
  LoaiMuBaoHiemRequest,
} from '../../services/loai-mu-bao-hiem-api.service';

interface HelmetProduct {
  id: number;
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
  price: number;
  status: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Removed legacy Manufacturer demo interface

@Component({
  selector: 'app-helmets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    QuickAddModalComponent,
    SearchableDropdownComponent,
  ],
  templateUrl: './helmets.component.html',
  styleUrls: ['./helmets.component.scss', './table-styles.scss'],
})
export class HelmetsComponent implements OnInit {
  helmetProducts: HelmetProduct[] = [];
  filteredProducts: HelmetProduct[] = [];
  loaiMuList: { id: number; tenLoai: string }[] = [];
  nsxList: { id: number; tenNhaSanXuat: string }[] = [];
  chatLieuList: { id: number; tenChatLieu: string }[] = [];
  trongLuongList: { id: number; giaTriTrongLuong: number }[] = [];
  xuatXuList: { id: number; tenXuatXu: string }[] = [];
  kieuDangList: { id: number; tenKieuDang: string }[] = [];
  congNgheList: { id: number; tenCongNghe: string }[] = [];

  // Converted data for searchable dropdowns
  loaiMuOptions: DropdownOption[] = [];
  nsxOptions: DropdownOption[] = [];
  chatLieuOptions: DropdownOption[] = [];
  trongLuongOptions: DropdownOption[] = [];
  xuatXuOptions: DropdownOption[] = [];
  kieuDangOptions: DropdownOption[] = [];
  congNgheOptions: DropdownOption[] = [];
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
    code: '',
    name: '',
    loaiMuBaoHiemId: null,
    nhaSanXuatId: null,
    chatLieuVoId: null,
    trongLuongId: null,
    xuatXuId: null,
    kieuDangMuId: null,
    congNgheAnToanId: null,
    price: 0,
    status: 'Đang bán',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Quick Add Modal state
  showQuickAddModal: boolean = false;
  quickAddModalType: string = '';

  constructor(
    private productApi: ProductApiService,
    private cdr: ChangeDetectorRef,
    private loaiMuBaoHiemApi: LoaiMuBaoHiemApiService
  ) {}

  ngOnInit() {
    this.loadLookups();
    this.fetchProducts();

    // Test API connection
    this.testApiConnection();
  }

  testApiConnection() {
    console.log('Testing API connection...');
    this.productApi.getLoaiMuBaoHiemAll().subscribe({
      next: (data) => {
        console.log('API Test Success - Helmet types:', data?.length || 0, 'items');
      },
      error: (error) => {
        console.error('API Test Failed:', error);
      },
    });
  }

  loadLookups() {
    this.loadHelmetTypes();
    this.productApi.getNhaSanXuatAll().subscribe({
      next: (res: any) => {
        this.nsxList = (res.content || []).map((x: any) => ({
          id: x.id,
          tenNhaSanXuat: x.tenNhaSanXuat || x.ten,
        }));
        this.nsxOptions = this.nsxList.map((x) => ({ id: x.id, name: x.tenNhaSanXuat }));
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading manufacturers:', error);
      },
    });
    this.productApi.getChatLieuVoAll().subscribe((res: any) => {
      this.chatLieuList = (res.content || []).map((x: any) => ({
        id: x.id,
        tenChatLieu: x.tenChatLieu,
      }));
      this.chatLieuOptions = this.chatLieuList.map((x) => ({ id: x.id, name: x.tenChatLieu }));
      this.cdr.detectChanges();
    });
    this.productApi.getTrongLuongAll().subscribe((data: any[]) => {
      this.trongLuongList = (data || []).map((x: any) => ({
        id: x.id,
        giaTriTrongLuong: x.giaTriTrongLuong,
      }));
      this.trongLuongOptions = this.trongLuongList.map((x) => ({
        id: x.id,
        name: `${x.giaTriTrongLuong}g`,
      }));
      this.cdr.detectChanges();
    });
    this.productApi.getXuatXuAll().subscribe((data: any[]) => {
      this.xuatXuList = (data || []).map((x: any) => ({ id: x.id, tenXuatXu: x.tenXuatXu }));
      this.xuatXuOptions = this.xuatXuList.map((x) => ({ id: x.id, name: x.tenXuatXu }));
      this.cdr.detectChanges();
    });
    this.productApi.getKieuDangMuAll().subscribe((res: any) => {
      this.kieuDangList = (res.content || []).map((x: any) => ({
        id: x.id,
        tenKieuDang: x.tenKieuDang,
      }));
      this.kieuDangOptions = this.kieuDangList.map((x) => ({ id: x.id, name: x.tenKieuDang }));
      this.cdr.detectChanges();
    });
    this.productApi.getCongNgheAnToanAll().subscribe((data: any[]) => {
      this.congNgheList = (data || []).map((x: any) => ({ id: x.id, tenCongNghe: x.tenCongNghe }));
      this.congNgheOptions = this.congNgheList.map((x) => ({ id: x.id, name: x.tenCongNghe }));
      this.cdr.detectChanges();
    });
  }

  // pagination + sorting state
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  sortField: string = 'id';
  sortDir: 'asc' | 'desc' = 'desc';

  fetchProducts() {
    this.productApi
      .search({
        keyword: this.searchTerm || undefined,
        page: this.page,
        size: this.size,
        sort: `${this.sortField},${this.sortDir}`,
      })
      .subscribe({
        next: (res: PageResponse<SanPhamResponse>) => {
          this.helmetProducts = (res.content || []).map((p) => ({
            id: p.id,
            code: (p as any).maSanPham ?? p.maSanPham ?? '',
            name: (p as any).tenSanPham ?? p.tenSanPham ?? '',
            // ids for editing
            loaiMuBaoHiemId: (p as any).loaiMuBaoHiemId ?? p.loaiMuBaoHiemId ?? null,
            nhaSanXuatId: (p as any).nhaSanXuatId ?? p.nhaSanXuatId ?? null,
            chatLieuVoId: (p as any).chatLieuVoId ?? p.chatLieuVoId ?? null,
            trongLuongId: (p as any).trongLuongId ?? p.trongLuongId ?? null,
            xuatXuId: (p as any).xuatXuId ?? p.xuatXuId ?? null,
            kieuDangMuId: (p as any).kieuDangMuId ?? p.kieuDangMuId ?? null,
            congNgheAnToanId: (p as any).congNgheAnToanId ?? p.congNgheAnToanId ?? null,
            loaiMuBaoHiem: p.loaiMuBaoHiemTen ?? null,
            nhaSanXuat: p.nhaSanXuatTen ?? null,
            chatLieuVo: p.chatLieuVoTen ?? null,
            trongLuong: p.trongLuongTen ?? null,
            xuatXu: p.xuatXuTen ?? null,
            kieuDangMu: p.kieuDangMuTen ?? null,
            congNgheAnToan: p.congNgheAnToanTen ?? null,
            price: Number(p.giaBan ?? 0),
            status: p.trangThai ? 'Đang bán' : 'Ngừng bán',
            description: p.moTa ?? '',
            createdAt: new Date((p as any).ngayTao ?? new Date()),
            updatedAt: new Date(),
          }));
          this.filteredProducts = [...this.helmetProducts];
          this.totalElements = res.totalElements ?? 0;
          this.totalPages = res.totalPages ?? 0;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('SanPham search error:', err);
          this.helmetProducts = [];
          this.filteredProducts = [];
          this.totalElements = 0;
          this.totalPages = 0;
          this.cdr.detectChanges();
        },
      });
  }

  changePageSize(newSize: number) {
    this.size = Number(newSize) || 10;
    this.page = 0;
    this.fetchProducts();
  }

  prevPage() {
    if (this.page > 0) {
      this.page -= 1;
      this.fetchProducts();
    }
  }

  nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page += 1;
      this.fetchProducts();
    }
  }

  changeSort(field: string) {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'desc';
    }
    this.page = 0;
    this.fetchProducts();
  }

  // legacy demo manufacturers removed

  filterProducts() {
    this.filteredProducts = this.helmetProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(this.searchTerm.toLowerCase());
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

  // removed manufacturer filter

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
    this.isEditMode = false;
    this.isViewMode = false;
  }

  canSubmit(): boolean {
    return (
      !!this.newProduct.code?.trim() &&
      !!this.newProduct.name?.trim() &&
      !!this.newProduct.price &&
      this.newProduct.price > 0 &&
      Number.isInteger(Number(this.newProduct.loaiMuBaoHiemId)) &&
      Number.isInteger(Number(this.newProduct.nhaSanXuatId)) &&
      Number.isInteger(Number(this.newProduct.chatLieuVoId)) &&
      Number.isInteger(Number(this.newProduct.trongLuongId)) &&
      Number.isInteger(Number(this.newProduct.xuatXuId)) &&
      Number.isInteger(Number(this.newProduct.kieuDangMuId)) &&
      Number.isInteger(Number(this.newProduct.congNgheAnToanId))
    );
  }

  onSelect(field: keyof HelmetProduct, value: any) {
    const n = Number(value);
    (this.newProduct as any)[field] = Number.isFinite(n) ? n : value;
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
    // Chuẩn hóa giá trị danh mục: gõ hoặc chọn đều được (bỏ dấu, so khớp gần đúng)
    const stripAccents = (v: string) =>
      (v || '')
        .normalize('NFD')
        .replace(/\p{Diacritic}+/gu, '')
        .toLowerCase()
        .trim();

    const normalizeId = (raw: any, list: any[], nameKey: string): number | undefined => {
      // Người dùng nhập số → coi như ID
      const asNumber = Number(raw);
      if (Number.isInteger(asNumber) && asNumber > 0) return asNumber;

      const s = stripAccents(String(raw ?? ''));
      if (!s) return undefined;

      // So khớp chính xác (bỏ dấu)
      let found = list.find((x: any) => stripAccents(String(x[nameKey] ?? '')) === s);
      if (found) return Number(found.id);

      // So khớp gần đúng (contains)
      found = list.find((x: any) => stripAccents(String(x[nameKey] ?? '')).includes(s));
      return found ? Number(found.id) : undefined;
    };

    this.newProduct.loaiMuBaoHiemId = normalizeId(
      this.newProduct.loaiMuBaoHiemId,
      this.loaiMuList,
      'tenLoai'
    );
    this.newProduct.nhaSanXuatId = normalizeId(
      this.newProduct.nhaSanXuatId,
      this.nsxList,
      'tenNhaSanXuat'
    );
    this.newProduct.chatLieuVoId = normalizeId(
      this.newProduct.chatLieuVoId,
      this.chatLieuList,
      'tenChatLieu'
    );
    this.newProduct.trongLuongId = normalizeId(
      this.newProduct.trongLuongId,
      this.trongLuongList as any,
      'giaTriTrongLuong'
    );
    this.newProduct.xuatXuId = normalizeId(this.newProduct.xuatXuId, this.xuatXuList, 'tenXuatXu');
    this.newProduct.kieuDangMuId = normalizeId(
      this.newProduct.kieuDangMuId,
      this.kieuDangList,
      'tenKieuDang'
    );
    this.newProduct.congNgheAnToanId = normalizeId(
      this.newProduct.congNgheAnToanId,
      this.congNgheList,
      'tenCongNghe'
    );

    // Kiểm tra đủ danh mục sau chuẩn hóa để tránh 400 từ BE
    const missing: string[] = [];
    if (!this.newProduct.loaiMuBaoHiemId) missing.push('Loại mũ');
    if (!this.newProduct.nhaSanXuatId) missing.push('Nhà sản xuất');
    if (!this.newProduct.chatLieuVoId) missing.push('Chất liệu vỏ');
    if (!this.newProduct.trongLuongId) missing.push('Trọng lượng');
    if (!this.newProduct.xuatXuId) missing.push('Xuất xứ');
    if (!this.newProduct.kieuDangMuId) missing.push('Kiểu dáng mũ');
    if (!this.newProduct.congNgheAnToanId) missing.push('Công nghệ an toàn');
    if (missing.length) {
      alert('Vui lòng chọn: ' + missing.join(', '));
      return;
    }

    if (this.isEditMode && this.selectedProduct) {
      const payloadUpdate = {
        maSanPham: this.newProduct.code,
        tenSanPham: this.newProduct.name,
        moTa: this.newProduct.description || '',
        giaBan: this.newProduct.price || 0,
        trangThai: this.newProduct.status !== 'Ngừng bán',
        loaiMuBaoHiemId: Number(this.newProduct.loaiMuBaoHiemId),
        nhaSanXuatId: Number(this.newProduct.nhaSanXuatId),
        chatLieuVoId: Number(this.newProduct.chatLieuVoId),
        trongLuongId: Number(this.newProduct.trongLuongId),
        xuatXuId: Number(this.newProduct.xuatXuId),
        kieuDangMuId: Number(this.newProduct.kieuDangMuId),
        congNgheAnToanId: Number(this.newProduct.congNgheAnToanId),
      } as any;

      this.productApi.update(this.selectedProduct.id, payloadUpdate).subscribe({
        next: () => {
          this.fetchProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          const msg =
            (err?.error && (err.error.message || err.error.error)) ||
            'Cập nhật thất bại. Vui lòng kiểm tra dữ liệu.';
          alert(msg);
        },
      });
      return;
    }

    // Chuyển các ô nhập ID (đang là text) sang số nếu hợp lệ
    const toId = (v: any) => Number(v);

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
        this.fetchProducts();
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        if (err?.status === 409) {
          alert('Mã sản phẩm đã tồn tại. Vui lòng dùng mã khác.');
          return;
        }
        if (err?.status === 400) {
          const msg400 =
            (err?.error && (err.error.message || err.error.error)) ||
            'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các danh mục và giá trị bắt buộc.';
          alert(msg400);
          return;
        }
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
      this.productApi.delete(this.productToDelete.id).subscribe({
        next: () => {
          this.fetchProducts();
        },
        error: (err) => {
          console.error(err);
          alert('Xóa thất bại');
        },
      });
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
    this.newProduct = { ...product };
    this.showModal = true;
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedProduct = null;
    this.newProduct = {
      id: 0,
      code: '',
      name: '',
      price: 0,
      status: 'Đang bán',
      description: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Force reload helmet types if empty
    if (this.loaiMuList.length === 0) {
      console.log('Reloading helmet types for modal...');
      this.loadHelmetTypes();
    }

    this.showModal = true;
  }

  loadHelmetTypes() {
    console.log('Loading helmet types...');
    this.productApi.getLoaiMuBaoHiemAll().subscribe({
      next: (data) => {
        console.log('Helmet types loaded:', data);
        this.loaiMuList = (data || []).map((x) => ({ id: x.id, tenLoai: x.tenLoai }));
        this.loaiMuOptions = this.loaiMuList.map((x) => ({ id: x.id, name: x.tenLoai }));
        console.log('LoaiMuList updated:', this.loaiMuList);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading helmet types:', error);
        alert(
          'Lỗi khi tải danh sách loại mũ bảo hiểm: ' +
            (error.message || 'Không thể kết nối đến server')
        );
      },
    });
  }

  openEditModal(product: HelmetProduct) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selectedProduct = product;
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

  // Method để mở modal thêm nhanh
  openQuickAddModal(type: string) {
    console.log('Opening quick add modal for:', type);
    this.quickAddModalType = type;
    this.showQuickAddModal = true;
  }

  // Method để xử lý save từ quick add modal
  onQuickAddSave(event: { type: string; data: any }) {
    console.log('Quick add save event:', event);

    if (event.type === 'loaiMuBaoHiem') {
      const request: LoaiMuBaoHiemRequest = {
        tenLoai: event.data.tenLoai,
        moTa: event.data.moTa,
        trangThai: event.data.trangThai,
      };

      this.loaiMuBaoHiemApi.create(request).subscribe({
        next: (response) => {
          console.log('LoaiMuBaoHiem created:', response);
          alert('Thêm mới Loại mũ bảo hiểm thành công!');
          this.loadHelmetTypes(); // Refresh dropdown
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error creating LoaiMuBaoHiem:', error);
          alert(
            'Lỗi khi thêm mới Loại mũ bảo hiểm: ' +
              (error.error?.message || error.message || 'Không thể kết nối đến server')
          );
        },
      });
    } else {
      // Tạm thời hiển thị alert cho các loại khác
      const typeNames: { [key: string]: string } = {
        nhaSanXuat: 'Nhà sản xuất',
        chatLieuVo: 'Chất liệu vỏ',
        trongLuong: 'Trọng lượng',
        xuatXu: 'Xuất xứ',
        kieuDangMu: 'Kiểu dáng mũ',
        congNgheAnToan: 'Công nghệ an toàn',
      };

      const typeName = typeNames[event.type] || event.type;
      alert(
        `Tính năng thêm mới "${typeName}" sẽ được implement sau. Hiện tại bạn có thể thêm mới từ menu "Quản lý sản phẩm" tương ứng.`
      );
    }

    this.onQuickAddClose(); // Close modal
  }

  // Method để đóng quick add modal
  onQuickAddClose() {
    this.showQuickAddModal = false;
    this.quickAddModalType = '';
    this.cdr.detectChanges();
  }
}
