import { SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import { CookieManager } from "./cookie-manager";

/**
 * Typing seems a bit off here, created an issue: https://github.com/kinde-oss/kinde-typescript-sdk/issues/39
 */
interface BSessionManager extends SessionManager {
  getSessionItemBrowser(key: string): Promise<string | null>;
  setSessionItemBrowser(key: string, value: unknown): Promise<void>;
  removeSessionItemBrowser(key: string): Promise<void>;
}

const keysInCookie = ['refresh_token', 'access_token', 'acwpf-state-key']
const memCache: Record<string, string> = {};
const sessionManager: BSessionManager = {
  async getSessionItemBrowser(key: string) {
    return CookieManager.getCookie(key) || memCache[key];
  },
  async getSessionItem(key: string) {
    return this.getSessionItemBrowser(key);
  },
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
    for (const key of keysInCookie) {
      CookieManager.deleteCookie(key, { path: '' });
    }
  }
}

export { sessionManager };
