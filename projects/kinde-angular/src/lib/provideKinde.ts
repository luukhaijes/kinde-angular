import { KindeConfigInterface } from "./interfaces/kinde-config.interface";
import { KindeAngularService } from "./kinde-angular.service";
import { kindeConfigToken } from "./tokens/config.token";
import { KINDE_FACTORY_TOKEN, KindeClientFactory } from "./kinde-client-factory.service";
import {EnvironmentProviders, makeEnvironmentProviders, PLATFORM_ID} from "@angular/core";

export function provideKinde(config?: KindeConfigInterface): EnvironmentProviders {
  return makeEnvironmentProviders([
    KindeAngularService,
    {
      provide: kindeConfigToken,
      useValue: config
    },
    {
      provide: KINDE_FACTORY_TOKEN,
      useFactory: KindeClientFactory.createClient,
      deps: [kindeConfigToken, PLATFORM_ID]
    }
  ])
}
