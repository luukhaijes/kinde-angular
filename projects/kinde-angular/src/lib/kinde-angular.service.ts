import { Inject, Injectable, OnDestroy } from '@angular/core';
import { defer, iif, map, mergeMap, Observable, of, Subject, switchMap, takeUntil, tap, withLatestFrom } from "rxjs";
import { KINDE_FACTORY_TOKEN } from "./kinde-client-factory.service";
import { KindeClient } from "./interfaces/kinde-client.interface";
import { AuthStateService } from "./auth-state.service";
import { FlagType, GetFlagType, RegisterURLOptions, UserType } from "@kinde-oss/kinde-typescript-sdk";
import { LOCATION_TOKEN } from "./tokens/location.token";

@Injectable({
  providedIn: 'root'
})
export class KindeAngularService implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  user$: Observable<UserType | null> = this.authState.user$;
  isAuthenticated$: Observable<boolean> = this.authState.isAuthenticated$;
  isLoading$: Observable<boolean> = this.authState.isLoading$;
  accessToken$: Observable<string | null> = this.authState.accessToken$;

  // getClaims = this.kindeClient.getClaim;

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
        mergeMap((handled) => handled ? this.getUser() : of(null)),
        tap((user: UserType | null) => {
          if (user) {
            authState.setUser(user);
          }
          authState.setIsLoading(false)
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private async getUser(): Promise<UserType> {
    let user = await this.kindeClient.getUser();
    let token = await this.kindeClient.getToken();

    if (!user) {
      user = await this.kindeClient.getUserProfile();
    }
    return user;
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

  async login(options?: RegisterURLOptions): Promise<void> {
    const loginUrl = await this.kindeClient.login(options);
    this.location.href = loginUrl.href;
  }

  async logout(): Promise<void> {
    const logoutUrl = await this.kindeClient.logout();
    this.location.href = logoutUrl.href;
  }

  async register(options?: RegisterURLOptions): Promise<void> {
    const registerUrl = await this.kindeClient.register(options);
    this.location.href = registerUrl.href;
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
      const url = new URL(window.location.toString());
      url.search = '';



      window.history.pushState({}, '', url);
    } catch (e) {
      console.log(e);
    }
  }
}
