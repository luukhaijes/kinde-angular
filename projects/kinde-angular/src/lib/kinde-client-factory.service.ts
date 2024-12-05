import { createKindeBrowserClient } from "@kinde-oss/kinde-typescript-sdk";
import { KindeConfigInterface } from "./interfaces/kinde-config.interface";
import { InjectionToken, VERSION } from "@angular/core";
import { sessionManager } from "./session-manager";
import {isPlatformBrowser} from "@angular/common";


export class KindeClientFactory {
  static createClient(config: KindeConfigInterface, platform: Object) {
    if(isPlatformBrowser(platform)) {
      return createKindeBrowserClient({
        framework: 'Angular',
        frameworkVersion: VERSION.full,
        ...config,
        sessionManager: sessionManager
      });
    }
    return null;
  }
}

export const KINDE_FACTORY_TOKEN = new InjectionToken<KindeClientFactory>('KINDE_FACTORY_TOKEN');
