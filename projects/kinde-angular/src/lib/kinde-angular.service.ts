import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  defer, filter,
  from,
  iif,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap
} from "rxjs";
import { KINDE_FACTORY_TOKEN } from "./kinde-client-factory.service";
import { KindeClient } from "./interfaces/kinde-client.interface";
import { AuthStateService } from "./auth-state.service";
import { ClaimTokenType, FlagType, GetFlagType, RegisterURLOptions, UserType } from "@kinde-oss/kinde-typescript-sdk";
import { IClaim } from "./interfaces/claim.interface";
import { sessionManager } from "./session-manager";
import { DOCUMENT, isPlatformBrowser, Location } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class KindeAngularService implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  user$: Observable<UserType | null> = this.authState.user$;
  isAuthenticated$: Observable<boolean> = this.authState.isAuthenticated$;
  isLoading$: Observable<boolean> = this.authState.isLoading$;
  accessToken$: Observable<string | null> = this.authState.accessToken$;

  constructor(
    @Inject(KINDE_FACTORY_TOKEN) private kindeClient: KindeClient | null,
    @Inject(DOCUMENT) private document: Document,
    private location: Location,
    private authState: AuthStateService
  ) {
    this.shouldHandleCallback()
      .pipe(
        filter(_ => this.kindeClient !== null),
        switchMap(shouldHandleCallback =>
          iif(
            () => shouldHandleCallback,
            defer(() => this.handleCallback()),
            of(false)
          ),
        ),
        tap(() =>
          authState.setIsLoading(false)
        ),
        takeUntil(this.unsubscribe$)
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getClaim<T>(claim: string, type?: ClaimTokenType): Observable<IClaim<T> | null> {
    // todo: make reusable function to handle isAuthenticated
    return this.isAuthenticated$.pipe(
      filter(_ => this.kindeClient !== null),
      switchMap(isAuthenticated =>
        iif(
          () => isAuthenticated,
          from(this.kindeClient!.getClaim(claim, type)) as Observable<IClaim<T>>,
          of(null)
        )
    ));
  };

  getUserOrganizations(): Observable<{ orgCodes: string[] }> {
    // todo: check L59
    return this.isAuthenticated$.pipe(
      filter(_ => this.kindeClient !== null),
      switchMap(isAuthenticated =>
        iif(
          () => isAuthenticated,
          from(this.kindeClient!.getUserOrganizations()),
          of({ orgCodes: [] })
        )
    ));
  }

  getAccessToken(): Promise<string> {
    if(!this.kindeClient) throw new Error("kindeClient is null");
    return this.kindeClient.getToken();
  }

  getFeatureFlag(code: string, defaultValue?: string | number | boolean | undefined, flagType?: keyof FlagType): Promise<GetFlagType> {
    if(!this.kindeClient) throw new Error("kindeClient is null");
    return this.kindeClient.getFlag(code, defaultValue, flagType);
  }

  async getFeatureFlagEnabled(code: string, defaultValue?: boolean | undefined): Promise<boolean> {
    const BOOLEAN_FLAG_TYPE = 'b';
    return (await this.getFeatureFlag(code, defaultValue, BOOLEAN_FLAG_TYPE)).value as boolean;
  }

  async login(options?: RegisterURLOptions): Promise<void> {
    if(!this.kindeClient) throw new Error("kindeClient is null");
    const loginUrl = await this.kindeClient.login(options);
    if (options?.post_login_redirect_url) {
      await sessionManager.setSessionItemBrowser('post_login_redirect_url', options.post_login_redirect_url);
    }
    this.document.location.href = loginUrl.href;
  }

  async logout(): Promise<void> {
    if(!this.kindeClient) throw new Error("kindeClient is null");
    const logoutUrl = await this.kindeClient.logout();
    this.document.location.href = logoutUrl.href;
  }

  async register(options?: RegisterURLOptions): Promise<void> {
    if(!this.kindeClient) throw new Error("kindeClient is null");
    const registerUrl = await this.kindeClient.register(options);
    this.document.location.href = registerUrl.href;
  }

  private shouldHandleCallback(): Observable<boolean> {
    return of(this.document.location.search)
      .pipe(
        map(search => new URLSearchParams(search)),
        map(params => params.has('code') || params.has('state'))
      );
  }

  async handleCallback(): Promise<void> {
    try {
      await this.kindeClient!.handleRedirectToApp(new URL(this.document.location.href));
      const token = await this.kindeClient!.getToken();
      this.authState.setAccessToken(token);
      let url = new URL(this.document.location.href);
      url.search = '';

      const loginRedirectUrl = await sessionManager.getSessionItemBrowser('post_login_redirect_url');
      if (loginRedirectUrl) {
        url = new URL(loginRedirectUrl);
        await sessionManager.removeSessionItemBrowser('post_login_redirect_url');
      }
      this.document.location.href = url.href;
      this.location.go(url.toString());
    } catch (e) {
      console.log(e);
    }
  }
}
