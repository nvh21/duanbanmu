import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PromotionFormData {
  id?: string;
  code: string;
  name: string;
  discountType: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  condition: string;
  status: string;
}

@Component({
  selector: 'app-promotion-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotion-modal.component.html',
  styleUrls: ['./promotion-modal.component.scss'],
})
export class PromotionModalComponent {
  @Input() isVisible = false;
  @Input() promotionData: PromotionFormData | null = null;
  @Input() isEditMode = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<PromotionFormData>();

  formData: PromotionFormData = {
    code: '',
    name: '',
    discountType: 'Phần trăm',
    discountValue: '',
    startDate: '',
    endDate: '',
    condition: '',
    status: 'Chưa bắt đầu',
  };

  discountTypes = [
    { value: 'Phần trăm', label: 'Phần trăm (%)' },
    { value: 'Số tiền cố định', label: 'Số tiền cố định (₫)' },
    { value: 'Sản phẩm tặng', label: 'Sản phẩm tặng' },
  ];

  statusOptions = [
    { value: 'Chưa bắt đầu', label: 'Chưa bắt đầu' },
    { value: 'Sắp diễn ra', label: 'Sắp diễn ra' },
    { value: 'Đang hoạt động', label: 'Đang hoạt động' },
    { value: 'Đã kết thúc', label: 'Đã kết thúc' },
  ];

  ngOnChanges() {
    if (this.promotionData) {
      this.formData = { ...this.promotionData };
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = {
      code: '',
      name: '',
      discountType: 'Phần trăm',
      discountValue: '',
      startDate: '',
      endDate: '',
      condition: '',
      status: 'Chưa bắt đầu',
    };
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  onSave() {
    if (this.validateForm()) {
      this.save.emit(this.formData);
      this.resetForm();
    }
  }

  validateForm(): boolean {
    // Basic validation
    if (!this.formData.code || !this.formData.name || !this.formData.discountValue) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return false;
    }
    return true;
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
