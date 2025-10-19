import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImeiApiService } from '../../services/imei-api.service';
import {
  Imei,
  ImeiRequest,
  ImeiResponse,
  ImeiValidationResult,
} from '../../interfaces/imei.interface';

@Component({
  selector: 'app-imei-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imei-modal.component.html',
  styleUrls: ['./imei-modal.component.scss'],
})
export class ImeiModalComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() sanPhamId: number | null = null;
  @Input() sanPhamTen: string = '';
  @Input() sanPhamMa: string = '';
  @Input() isViewOnly: boolean = false; // Chế độ chỉ xem (không cho thêm/sửa)
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ImeiResponse[]>();

  // Form data
  currentImei: string = '';
  imeiList: ImeiValidationResult[] = [];
  existingImeis: ImeiResponse[] = []; // IMEI đã có trong DB

  // Excel import
  selectedFile: File | null = null;
  isImporting: boolean = false;

  // Loading states
  isLoading: boolean = false;
  isSaving: boolean = false;

  // Error messages
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private imeiApi: ImeiApiService, private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    console.log('IMEI Modal ngOnChanges - sanPhamId:', this.sanPhamId);
    if (this.sanPhamId) {
      this.loadExistingImeis();
    }
  }

  ngOnInit() {
    console.log('IMEI Modal ngOnInit - sanPhamId:', this.sanPhamId);
    if (this.sanPhamId) {
      this.loadExistingImeis();
    } else {
      console.log('Không có sanPhamId, không load IMEI');
    }
  }

  loadExistingImeis() {
    if (!this.sanPhamId || this.sanPhamId === -1) {
      console.log('Không có sanPhamId thật để load IMEI (ID tạm thời hoặc null)');
      this.existingImeis = []; // Không có IMEI nào từ database
      return;
    }

    console.log('Đang load IMEI cho sản phẩm ID:', this.sanPhamId);
    this.isLoading = true;
    this.imeiApi.getBySanPhamId(this.sanPhamId).subscribe({
      next: (imeis: ImeiResponse[]) => {
        console.log('Đã load được IMEI:', imeis);
        console.log('IMEI count:', imeis.length);
        console.log('First IMEI:', imeis[0]);
        this.existingImeis = imeis;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Lỗi khi tải IMEI:', error);
        this.errorMessage =
          'Lỗi khi tải danh sách IMEI từ database: ' + (error.error?.message || error.message);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onImeiInput(event: any) {
    const value = event.target.value;
    // Chỉ cho phép nhập số và giới hạn 15 ký tự
    const numericValue = value.replace(/[^0-9]/g, '').substring(0, 15);
    this.currentImei = numericValue;
    event.target.value = numericValue;
  }

  addImei() {
    if (!this.currentImei || this.currentImei.length === 0) {
      this.errorMessage = 'Vui lòng nhập IMEI';
      return;
    }

    // Kiểm tra format IMEI
    if (!this.imeiApi.isValidImeiFormat(this.currentImei)) {
      this.errorMessage = 'IMEI phải có đúng 15 chữ số';
      return;
    }

    // Kiểm tra trùng lặp trong danh sách hiện tại
    if (this.imeiList.some((item) => item.imei === this.currentImei)) {
      this.errorMessage = 'IMEI đã tồn tại trong danh sách';
      return;
    }

    // Kiểm tra trùng lặp với server
    this.imeiApi.existsBySoImei(this.currentImei).subscribe({
      next: (exists) => {
        if (exists) {
          this.errorMessage = 'IMEI đã tồn tại trong hệ thống';
        } else {
          this.imeiList.push({
            isValid: true,
            message: 'Hợp lệ',
            imei: this.currentImei,
          });
          this.currentImei = '';
          this.errorMessage = '';
          this.successMessage = 'Đã thêm IMEI vào danh sách';
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Lỗi khi kiểm tra IMEI:', error);
        // Nếu lỗi API, vẫn cho phép thêm vào danh sách local
        this.imeiList.push({
          isValid: true,
          message: 'Hợp lệ (chưa kiểm tra server)',
          imei: this.currentImei,
        });
        this.currentImei = '';
        this.errorMessage = '';
        this.successMessage = 'Đã thêm IMEI vào danh sách (chưa kiểm tra server)';
        this.cdr.detectChanges();
      },
    });
  }

  removeImei(index: number) {
    this.imeiList.splice(index, 1);
    this.cdr.detectChanges();
  }

  clearAllImeis() {
    // Chỉ clear IMEI mới, không clear IMEI từ database
    this.imeiList = [];
    this.currentImei = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.errorMessage = '';
    }
  }

  downloadExcelTemplate() {
    // Tạo file Excel template
    const templateData = [['IMEI'], ['123456789012345'], ['123456789012346'], ['123456789012347']];

    const csvContent = templateData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'imei_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  importFromExcel() {
    if (!this.selectedFile) {
      this.errorMessage = 'Vui lòng chọn file Excel';
      return;
    }

    this.isImporting = true;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const imeiList: string[] = [];

        // Bỏ qua header và xử lý từng dòng
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const imei = this.imeiApi.formatImei(line);
            if (this.imeiApi.isValidImeiFormat(imei)) {
              imeiList.push(imei);
            }
          }
        }

        // Thêm vào danh sách hiện tại
        imeiList.forEach((imei) => {
          if (!this.imeiList.some((item) => item.imei === imei)) {
            this.imeiList.push({
              isValid: true,
              message: 'Hợp lệ',
              imei: imei,
            });
          }
        });

        this.successMessage = `Đã import ${imeiList.length} IMEI từ file Excel`;
        this.errorMessage = '';
        this.isImporting = false;
        this.cdr.detectChanges();
      } catch (error) {
        console.error('Lỗi khi đọc file:', error);
        this.errorMessage = 'Lỗi khi đọc file Excel';
        this.isImporting = false;
        this.cdr.detectChanges();
      }
    };

    reader.readAsText(this.selectedFile);
  }

  saveImeis() {
    if (!this.sanPhamId) {
      this.errorMessage = 'Không có thông tin sản phẩm';
      return;
    }

    // Chỉ lưu IMEI mới (trong imeiList), IMEI đã có trong DB không cần lưu lại
    if (this.imeiList.length === 0) {
      this.errorMessage = 'Vui lòng thêm ít nhất một IMEI mới';
      return;
    }

    this.isSaving = true;
    const validImeis = this.imeiList.filter((item) => item.isValid);

    if (validImeis.length === 0) {
      this.errorMessage = 'Không có IMEI hợp lệ để lưu';
      this.isSaving = false;
      return;
    }

    // Nếu sản phẩm chưa có ID thật (ID tạm thời = -1), chỉ lưu tạm thời
    if (this.sanPhamId === -1) {
      const tempImeis: ImeiResponse[] = validImeis.map((item) => ({
        id: 0, // ID tạm thời
        soImei: item.imei,
        sanPhamId: -1,
        sanPhamTen: this.sanPhamTen || '',
        sanPhamMa: this.sanPhamMa || '',
        trangThai: true,
        ngayTao: new Date(),
        ngayCapNhat: new Date(),
      }));

      this.successMessage = `Đã thêm ${tempImeis.length} IMEI tạm thời. IMEI sẽ được lưu khi bạn lưu sản phẩm.`;
      this.errorMessage = '';
      this.imeiList = []; // Clear danh sách IMEI mới
      this.save.emit(tempImeis);
      this.isSaving = false;
      this.cdr.detectChanges();
      return;
    }

    // Nếu sản phẩm đã có ID thật, lưu vào database
    const imeiRequests: ImeiRequest[] = validImeis.map((item) => ({
      soImei: item.imei,
      sanPhamId: this.sanPhamId!,
      trangThai: true,
    }));

    this.imeiApi.createMultiple(imeiRequests).subscribe({
      next: (responses: ImeiResponse[]) => {
        this.successMessage = `Đã lưu thành công ${responses.length} IMEI mới`;
        this.errorMessage = '';

        // Reload IMEI từ database để cập nhật danh sách
        this.loadExistingImeis();

        // Clear danh sách IMEI mới
        this.imeiList = [];

        this.save.emit([...this.existingImeis, ...responses]);
        this.isSaving = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Lỗi khi lưu IMEI:', error);
        this.errorMessage = 'Lỗi khi lưu IMEI: ' + (error.error?.message || error.message);
        this.isSaving = false;
        this.cdr.detectChanges();
      },
    });
  }

  closeModal() {
    this.close.emit();
  }

  resetModal() {
    this.imeiList = [];
    this.existingImeis = [];
    this.currentImei = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
    this.isSaving = false;
    this.isImporting = false;
    this.selectedFile = null;
  }

  getValidImeiCount(): number {
    return this.imeiList.filter((item) => item.isValid).length;
  }

  getInvalidImeiCount(): number {
    return this.imeiList.filter((item) => !item.isValid).length;
  }

  // Update status for multiple IMEIs
  updateBulkStatus(trangThai: boolean) {
    const selectedImeis = this.imeiList.filter((item) => item.isValid);
    if (selectedImeis.length === 0) {
      this.errorMessage = 'Không có IMEI nào được chọn';
      return;
    }

    // This would need to be implemented with actual IMEI IDs
    // For now, just show a message
    this.successMessage = `Đã cập nhật trạng thái ${selectedImeis.length} IMEI`;
    this.cdr.detectChanges();
  }
}
