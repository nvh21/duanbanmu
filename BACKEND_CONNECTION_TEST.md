# 🔗 Test Kết Nối Backend

## 📋 Hướng dẫn test kết nối

### 1. **Kiểm tra Backend đang chạy:**
```bash
# Kiểm tra port 8081
netstat -an | findstr :8081
```

### 2. **Test API endpoints:**

#### **Test cơ bản:**
```bash
# Test health check
curl http://localhost:8081/api/health

# Test customers API
curl http://localhost:8081/api/customers
```

#### **Test với Postman/Insomnia:**
- **GET** `http://localhost:8081/api/customers`
- **POST** `http://localhost:8081/api/customers`
- **PUT** `http://localhost:8081/api/customers/{id}`
- **DELETE** `http://localhost:8081/api/customers/{id}`

### 3. **Test từ Frontend:**

1. **Mở** http://localhost:4200
2. **Click** "Test Kết Nối" 
3. **Click** "Test API Khách Hàng"
4. **Click** "Test Tạo Khách Hàng"

### 4. **Kiểm tra Console:**
- Mở **F12** → **Console**
- Xem có lỗi CORS không
- Xem có lỗi network không

### 5. **Kiểm tra Network Tab:**
- Mở **F12** → **Network**
- Xem các request đến `localhost:8081`
- Kiểm tra status code (200, 404, 500, etc.)

## 🚨 **Các lỗi thường gặp:**

### **CORS Error:**
```
Access to XMLHttpRequest at 'http://localhost:8081/api/customers' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```
**Giải pháp:** Cấu hình CORS trong backend

### **Connection Refused:**
```
ERR_CONNECTION_REFUSED
```
**Giải pháp:** Kiểm tra backend có chạy không

### **404 Not Found:**
```
GET http://localhost:8081/api/customers 404 (Not Found)
```
**Giải pháp:** Kiểm tra API endpoints trong backend

### **500 Internal Server Error:**
```
GET http://localhost:8081/api/customers 500 (Internal Server Error)
```
**Giải pháp:** Kiểm tra logs backend

## ✅ **Khi nào kết nối thành công:**

1. **Backend test** hiển thị ✅
2. **API test** hiển thị ✅  
3. **Create test** hiển thị ✅
4. **Không có lỗi** trong Console
5. **Network requests** trả về 200 OK

---

**Lưu ý:** Nếu backend chưa có API endpoints, frontend sẽ tự động chuyển sang chế độ offline và lưu dữ liệu vào localStorage.

