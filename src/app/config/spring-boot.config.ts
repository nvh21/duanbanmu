// Cấu hình cho Spring Boot Backend Integration

export const SPRING_BOOT_CONFIG = {
  // Base URL cho Spring Boot API
  API_BASE_URL: 'http://localhost:8081/api',
  
  // Các endpoints chính
  ENDPOINTS: {
    CUSTOMERS: '/khach-hang',
    CUSTOMER_BY_ID: '/khach-hang/{id}',
    CUSTOMER_ADDRESSES: '/khach-hang/{customerId}/dia-chi',
    CUSTOMER_ADDRESS_BY_ID: '/khach-hang/{customerId}/dia-chi/{addressId}',
    SEARCH_CUSTOMERS: '/khach-hang/search',
    CUSTOMER_STATUS: '/khach-hang/{id}/trang-thai'
  },
  
  // Headers mặc định
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000 // 1 second
};

// Response wrapper interface cho Spring Boot
export interface SpringBootResponse<T> {
  data?: T;
  message?: string;
  status?: string;
  timestamp?: string;
}

// Error response interface
export interface SpringBootError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
  path: string;
}


