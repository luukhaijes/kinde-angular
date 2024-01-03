import { InjectionToken } from "@angular/core";

type windowLocation = Location;

export const LOCATION_TOKEN = new InjectionToken<windowLocation>('[kinde angular] window location');
