import * as Cookies from 'es-cookie';

export class CookieManager {
  static getCookie(name: string): string | undefined {
    return Cookies.get(name);
  }

  static setCookie(name: string, value: string): void {
    Cookies.set(name, value, { path: '' });
  }

  static deleteCookie(name: string, options: Cookies.CookieAttributes): void {
    Cookies.remove(name, options);
  }
}
