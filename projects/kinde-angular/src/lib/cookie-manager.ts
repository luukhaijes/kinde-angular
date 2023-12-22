import * as Cookies from 'es-cookie';

export class CookieManager {
  static getCookie(name: string) {
    return Cookies.get(name);
  }

  static setCookie(name: string, value: string) {
    Cookies.set(name, value, { path: '' });
  }

  static deleteCookie(name: string, options: Cookies.CookieAttributes) {
    Cookies.remove(name, options);
  }
}
