import { Inject, Injectable } from '@angular/core';
import { defer, from, iif, map, Observable, of, switchMap, tap } from "rxjs";
import { KINDE_FACTORY_TOKEN } from "./kinde-client-factory.service";
import { KindeClient } from "./interfaces/kinde-client.interface";
import { AuthStateService } from "./auth-state.service";
import { FlagType, GetFlagType, UserType } from "@kinde-oss/kinde-typescript-sdk";
import { LOCATION_TOKEN } from "./tokens/location.token";

@Injectable({
  providedIn: 'root'
})
export class KindeAngularService {
  user$: Observable<UserType | null> = this.authState.user$;
  isAuthenticated$: Observable<boolean> = this.authState.isAuthenticated$;
  isLoading$: Observable<boolean> = this.authState.isLoading$;
  accessToken$: Observable<string | null> = this.authState.accessToken$;

  constructor(
    @Inject(KINDE_FACTORY_TOKEN) private kindeClient: KindeClient,
    @Inject(LOCATION_TOKEN) private location: Location,
    private authState: AuthStateService
  ) {
    this.shouldHandleCallback()
      .pipe(
        switchMap(shouldHandleCallback =>
          iif(
            () => shouldHandleCallback,
            defer(() => this.handleCallback()),
            of(false)
          ),
        ),
        tap(() => authState.setIsLoading(false)),
      ).subscribe();
  }

  getAccessToken(): Promise<string> {
    return this.kindeClient.getToken();
  }

  getFeatureFlag(code: string, defaultValue?: string | number | boolean | undefined, flagType?: keyof FlagType): Promise<GetFlagType> {
    return this.kindeClient.getFlag(code, defaultValue, flagType);
  }

  async getFeatureFlagEnabled(code: string, defaultValue?: boolean | undefined): Promise<boolean> {
    const BOOLEAN_FLAG_TYPE = 'b';
    return (await this.getFeatureFlag(code, defaultValue, BOOLEAN_FLAG_TYPE)).value as boolean;
  }

  async login(): Promise<void> {
    const loginUrl = await this.kindeClient.login();
    this.location.href = loginUrl.href;
  }

  async logout(): Promise<void> {
    const logoutUrl = await this.kindeClient.logout();
    this.location.href = logoutUrl.href;
  }

  private shouldHandleCallback(): Observable<boolean> {
    return of(this.location.search)
      .pipe(
        map(search => new URLSearchParams(search)),
        map(params => params.has('code') || params.has('state'))
      );
  }

  async handleCallback(): Promise<void> {
    try {
      await this.kindeClient.handleRedirectToApp(new URL(window.location.toString()));
      const token = await this.kindeClient.getToken();
      this.authState.setAccessToken(token);
    } catch (e) {
      console.log(e);
    }
  }
}
