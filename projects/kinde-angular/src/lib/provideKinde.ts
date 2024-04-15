import { KindeConfigInterface } from "./interfaces/kinde-config.interface";
import { KindeAngularService } from "./kinde-angular.service";
import { LOCATION_TOKEN } from "./tokens/location.token";
import { kindeConfigToken } from "./tokens/config.token";
import { KINDE_FACTORY_TOKEN, KindeClientFactory } from "./kinde-client-factory.service";
import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";

export function provideKinde(config?: KindeConfigInterface): EnvironmentProviders {
  return makeEnvironmentProviders([
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
  ])
}
