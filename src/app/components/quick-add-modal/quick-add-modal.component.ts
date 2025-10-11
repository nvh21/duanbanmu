import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quick-add-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-add-modal.component.html',
  styleUrls: ['./quick-add-modal.component.scss'],
})
export class QuickAddModalComponent implements OnInit, OnChanges {
  @Input() type: string = ''; // e.g., 'loaiMuBaoHiem', 'nhaSanXuat'
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form: any = {};
  modalTitle: string = '';
  fields: {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    options?: { value: any; label: string }[];
  }[] = [];

  ngOnInit() {
    this.initializeFormAndFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['type'] || (changes['show'] && this.show)) {
      this.initializeFormAndFields();
    }
  }

  initializeFormAndFields() {
    this.form = {};
    this.fields = [];

    switch (this.type) {
      case 'loaiMuBaoHiem':
        this.modalTitle = 'Thêm mới Loại mũ bảo hiểm';
        this.fields = [
          { name: 'tenLoai', label: 'Tên loại mũ bảo hiểm', type: 'text', required: true },
          { name: 'moTa', label: 'Mô tả', type: 'textarea' },
          {
            name: 'trangThai',
            label: 'Trạng thái',
            type: 'select',
            options: [
              { value: true, label: 'Đang dùng' },
              { value: false, label: 'Không dùng nữa' },
            ],
          },
        ];
        this.form.trangThai = true; // Default status
        break;
      case 'nhaSanXuat':
        this.modalTitle = 'Thêm mới Nhà sản xuất';
        this.fields = [
          { name: 'tenNhaSanXuat', label: 'Tên nhà sản xuất', type: 'text', required: true },
          { name: 'moTa', label: 'Mô tả', type: 'textarea' },
          {
            name: 'trangThai',
            label: 'Trạng thái',
            type: 'select',
            options: [
              { value: true, label: 'Đang dùng' },
              { value: false, label: 'Không dùng nữa' },
            ],
          },
        ];
        this.form.trangThai = true;
        break;
      case 'chatLieuVo':
        this.modalTitle = 'Thêm mới Chất liệu vỏ';
        this.fields = [
          { name: 'tenChatLieu', label: 'Tên chất liệu vỏ', type: 'text', required: true },
          { name: 'moTa', label: 'Mô tả', type: 'textarea' },
          {
            name: 'trangThai',
            label: 'Trạng thái',
            type: 'select',
            options: [
              { value: true, label: 'Đang dùng' },
              { value: false, label: 'Không dùng nữa' },
            ],
          },
        ];
        this.form.trangThai = true;
        break;
      case 'trongLuong':
        this.modalTitle = 'Thêm mới Trọng lượng';
        this.fields = [
          {
            name: 'giaTriTrongLuong',
            label: 'Giá trị trọng lượng (gram)',
            type: 'number',
            required: true,
          },
          { name: 'moTa', label: 'Mô tả', type: 'textarea' },
          {
            name: 'trangThai',
            label: 'Trạng thái',
            type: 'select',
            options: [
              { value: true, label: 'Đang dùng' },
              { value: false, label: 'Không dùng nữa' },
            ],
          },
        ];
        this.form.trangThai = true;
        break;
      case 'xuatXu':
        this.modalTitle = 'Thêm mới Xuất xứ';
        this.fields = [
          { name: 'tenXuatXu', label: 'Tên xuất xứ', type: 'text', required: true },
          { name: 'moTa', label: 'Mô tả', type: 'textarea' },
          {
            name: 'trangThai',
            label: 'Trạng thái',
            type: 'select',
            options: [
              { value: true, label: 'Đang dùng' },
              { value: false, label: 'Không dùng nữa' },
            ],
          },
        ];
        this.form.trangThai = true;
        break;
      case 'kieuDangMu':
        this.modalTitle = 'Thêm mới Kiểu dáng mũ';
        this.fields = [
          { name: 'tenKieuDang', label: 'Tên kiểu dáng mũ', type: 'text', required: true },
          { name: 'moTa', label: 'Mô tả', type: 'textarea' },
          {
            name: 'trangThai',
            label: 'Trạng thái',
            type: 'select',
            options: [
              { value: true, label: 'Đang dùng' },
              { value: false, label: 'Không dùng nữa' },
            ],
          },
        ];
        this.form.trangThai = true;
        break;
      case 'congNgheAnToan':
        this.modalTitle = 'Thêm mới Công nghệ an toàn';
        this.fields = [
          { name: 'tenCongNghe', label: 'Tên công nghệ an toàn', type: 'text', required: true },
          { name: 'moTa', label: 'Mô tả', type: 'textarea' },
          {
            name: 'trangThai',
            label: 'Trạng thái',
            type: 'select',
            options: [
              { value: true, label: 'Đang dùng' },
              { value: false, label: 'Không dùng nữa' },
            ],
          },
        ];
        this.form.trangThai = true;
        break;
      case 'mauSac':
        this.modalTitle = 'Thêm mới Màu sắc';
        this.fields = [
          { name: 'tenMau', label: 'Tên màu sắc', type: 'text', required: true },
          { name: 'maMau', label: 'Mã màu (hex)', type: 'text' },
          { name: 'moTa', label: 'Mô tả', type: 'textarea' },
          {
            name: 'trangThai',
            label: 'Trạng thái',
            type: 'select',
            options: [
              { value: true, label: 'Đang dùng' },
              { value: false, label: 'Không dùng nữa' },
            ],
          },
        ];
        this.form.trangThai = true;
        break;
      default:
        this.modalTitle = 'Thêm mới';
        break;
    }
  }

  onSave() {
    for (const field of this.fields) {
      if (
        field.required &&
        (!this.form[field.name] || String(this.form[field.name]).trim() === '')
      ) {
        alert(`Vui lòng nhập ${field.label.toLowerCase()}`);
        return;
      }
    }
    this.save.emit({ type: this.type, data: this.form });
  }

  closeModal() {
    this.close.emit();
  }
}
