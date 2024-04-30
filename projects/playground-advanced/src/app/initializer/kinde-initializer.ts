import { InjectionToken } from "@angular/core";
import { ConfigService } from "../config.service";
import { KindeConfigInterface } from "../../../../kinde-angular/src/lib/interfaces/kinde-config.interface";


export const KINDE_CONFIG = new InjectionToken<KindeConfigInterface>('kinde.config');

export const kindeInitializer = (configService: ConfigService): KindeConfigInterface => configService.getKindeConfig();
