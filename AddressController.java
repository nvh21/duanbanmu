package com.example.backend.controller;

import com.example.backend.dto.AddressRequestDTO;
import com.example.backend.dto.AddressResponseDTO;
import com.example.backend.entity.Address;
import com.example.backend.entity.KhachHang;
import com.example.backend.repository.AddressRepository;
import com.example.backend.repository.KhachHangRepository;
import com.example.backend.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/khach-hang")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Địa chỉ Khách Hàng", description = "API quản lý địa chỉ khách hàng")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200", "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"})
public class AddressController {
    
    private final AddressService addressService;
    private final AddressRepository addressRepository;
    private final KhachHangRepository khachHangRepository;
    
    /**
     * Lấy danh sách địa chỉ của khách hàng
     */
    @GetMapping("/{customerId}/dia-chi")
    @Operation(summary = "Lấy danh sách địa chỉ", description = "Lấy danh sách địa chỉ của khách hàng")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy khách hàng")
    })
    public ResponseEntity<List<AddressResponseDTO>> getCustomerAddresses(
            @Parameter(description = "ID của khách hàng") @PathVariable Long customerId) {
        log.info("Getting addresses for customer ID: {}", customerId);
        
        try {
            List<AddressResponseDTO> addresses = addressService.getAddressesByCustomerId(customerId);
            return ResponseEntity.ok(addresses);
        } catch (Exception e) {
            log.error("Error getting addresses for customer {}: {}", customerId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Thêm địa chỉ mới cho khách hàng
     */
    @PostMapping("/{customerId}/dia-chi")
    @Operation(summary = "Thêm địa chỉ mới", description = "Thêm địa chỉ mới cho khách hàng")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Thêm địa chỉ thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy khách hàng")
    })
    public ResponseEntity<?> addCustomerAddress(
            @Parameter(description = "ID của khách hàng") @PathVariable Long customerId,
            @Valid @RequestBody AddressRequestDTO addressRequest) {
        log.info("Adding address for customer ID: {}", customerId);
        log.info("Address data: {}", addressRequest);
        
        try {
            // Kiểm tra khách hàng có tồn tại không
            Optional<KhachHang> customer = khachHangRepository.findById(customerId);
            if (!customer.isPresent()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Không tìm thấy khách hàng với ID: " + customerId);
                errorResponse.put("timestamp", LocalDateTime.now());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            AddressResponseDTO responseDTO = addressService.addAddress(customerId, addressRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thêm địa chỉ thành công");
            response.put("data", responseDTO);
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Error adding address for customer {}: {}", customerId, e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi thêm địa chỉ: " + e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Cập nhật địa chỉ
     */
    @PutMapping("/{customerId}/dia-chi/{addressId}")
    @Operation(summary = "Cập nhật địa chỉ", description = "Cập nhật thông tin địa chỉ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy địa chỉ")
    })
    public ResponseEntity<?> updateCustomerAddress(
            @Parameter(description = "ID của khách hàng") @PathVariable Long customerId,
            @Parameter(description = "ID của địa chỉ") @PathVariable Long addressId,
            @Valid @RequestBody AddressRequestDTO addressRequest) {
        log.info("Updating address {} for customer {}", addressId, customerId);
        
        try {
            AddressResponseDTO responseDTO = addressService.updateAddress(customerId, addressId, addressRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật địa chỉ thành công");
            response.put("data", responseDTO);
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error updating address {} for customer {}: {}", addressId, customerId, e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi cập nhật địa chỉ: " + e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Xóa địa chỉ
     */
    @DeleteMapping("/{customerId}/dia-chi/{addressId}")
    @Operation(summary = "Xóa địa chỉ", description = "Xóa địa chỉ khỏi khách hàng")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Xóa thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy địa chỉ")
    })
    public ResponseEntity<?> deleteCustomerAddress(
            @Parameter(description = "ID của khách hàng") @PathVariable Long customerId,
            @Parameter(description = "ID của địa chỉ") @PathVariable Long addressId) {
        log.info("Deleting address {} for customer {}", addressId, customerId);
        
        try {
            boolean deleted = addressService.deleteAddress(customerId, addressId);
            
            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Xóa địa chỉ thành công");
                response.put("timestamp", LocalDateTime.now());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Không tìm thấy địa chỉ với ID: " + addressId);
                errorResponse.put("timestamp", LocalDateTime.now());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
        } catch (Exception e) {
            log.error("Error deleting address {} for customer {}: {}", addressId, customerId, e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi xóa địa chỉ: " + e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Đặt địa chỉ làm mặc định
     */
    @PatchMapping("/{customerId}/dia-chi/{addressId}/mac-dinh")
    @Operation(summary = "Đặt địa chỉ mặc định", description = "Đặt địa chỉ làm mặc định cho khách hàng")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đặt mặc định thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy địa chỉ")
    })
    public ResponseEntity<?> setDefaultAddress(
            @Parameter(description = "ID của khách hàng") @PathVariable Long customerId,
            @Parameter(description = "ID của địa chỉ") @PathVariable Long addressId) {
        log.info("Setting address {} as default for customer {}", addressId, customerId);
        
        try {
            AddressResponseDTO responseDTO = addressService.setDefaultAddress(customerId, addressId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đặt địa chỉ mặc định thành công");
            response.put("data", responseDTO);
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error setting default address {} for customer {}: {}", addressId, customerId, e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi đặt địa chỉ mặc định: " + e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Test endpoint
     */
    @GetMapping("/{customerId}/dia-chi/test")
    @Operation(summary = "Test địa chỉ", description = "Test endpoint cho địa chỉ")
    public ResponseEntity<Map<String, Object>> testAddressEndpoint(
            @Parameter(description = "ID của khách hàng") @PathVariable Long customerId) {
        log.info("Testing address endpoint for customer {}", customerId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Address endpoint hoạt động bình thường");
        response.put("customerId", customerId);
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
}
