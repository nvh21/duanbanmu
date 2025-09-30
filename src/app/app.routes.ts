import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InvoiceManagementComponent } from './components/invoice-management/invoice-management.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { ImportManagementComponent } from './components/import-management/import-management.component';
import { PromotionManagementComponent } from './components/promotion-management/promotion-management.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { HelmetsComponent } from './components/helmets/helmets.component';
import { InventoryComponent } from './components/inventory/inventory.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'invoices', component: InvoiceManagementComponent },
  { path: 'invoices/orders', component: OrdersComponent },
  { path: 'invoices/order-details', component: OrderDetailsComponent },
  { path: 'invoices/payments', component: PaymentsComponent },
  { path: 'invoices/delivery', component: DeliveryComponent },
  { path: 'promotions', component: PromotionManagementComponent },
  { path: 'products', component: ProductManagementComponent },
  { path: 'products/helmets', component: HelmetsComponent },
  { path: 'products/inventory', component: InventoryComponent },
  { path: 'customers', component: CustomerManagementComponent },
  { path: 'import', component: ImportManagementComponent },
  { path: 'management', component: PromotionManagementComponent },
  { path: '**', redirectTo: '/dashboard' },
];
