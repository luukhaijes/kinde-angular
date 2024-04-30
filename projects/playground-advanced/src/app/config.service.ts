import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { delay, Observable, timeout } from 'rxjs';
import { map } from 'rxjs/operators';
import { KindeConfigInterface } from "../../../kinde-angular/src/lib/interfaces/kinde-config.interface";


export interface Configuration {
  kinde: KindeConfigInterface,
}

@Injectable()
export class ConfigService {
  private config!: Configuration;

  private readonly CONFIG_PATH = '../assets/config.json';

  public constructor(
    private httpClient: HttpClient,
  ) { }

  public loadConfig(): Observable<Configuration> {
    return this.httpClient
      .get(this.CONFIG_PATH)
      .pipe(
        map((config) => {
          this.setConfig(config);

          return this.config;
        }),
      );
  }

  public getConfig(): Configuration {
    return this.config;
  }

  public setConfig(config: any): void {
    this.config = config as Configuration;
  }

  public getKindeConfig(): KindeConfigInterface {
    return this.config?.kinde;
  }
}
