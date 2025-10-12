# 🚀 Test Kết Nối Backend Nhanh

## ✅ **Backend đang chạy trên:**
- **URL:** http://localhost:8081
- **API Endpoint:** http://localhost:8081/api/khach-hang

## ✅ **Frontend đang chạy trên:**
- **URL:** http://localhost:4200

## 🔗 **Cách test kết nối:**

### **Bước 1: Mở Frontend**
1. Mở trình duyệt
2. Truy cập: http://localhost:4200
3. Cuộn xuống phần "🔗 Test Kết Nối Backend"

### **Bước 2: Test Kết Nối**
1. Click **"🚀 Test Kết Nối"**
2. Nếu thành công → ✅ "Kết nối backend thành công!"
3. Nếu thất bại → ❌ "Không thể kết nối backend"

### **Bước 3: Test API Khách Hàng**
1. Click **"👥 Test API Khách Hàng"**
2. Nếu thành công → ✅ "Lấy danh sách khách hàng thành công!"
3. Nếu thất bại → ❌ "Lỗi khi lấy danh sách khách hàng"

### **Bước 4: Test Tạo Khách Hàng**
1. Click **"➕ Test Tạo Khách Hàng"**
2. Nếu thành công → ✅ "Tạo khách hàng test thành công!"
3. Nếu thất bại → ❌ "Lỗi khi tạo khách hàng"

## 🎯 **Kết quả mong đợi:**

### **✅ Kết nối thành công:**
- Tất cả 3 test đều hiển thị ✅
- Không có lỗi trong Console (F12)
- Network tab hiển thị requests 200 OK

### **❌ Kết nối thất bại:**
- Test hiển thị ❌
- Console có lỗi CORS hoặc network
- Network tab hiển thị requests failed

## 🔧 **Nếu có lỗi:**

### **Lỗi CORS:**
```
Access to XMLHttpRequest at 'http://localhost:8081/api/khach-hang' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```
**Giải pháp:** Cấu hình CORS trong backend Spring Boot

### **Lỗi 404:**
```
GET http://localhost:8081/api/khach-hang 404 (Not Found)
```
**Giải pháp:** Kiểm tra API endpoints trong backend

### **Lỗi 500:**
```
GET http://localhost:8081/api/khach-hang 500 (Internal Server Error)
```
**Giải pháp:** Kiểm tra logs backend

---

**Lưu ý:** Nếu backend không khả dụng, frontend sẽ tự động chuyển sang chế độ offline và lưu dữ liệu vào localStorage.

