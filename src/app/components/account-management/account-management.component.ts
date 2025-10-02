import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Nhân viên' | 'Quản lý kho' | 'Kế toán';
  status: 'Hoạt động' | 'Khóa';
  createdAt: Date;
}

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss'],
})
export class AccountManagementComponent {
  searchTerm = '';
  selectedRole = 'all';
  selectedStatus = 'all';

  users: UserAccount[] = [];
  filteredUsers: UserAccount[] = [];

  showModal = false;
  isEditMode = false;
  isViewMode = false;
  selectedUser: UserAccount | null = null;
  newUser: UserAccount = {
    id: 0,
    name: '',
    email: '',
    role: 'Nhân viên',
    status: 'Hoạt động',
    createdAt: new Date(),
  };

  constructor() {
    this.seedUsers();
    this.filteredUsers = [...this.users];
  }

  seedUsers() {
    this.users = [
      {
        id: 1,
        name: 'Trịnh Quốc Khánh',
        email: 'khanh@tdk.vn',
        role: 'Admin',
        status: 'Hoạt động',
        createdAt: new Date('2024-01-05'),
      },
      {
        id: 2,
        name: 'Nguyễn Văn An',
        email: 'an@tdk.vn',
        role: 'Nhân viên',
        status: 'Hoạt động',
        createdAt: new Date('2024-02-12'),
      },
      {
        id: 3,
        name: 'Trần Thị Bình',
        email: 'binh@tdk.vn',
        role: 'Kế toán',
        status: 'Khóa',
        createdAt: new Date('2024-03-18'),
      },
      {
        id: 4,
        name: 'Phạm Đức Cường',
        email: 'cuong@tdk.vn',
        role: 'Quản lý kho',
        status: 'Hoạt động',
        createdAt: new Date('2024-04-22'),
      },
      {
        id: 5,
        name: 'Lê Thảo My',
        email: 'my@tdk.vn',
        role: 'Nhân viên',
        status: 'Hoạt động',
        createdAt: new Date('2024-05-10'),
      },
    ];
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter((u) => {
      const matchesTerm = [u.name, u.email].some((v) => v.toLowerCase().includes(term));
      const matchesRole = this.selectedRole === 'all' || u.role === (this.selectedRole as any);
      const matchesStatus =
        this.selectedStatus === 'all' || u.status === (this.selectedStatus as any);
      return matchesTerm && matchesRole && matchesStatus;
    });
  }

  onSearchChange() {
    this.filterUsers();
  }
  onRoleChange() {
    this.filterUsers();
  }
  onStatusChange() {
    this.filterUsers();
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedUser = null;
    this.newUser = {
      id: 0,
      name: '',
      email: '',
      role: 'Nhân viên',
      status: 'Hoạt động',
      createdAt: new Date(),
    };
    this.showModal = true;
  }

  openEditModal(user: UserAccount) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selectedUser = user;
    this.newUser = { ...user };
    this.showModal = true;
  }

  viewUser(user: UserAccount) {
    this.isEditMode = false;
    this.isViewMode = true;
    this.selectedUser = user;
    this.newUser = { ...user };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedUser = null;
  }

  saveUser() {
    if (!this.newUser.name || !this.newUser.email) return;
    if (this.isEditMode && this.selectedUser) {
      const idx = this.users.findIndex((u) => u.id === this.selectedUser!.id);
      if (idx !== -1) this.users[idx] = { ...this.newUser };
    } else {
      const newId = Math.max(...this.users.map((u) => u.id)) + 1;
      this.users.unshift({ ...this.newUser, id: newId, createdAt: new Date() });
    }
    this.filterUsers();
    this.closeModal();
  }

  deleteUser(user: UserAccount) {
    this.users = this.users.filter((u) => u.id !== user.id);
    this.filterUsers();
  }

  getStatusClass(status: string): string {
    return status === 'Hoạt động' ? 'badge-active' : 'badge-locked';
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin':
        return 'role-admin';
      case 'Quản lý kho':
        return 'role-warehouse';
      case 'Kế toán':
        return 'role-accounting';
      default:
        return 'role-staff';
    }
  }
}

