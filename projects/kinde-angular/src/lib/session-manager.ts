import { SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import { CookieManager } from "./cookie-manager";

interface BSessionManager extends SessionManager {
  getSessionItemBrowser(key: string): Promise<string | null>;
  setSessionItemBrowser(key: string, value: unknown): Promise<void>;
  removeSessionItemBrowser(key: string): Promise<void>;
}

const key =  'auth-state';
const keysInCookie = ['refresh_token', 'access_token', 'acwpf-state-key']
const memCache: Record<string, string> = {};
const sessionManager: BSessionManager = {
  // @ts-ignore
  async getSessionItemBrowser(key: string) {
    return CookieManager.getCookie(key) || memCache[key];
  },
  // @ts-ignore
  async getSessionItem(key: string) {
    return this.getSessionItemBrowser(key);
  },
  // @ts-ignore
  async setSessionItemBrowser(key: string, value: unknown) {
    const inCookieList = keysInCookie.find(k => key.includes(k))

    if (inCookieList) {
      CookieManager.setCookie(key, value as string);
    } else {
      memCache[key] = value as string;
    }
  },
  async setSessionItem(key: string, value: unknown) {
    await this.setSessionItemBrowser(key, value);
  },
  // @ts-ignore
  async removeSessionItemBrowser(key: string) {
    for (const key in memCache) {
      delete memCache[key]
    }
    CookieManager.deleteCookie(key, { path: '' });
  },
  async removeSessionItem(key: string) {
    await this.removeSessionItemBrowser(key);
  },
  async destroySession() {
    for (const key in memCache) {
      delete memCache[key]
    }
    CookieManager.deleteCookie(key, { path: '' });
  }
}

export { sessionManager };
