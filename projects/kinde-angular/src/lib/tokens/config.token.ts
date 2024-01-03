import { InjectionToken } from "@angular/core";
import { KindeConfigInterface } from "../interfaces/kinde-config.interface";

export const kindeConfigToken = new InjectionToken<KindeConfigInterface>('[kinde angular] configToken');
