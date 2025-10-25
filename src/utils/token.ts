// utils/token.ts
class TokenService {
  private static readonly TOKEN_KEY = 'token';

  static getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static hasToken(): boolean {
    return this.getToken() !== null;
  }

  static getAuthHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }

  static isValidToken(token: string): boolean {
    return token.length > 10 && token.split('.').length === 3;
  }
}

export default TokenService;
