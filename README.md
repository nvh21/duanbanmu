# Helmet Store - Hệ thống quản lý cửa hàng mũ bảo hiểm

## Mô tả dự án

Đây là hệ thống quản lý cửa hàng mũ bảo hiểm được xây dựng bằng Angular 20. Hệ thống bao gồm các chức năng chính:

- **Dashboard**: Tổng quan hệ thống với các thống kê cơ bản
- **Quản lý hóa đơn**: Quản lý và theo dõi các hóa đơn bán hàng
- **Quản lý sản phẩm**: Quản lý danh mục sản phẩm mũ bảo hiểm
- **Khách hàng**: Quản lý thông tin khách hàng
- **Nhập hàng**: Quản lý nhập hàng và tồn kho
- **Quản lý**: Quản lý chương trình khuyến mãi (đã hoàn thiện)

## Công nghệ sử dụng

- Angular 20
- TypeScript
- Bootstrap 5
- Bootstrap Icons
- SCSS

## Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn

### Các bước cài đặt

1. **Cài đặt dependencies:**

```bash
cd banmubaohiem
npm install
```

2. **Chạy dự án:**

```bash
npm start
```

3. **Mở trình duyệt:**
   Truy cập `http://localhost:4200` để xem ứng dụng

### Các lệnh khác

- **Build dự án:**

```bash
npm run build
```

- **Chạy tests:**

```bash
npm test
```

## Cấu trúc dự án

```
src/
├── app/
│   ├── components/
│   │   ├── sidebar/                    # Component sidebar navigation
│   │   ├── header/                     # Component header
│   │   ├── dashboard/                  # Trang dashboard nâng cao
│   │   ├── invoice-management/         # Quản lý hóa đơn
│   │   ├── product-management/         # Quản lý sản phẩm
│   │   ├── customer-management/        # Quản lý khách hàng
│   │   ├── import-management/          # Quản lý nhập hàng
│   │   ├── promotion-management/       # Quản lý khuyến mãi (hoàn thiện)
│   │   ├── promotion-modal/            # Modal thêm/sửa khuyến mãi
│   │   └── loading-spinner/            # Component loading spinner
│   ├── services/
│   │   └── data.service.ts             # Service quản lý dữ liệu
│   ├── app.component.*                 # Component chính
│   ├── app.routes.ts                   # Cấu hình routing
│   └── app.config.ts                   # Cấu hình ứng dụng
├── styles.scss                         # Global styles với Bootstrap
└── index.html                          # File HTML chính
```

## Tính năng đã hoàn thiện

### 1. Layout chính

- Sidebar navigation với menu đa cấp như trong ảnh
- Menu "Quản lý hóa đơn" có submenu: Đơn hàng, Chi tiết đơn hàng, Thanh toán, Giao hàng
- Header với breadcrumb và thông tin user
- Responsive design cho mobile và desktop
- Animation và transition mượt mà

### 2. Dashboard nâng cao

- 4 card thống kê với animation hover
- Hoạt động gần đây với timeline
- Sản phẩm bán chạy với ranking
- Thao tác nhanh với quick actions
- Responsive grid layout

### 3. Quản lý chương trình khuyến mãi (Hoàn thiện 100%)

- Giao diện quản lý hoàn chỉnh theo thiết kế
- Bảng dữ liệu với 5 chương trình khuyến mãi mẫu
- Modal thêm/sửa khuyến mãi với form validation
- Các nút chức năng: Xuất Excel, Nhập Excel, Thêm khuyến mãi
- Tìm kiếm và lọc theo trạng thái
- Các thao tác: Xem, Sửa, Xóa với confirmation
- Status badges với màu sắc phân biệt

### 4. Components bổ sung

- **PromotionModalComponent**: Modal thêm/sửa khuyến mãi
- **LoadingSpinnerComponent**: Spinner loading đa kích thước
- **DataService**: Service quản lý dữ liệu với RxJS

### 5. Trang Chi tiết đơn hàng (Hoàn thiện 100%)

- Giao diện giống hệt ảnh bạn cung cấp
- Bảng dữ liệu với 10 bản ghi mẫu
- Các cột: id, ma_don_hang, ma_san_pham, so_luong, gia_ban, thanh_tien, ghi_chu
- Tìm kiếm, lọc, xuất, nhập, thêm mới
- Thao tác: Xem, Sửa, Xóa cho từng dòng

### 6. Menu đa cấp cho Quản lý sản phẩm (Hoàn thiện 100%)

- **HelmetsComponent**: Sản phẩm mũ bảo hiểm ✅
- **InventoryComponent**: Tồn kho ✅
- **WarehouseComponent**: Quản lý kho ✅
- **ReviewsComponent**: Đánh giá sản phẩm ✅

### 7. Các trang khác

- Layout cơ bản cho các chức năng còn lại
- Sẵn sàng để phát triển thêm

## Hướng dẫn phát triển

### Thêm component mới

1. Tạo thư mục component trong `src/app/components/`
2. Tạo các file: `.ts`, `.html`, `.scss`
3. Thêm route vào `app.routes.ts`
4. Cập nhật menu trong `sidebar.component.ts`

### Styling

- Sử dụng Bootstrap 5 cho layout và components
- SCSS cho custom styling
- Bootstrap Icons cho icons
- Responsive design với mobile-first approach

## Liên hệ

Dự án được phát triển cho mục đích học tập và nghiên cứu.
# duanbanmu
