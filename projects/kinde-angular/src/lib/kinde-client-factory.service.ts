import { createKindeBrowserClient } from "@kinde-oss/kinde-typescript-sdk";
import { KindeConfigInterface } from "./interfaces/kinde-config.interface";
import { InjectionToken, VERSION } from "@angular/core";
import { sessionManager } from "./session-manager";


export class KindeClientFactory {
  static createClient(config: KindeConfigInterface) {
    return createKindeBrowserClient({
      framework: 'Angular',
      frameworkVersion: VERSION.full,
      ...config,
      sessionManager: sessionManager
    });
  }
}

export const KINDE_FACTORY_TOKEN = new InjectionToken<KindeClientFactory>('KINDE_FACTORY_TOKEN');
