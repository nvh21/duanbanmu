import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    // Kiểm tra xem có phải môi trường browser không
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('currentUser');

      if (token && user) {
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  login(username: string, password: string, rememberMe: boolean = false): Observable<boolean> {
    // Simulate API call với delay
    return of(this.validateCredentials(username, password)).pipe(
      delay(1000), // Simulate network delay
      tap((success) => {
        if (success) {
          const user = {
            id: 1,
            username: username,
            name: 'Admin User',
            role: 'admin',
            email: 'admin@tdkstore.com',
          };

          const token = this.generateToken();

          if (typeof window !== 'undefined') {
            if (rememberMe) {
              localStorage.setItem('authToken', token);
              localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
              sessionStorage.setItem('authToken', token);
              sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
          }

          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout(): void {
    // Xóa tất cả thông tin đăng nhập
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('currentUser');
    }

    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }
    return null;
  }

  private validateCredentials(username: string, password: string): boolean {
    // Demo credentials - trong thực tế sẽ gọi API
    const validCredentials = [
      { username: 'admin', password: 'admin123' },
      { username: 'user', password: 'user123' },
      { username: 'manager', password: 'manager123' },
    ];

    console.log('Validating credentials:', { username, password });
    console.log('Valid credentials:', validCredentials);

    const isValid = validCredentials.some(
      (cred) => cred.username === username && cred.password === password
    );

    console.log('Validation result:', isValid);
    return isValid;
  }

  private generateToken(): string {
    // Generate a simple token - trong thực tế sẽ nhận từ server
    return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}
