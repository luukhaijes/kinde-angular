import { Inject, Injectable } from '@angular/core';
import { defer, filter, from, iif, map, Observable, of, switchMap, tap } from "rxjs";
import { factoryToken } from "./kinde-client-factory.service";
import { KindeClient } from "./interfaces/kinde-client.interface";
import { AuthStateService } from "./auth-state.service";

@Injectable({
  providedIn: 'root'
})
export class KindeAngularService {
  // user: Object = this.kindeClientFactoryService.getUser();
  isAuthenticated$: Observable<boolean> = this.authState.isAuthenticated$;
  isLoading$: Observable<boolean> = this.authState.isLoading$;

  constructor(
    @Inject(factoryToken) private kindeClient: KindeClient,
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

  getAccessToken() {
    return from(this.kindeClient.getToken());
  }

  async login() {
    const loginUrl = await this.kindeClient.login();
    window.location.href = loginUrl.href;
  }

  async logout() {
    const logoutUrl = await this.kindeClient.logout();
    window.location.href = logoutUrl.href;
  }

  private shouldHandleCallback() {
    return of(window.location.search)
      .pipe(
        map(search => new URLSearchParams(search)),
        map(params => params.has('code') || params.has('state'))
      );
  }

  async handleCallback() {
    try {
      await this.kindeClient.handleRedirectToApp(new URL(window.location.toString()));
    } catch (e) {
      console.log(e);
    }
  }
}
