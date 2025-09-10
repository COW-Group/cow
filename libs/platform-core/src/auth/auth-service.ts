import { jwtDecode } from 'jwt-decode';
import CryptoJS from 'crypto-js';

// Browser environment check
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'cow_access_token';
  private readonly REFRESH_TOKEN_KEY = 'cow_refresh_token';
  private readonly USER_KEY = 'cow_user';
  private readonly ENCRYPTION_KEY = 'COW_AUTH_ENCRYPTION_2024';

  constructor(private apiUrl: string = '/api/auth') {}

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json() as { message?: string };
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json() as { user: User; tokens: AuthTokens };
    const { user, tokens } = data;

    this.storeTokens(tokens);
    this.storeUser(user);

    return { user, tokens };
  }

  async register(registerData: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${this.apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const error = await response.json() as { message?: string };
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json() as { user: User; tokens: AuthTokens };
    const { user, tokens } = data;

    this.storeTokens(tokens);
    this.storeUser(user);

    return { user, tokens };
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      try {
        await fetch(`${this.apiUrl}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAccessToken()}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.warn('Logout request failed:', error);
      }
    }

    this.clearStorage();
  }

  async refreshTokens(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.apiUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      this.clearStorage();
      throw new Error('Token refresh failed');
    }

    const tokens = await response.json() as AuthTokens;
    this.storeTokens(tokens);

    return tokens;
  }

  async validateToken(token?: string): Promise<boolean> {
    const tokenToValidate = token || this.getAccessToken();
    
    if (!tokenToValidate) {
      return false;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(tokenToValidate);
      const currentTime = Math.floor(Date.now() / 1000);
      
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const storedUser = this.getStoredUser();
    
    if (storedUser && await this.isAuthenticated()) {
      return storedUser;
    }

    if (!await this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await fetch(`${this.apiUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const user = await response.json() as User;
      this.storeUser(user);
      
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    
    if (!accessToken) {
      return false;
    }

    if (await this.validateToken(accessToken)) {
      return true;
    }

    try {
      await this.refreshTokens();
      return true;
    } catch (error) {
      return false;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAccessToken()}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json() as { message?: string };
      throw new Error(error.message || 'Password change failed');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json() as { message?: string };
      throw new Error(error.message || 'Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password: newPassword }),
    });

    if (!response.ok) {
      const error = await response.json() as { message?: string };
      throw new Error(error.message || 'Password reset failed');
    }
  }

  hasPermission(permission: string): boolean {
    const user = this.getStoredUser();
    return user?.permissions.includes(permission) || false;
  }

  hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getStoredUser();
    return user ? roles.includes(user.role) : false;
  }

  getAccessToken(): string | null {
    if (!isBrowser) return null;
    
    try {
      const encrypted = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (!encrypted) return null;
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, this.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch (error) {
      console.error('Error decrypting access token:', error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    if (!isBrowser) return null;
    
    try {
      const encrypted = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (!encrypted) return null;
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, this.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch (error) {
      console.error('Error decrypting refresh token:', error);
      return null;
    }
  }

  private storeTokens(tokens: AuthTokens): void {
    if (!isBrowser) return;
    
    try {
      const encryptedAccess = CryptoJS.AES.encrypt(tokens.accessToken, this.ENCRYPTION_KEY).toString();
      const encryptedRefresh = CryptoJS.AES.encrypt(tokens.refreshToken, this.ENCRYPTION_KEY).toString();
      
      localStorage.setItem(this.ACCESS_TOKEN_KEY, encryptedAccess);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, encryptedRefresh);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  private storeUser(user: User): void {
    if (!isBrowser) return;
    
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(user), this.ENCRYPTION_KEY).toString();
      localStorage.setItem(this.USER_KEY, encrypted);
    } catch (error) {
      console.error('Error storing user:', error);
      throw new Error('Failed to store user data');
    }
  }

  private getStoredUser(): User | null {
    if (!isBrowser) return null;
    
    try {
      const encrypted = localStorage.getItem(this.USER_KEY);
      if (!encrypted) return null;
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, this.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      return decrypted ? JSON.parse(decrypted) as User : null;
    } catch (error) {
      console.error('Error decrypting user data:', error);
      return null;
    }
  }

  private clearStorage(): void {
    if (!isBrowser) return;
    
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}

export const authService = new AuthService();