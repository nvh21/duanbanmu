import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: 'Bán hàng' | 'Kho' | 'Kế toán' | 'Marketing' | 'CSKH';
  status: 'Hoạt động' | 'Nghỉ việc' | 'Tạm nghỉ';
  joinDate: Date;
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss'],
})
export class StaffManagementComponent {
  searchTerm = '';
  selectedDept = 'all';
  selectedStatus = 'all';

  staffList: Staff[] = [];
  filtered: Staff[] = [];

  showModal = false;
  isEditMode = false;
  isViewMode = false;
  selected: Staff | null = null;
  form: Staff = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    department: 'Bán hàng',
    status: 'Hoạt động',
    joinDate: new Date(),
  };

  constructor() {
    this.seed();
    this.filtered = [...this.staffList];
  }

  seed() {
    this.staffList = [
      {
        id: 1,
        name: 'Nguyễn Minh Quân',
        email: 'quan@tdk.vn',
        phone: '0901234567',
        department: 'Bán hàng',
        status: 'Hoạt động',
        joinDate: new Date('2023-10-01'),
      },
      {
        id: 2,
        name: 'Trần Thu Hà',
        email: 'ha@tdk.vn',
        phone: '0912345678',
        department: 'Kho',
        status: 'Hoạt động',
        joinDate: new Date('2024-02-12'),
      },
      {
        id: 3,
        name: 'Phạm Đức Long',
        email: 'long@tdk.vn',
        phone: '0923456789',
        department: 'Kế toán',
        status: 'Tạm nghỉ',
        joinDate: new Date('2022-07-05'),
      },
      {
        id: 4,
        name: 'Lê Mai Anh',
        email: 'anh@tdk.vn',
        phone: '0934567890',
        department: 'CSKH',
        status: 'Hoạt động',
        joinDate: new Date('2024-04-22'),
      },
    ];
  }

  filter() {
    const term = this.searchTerm.toLowerCase();
    this.filtered = this.staffList.filter((s) => {
      const matchTerm = [s.name, s.email, s.phone].some((v) => v.toLowerCase().includes(term));
      const matchDept = this.selectedDept === 'all' || s.department === (this.selectedDept as any);
      const matchStatus =
        this.selectedStatus === 'all' || s.status === (this.selectedStatus as any);
      return matchTerm && matchDept && matchStatus;
    });
  }

  onSearchChange() {
    this.filter();
  }
  onDeptChange() {
    this.filter();
  }
  onStatusChange() {
    this.filter();
  }

  openAdd() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selected = null;
    this.form = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      department: 'Bán hàng',
      status: 'Hoạt động',
      joinDate: new Date(),
    };
    this.showModal = true;
  }

  openEdit(item: Staff) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selected = item;
    this.form = { ...item };
    this.showModal = true;
  }

  view(item: Staff) {
    this.isEditMode = false;
    this.isViewMode = true;
    this.selected = item;
    this.form = { ...item };
    this.showModal = true;
  }

  close() {
    this.showModal = false;
    this.isEditMode = false;
    this.isViewMode = false;
    this.selected = null;
  }

  save() {
    if (!this.form.name || !this.form.email) return;
    if (this.isEditMode && this.selected) {
      const idx = this.staffList.findIndex((s) => s.id === this.selected!.id);
      if (idx !== -1) this.staffList[idx] = { ...this.form };
    } else {
      const newId = Math.max(...this.staffList.map((s) => s.id), 0) + 1;
      this.staffList.unshift({ ...this.form, id: newId, joinDate: new Date() });
    }
    this.filter();
    this.close();
  }

  remove(item: Staff) {
    this.staffList = this.staffList.filter((s) => s.id !== item.id);
    this.filter();
  }

  statusClass(status: string): string {
    return status === 'Hoạt động'
      ? 'badge-active'
      : status === 'Tạm nghỉ'
      ? 'badge-pending'
      : 'badge-locked';
  }

  // Template helper for parsing date string (yyyy-MM-dd)
  dateFrom(value: string): Date {
    return new Date(value);
  }
}
