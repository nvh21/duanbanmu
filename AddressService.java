package com.example.backend.service;

import com.example.backend.dto.AddressRequestDTO;
import com.example.backend.dto.AddressResponseDTO;
import com.example.backend.entity.Address;
import com.example.backend.entity.KhachHang;
import com.example.backend.repository.AddressRepository;
import com.example.backend.repository.KhachHangRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressService {
    
    private final AddressRepository addressRepository;
    private final KhachHangRepository khachHangRepository;
    
    /**
     * Lấy danh sách địa chỉ của khách hàng
     */
    public List<AddressResponseDTO> getAddressesByCustomerId(Long customerId) {
        log.info("Getting addresses for customer ID: {}", customerId);
        
        List<Address> addresses = addressRepository.findByCustomerIdOrderByMacDinhDescCreatedAtAsc(customerId);
        
        return addresses.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Thêm địa chỉ mới
     */
    @Transactional
    public AddressResponseDTO addAddress(Long customerId, AddressRequestDTO requestDTO) {
        log.info("Adding address for customer ID: {}", customerId);
        
        // Kiểm tra khách hàng có tồn tại không
        Optional<KhachHang> customer = khachHangRepository.findById(customerId);
        if (!customer.isPresent()) {
            throw new RuntimeException("Không tìm thấy khách hàng với ID: " + customerId);
        }
        
        // Nếu đặt làm mặc định, bỏ mặc định tất cả địa chỉ khác
        if (requestDTO.getMacDinh() != null && requestDTO.getMacDinh()) {
            addressRepository.unsetAllDefaultAddresses(customerId);
        }
        
        // Tạo địa chỉ mới
        Address address = new Address();
        address.setDiaChiCuThe(requestDTO.getDiaChiCuThe());
        address.setThanhPho(requestDTO.getThanhPho());
        address.setQuan(requestDTO.getQuan());
        address.setPhuong(requestDTO.getPhuong());
        address.setMacDinh(requestDTO.getMacDinh() != null ? requestDTO.getMacDinh() : false);
        address.setTenDiaChi(requestDTO.getTenDiaChi());
        address.setCustomerId(customerId);
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());
        
        Address savedAddress = addressRepository.save(address);
        log.info("Address saved with ID: {}", savedAddress.getId());
        
        return mapToResponseDTO(savedAddress);
    }
    
    /**
     * Cập nhật địa chỉ
     */
    @Transactional
    public AddressResponseDTO updateAddress(Long customerId, Long addressId, AddressRequestDTO requestDTO) {
        log.info("Updating address {} for customer {}", addressId, customerId);
        
        Optional<Address> addressOpt = addressRepository.findById(addressId);
        if (!addressOpt.isPresent()) {
            throw new RuntimeException("Không tìm thấy địa chỉ với ID: " + addressId);
        }
        
        Address address = addressOpt.get();
        
        // Kiểm tra địa chỉ thuộc về khách hàng
        if (!address.getCustomerId().equals(customerId)) {
            throw new RuntimeException("Địa chỉ không thuộc về khách hàng này");
        }
        
        // Nếu đặt làm mặc định, bỏ mặc định tất cả địa chỉ khác
        if (requestDTO.getMacDinh() != null && requestDTO.getMacDinh()) {
            addressRepository.unsetAllDefaultAddresses(customerId);
        }
        
        // Cập nhật thông tin
        address.setDiaChiCuThe(requestDTO.getDiaChiCuThe());
        address.setThanhPho(requestDTO.getThanhPho());
        address.setQuan(requestDTO.getQuan());
        address.setPhuong(requestDTO.getPhuong());
        address.setMacDinh(requestDTO.getMacDinh() != null ? requestDTO.getMacDinh() : address.getMacDinh());
        address.setTenDiaChi(requestDTO.getTenDiaChi());
        address.setUpdatedAt(LocalDateTime.now());
        
        Address savedAddress = addressRepository.save(address);
        log.info("Address updated successfully");
        
        return mapToResponseDTO(savedAddress);
    }
    
    /**
     * Xóa địa chỉ
     */
    @Transactional
    public boolean deleteAddress(Long customerId, Long addressId) {
        log.info("Deleting address {} for customer {}", addressId, customerId);
        
        Optional<Address> addressOpt = addressRepository.findById(addressId);
        if (!addressOpt.isPresent()) {
            return false;
        }
        
        Address address = addressOpt.get();
        
        // Kiểm tra địa chỉ thuộc về khách hàng
        if (!address.getCustomerId().equals(customerId)) {
            throw new RuntimeException("Địa chỉ không thuộc về khách hàng này");
        }
        
        addressRepository.deleteById(addressId);
        log.info("Address deleted successfully");
        
        return true;
    }
    
    /**
     * Đặt địa chỉ làm mặc định
     */
    @Transactional
    public AddressResponseDTO setDefaultAddress(Long customerId, Long addressId) {
        log.info("Setting address {} as default for customer {}", addressId, customerId);
        
        Optional<Address> addressOpt = addressRepository.findById(addressId);
        if (!addressOpt.isPresent()) {
            throw new RuntimeException("Không tìm thấy địa chỉ với ID: " + addressId);
        }
        
        Address address = addressOpt.get();
        
        // Kiểm tra địa chỉ thuộc về khách hàng
        if (!address.getCustomerId().equals(customerId)) {
            throw new RuntimeException("Địa chỉ không thuộc về khách hàng này");
        }
        
        // Bỏ mặc định tất cả địa chỉ khác
        addressRepository.unsetAllDefaultAddresses(customerId);
        
        // Đặt địa chỉ này làm mặc định
        int updated = addressRepository.setDefaultAddress(addressId, customerId);
        if (updated == 0) {
            throw new RuntimeException("Không thể đặt địa chỉ làm mặc định");
        }
        
        // Lấy lại địa chỉ đã cập nhật
        Optional<Address> updatedAddressOpt = addressRepository.findById(addressId);
        if (!updatedAddressOpt.isPresent()) {
            throw new RuntimeException("Lỗi khi cập nhật địa chỉ mặc định");
        }
        
        log.info("Address set as default successfully");
        return mapToResponseDTO(updatedAddressOpt.get());
    }
    
    /**
     * Map Entity sang ResponseDTO
     */
    private AddressResponseDTO mapToResponseDTO(Address address) {
        return new AddressResponseDTO(
                address.getId(),
                address.getDiaChiCuThe(),
                address.getThanhPho(),
                address.getQuan(),
                address.getPhuong(),
                address.getMacDinh(),
                address.getTenDiaChi(),
                address.getCustomerId(),
                address.getCreatedAt(),
                address.getUpdatedAt()
        );
    }
}
