import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InvoiceManagementComponent } from './components/invoice-management/invoice-management.component';
import { CounterSalesComponent } from './components/counter-sales/counter-sales.component';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { ImportManagementComponent } from './components/import-management/import-management.component';
import { PromotionManagementComponent } from './components/promotion-management/promotion-management.component';
import { VoucherForm } from './components/voucher-form/voucher-form';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { StaffManagementComponent } from './components/staff-management/staff-management.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { HelmetsComponent } from './components/helmets/helmets.component';
import { ManufacturersComponent } from './components/manufacturers/manufacturers.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { LoginComponent } from './components/login/login';
import { ApiTestComponent } from './components/api-test/api-test.component';
import { PhieuGiamGiaTestComponent } from './components/phieu-giam-gia-test/phieu-giam-gia-test.component';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices',
    component: InvoiceManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'counter-sales',
    component: CounterSalesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/order-details',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/payments',
    component: PaymentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/delivery',
    component: DeliveryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'promotions',
    component: PromotionManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vouchers',
    component: VoucherForm,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/helmets',
    component: HelmetsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/manufacturers',
    component: ManufacturersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/details',
    component: ProductDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customers',
    component: CustomerManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'test-customers',
    component: CustomerManagementComponent,
    // canActivate: [AuthGuard], // Tạm thời bỏ AuthGuard để test
  },
  {
    path: 'import',
    component: ImportManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'management',
    component: AccountManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'staff',
    component: StaffManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'api-test',
    component: ApiTestComponent,
    // canActivate: [AuthGuard], // Tạm thời bỏ AuthGuard để test
  },
  {
    path: 'phieu-giam-gia-test',
    component: PhieuGiamGiaTestComponent,
    // canActivate: [AuthGuard], // Tạm thời bỏ AuthGuard để test
  },
  { path: '**', redirectTo: '/dashboard' },
];
