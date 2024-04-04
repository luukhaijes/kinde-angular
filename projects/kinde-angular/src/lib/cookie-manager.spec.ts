import * as Cookies from 'es-cookie';
import { CookieManager } from './cookie-manager';

jest.mock('es-cookie', () => ({
  get: jest.fn().mockImplementation((name: string) => {
    return name === 'existingCookie' ? 'cookieValue' : undefined;
  }),
  set: jest.fn(),
  remove: jest.fn(),
}));

describe('CookieManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get a cookie', () => {
    const cookieValue = CookieManager.getCookie('existingCookie');
    expect(cookieValue).toBe('cookieValue');
    expect(Cookies.get).toHaveBeenCalledWith('existingCookie');
  });

  it('should return undefined for a non-existing cookie', () => {
    const cookieValue = CookieManager.getCookie('nonExistingCookie');
    expect(cookieValue).toBeUndefined();
    expect(Cookies.get).toHaveBeenCalledWith('nonExistingCookie');
  });

  it('should set a cookie', () => {
    CookieManager.setCookie('newCookie', 'newValue');
    expect(Cookies.set).toHaveBeenCalledWith('newCookie', 'newValue', { path: '', sameSite: 'lax', secure: true });
  });

  it('should delete a cookie', () => {
    const options = { path: '/somepath' };
    CookieManager.deleteCookie('cookieToDelete', options);
    expect(Cookies.remove).toHaveBeenCalledWith('cookieToDelete', options);
  });
});
