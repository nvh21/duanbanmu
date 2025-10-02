# Hướng dẫn sử dụng hệ thống đăng nhập

## Tài khoản demo

Hệ thống đã được cấu hình với các tài khoản demo sau:

| Tên đăng nhập | Mật khẩu   | Vai trò       |
| ------------- | ---------- | ------------- |
| admin         | admin123   | Quản trị viên |
| user          | user123    | Người dùng    |
| manager       | manager123 | Quản lý       |

## Tính năng đã được triển khai

### 1. Trang đăng nhập (`/login`)

- Giao diện đăng nhập đẹp mắt với gradient background
- Form validation cơ bản
- Tùy chọn "Ghi nhớ đăng nhập"
- Hiển thị loading state khi đang xử lý
- Thông báo lỗi khi đăng nhập thất bại

### 2. Service Authentication (`AuthService`)

- Quản lý trạng thái đăng nhập
- Lưu trữ thông tin user trong localStorage/sessionStorage
- Hỗ trợ "Ghi nhớ đăng nhập"
- Tự động kiểm tra trạng thái đăng nhập khi khởi động app

### 3. Header với thông tin user

- Hiển thị tên người dùng đang đăng nhập
- Nút đăng xuất với icon
- Ẩn/hiện dựa trên trạng thái đăng nhập

### 4. Auth Guard

- Bảo vệ tất cả các route (trừ `/login`)
- Tự động chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
- Kiểm tra token và thông tin user

### 5. Layout động

- Trang đăng nhập: Full screen layout
- Các trang khác: Layout với sidebar và header

## Cách sử dụng

1. **Truy cập ứng dụng**: Mở trình duyệt và truy cập `http://localhost:4200`
2. **Đăng nhập**: Sử dụng một trong các tài khoản demo ở trên
3. **Sử dụng ứng dụng**: Sau khi đăng nhập thành công, bạn có thể sử dụng tất cả tính năng
4. **Đăng xuất**: Click nút "Đăng xuất" ở góc phải header

## Cấu trúc file

```
src/app/
├── components/
│   └── login/
│       ├── login.html          # Template trang đăng nhập
│       ├── login.scss          # Styles cho trang đăng nhập
│       └── login.ts            # Component logic
├── services/
│   └── auth.ts                 # Service xử lý authentication
├── guards/
│   └── auth-guard.ts           # Guard bảo vệ routes
└── components/header/
    ├── header.component.html   # Template header (đã cập nhật)
    ├── header.component.scss   # Styles header (đã cập nhật)
    └── header.component.ts     # Logic header (đã cập nhật)
```

## Tùy chỉnh

### Thay đổi tài khoản demo

Chỉnh sửa method `validateCredentials()` trong `src/app/services/auth.ts`:

```typescript
private validateCredentials(username: string, password: string): boolean {
  const validCredentials = [
    { username: 'your_username', password: 'your_password' },
    // Thêm tài khoản khác...
  ];

  return validCredentials.some(cred =>
    cred.username === username && cred.password === password
  );
}
```

### Kết nối API thực

Thay thế logic trong `AuthService.login()` để gọi API thực:

```typescript
login(username: string, password: string, rememberMe: boolean = false): Observable<boolean> {
  return this.http.post<LoginResponse>('/api/auth/login', {
    username,
    password,
    rememberMe
  }).pipe(
    tap(response => {
      // Xử lý response từ server
      if (response.success) {
        // Lưu token và user info
      }
    })
  );
}
```

## Lưu ý bảo mật

- Đây là phiên bản demo, không sử dụng trong môi trường production
- Trong thực tế cần:
  - Mã hóa mật khẩu
  - Sử dụng JWT token
  - Implement refresh token
  - Xử lý lỗi bảo mật
  - Rate limiting cho đăng nhập

