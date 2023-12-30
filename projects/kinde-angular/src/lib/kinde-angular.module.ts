import { ModuleWithProviders, NgModule } from '@angular/core';
import { KindeAngularService } from "./kinde-angular.service";
import { KINDE_FACTORY_TOKEN, KindeClientFactory } from "./kinde-client-factory.service";
import { KindeConfigInterface } from "./interfaces/kinde-config.interface";
import { kindeConfigToken } from "./tokens/config.token";
import { LOCATION_TOKEN } from "./tokens/location.token";

@NgModule()
export class KindeAngularModule {
  static forRoot(config: KindeConfigInterface): ModuleWithProviders<KindeAngularModule> {
    return {
      ngModule: KindeAngularModule,
      providers: [
        KindeAngularService,
        { provide: LOCATION_TOKEN, useValue: window.location },
        {
          provide: kindeConfigToken,
          useValue: config
        },
        {
          provide: KINDE_FACTORY_TOKEN,
          useFactory: KindeClientFactory.createClient,
          deps: [kindeConfigToken]
        }
      ]
    }
  }
}
