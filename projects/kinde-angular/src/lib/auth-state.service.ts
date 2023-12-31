import { Inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  ReplaySubject,
  distinctUntilChanged,
  switchMap,
  defer,
  shareReplay,
  concatMap,
  of,
  scan,
  merge,
  mergeMap
} from "rxjs";
import { KindeClient } from "./interfaces/kinde-client.interface";
import { KINDE_FACTORY_TOKEN } from "./kinde-client-factory.service";

interface TokenStreamState {
  prev: string | null;
  current: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(true);
  private _accessToken$ = new ReplaySubject<string>(1);

  private accessTokenStream$ = this._accessToken$.pipe(
    scan((acc: TokenStreamState, token: string) => ({
      prev: acc.current,
      current: token,
    }), { prev: null, current: null }),
    filter(state => state.current !== state.prev),
  );

  isLoading$ = this.isLoadingSubject$.asObservable();
  isAuthenticatedStream$ = this.isLoading$.pipe(
    filter(isLoading => !isLoading),
    distinctUntilChanged(),
    switchMap(() =>
      merge(
        defer(() => this.kindeClient.isAuthenticated()),
        this.accessTokenStream$.pipe(
          mergeMap(() => this.kindeClient.isAuthenticated()),
        )
      )
    )
  );

  isAuthenticated$ = this.isAuthenticatedStream$.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  user$ = this.isAuthenticatedStream$.pipe(
    concatMap(isAuthenticated =>
      isAuthenticated ? this.kindeClient.getUser() : of(null)
    ),
  );

  accessToken$ = this.isAuthenticatedStream$.pipe(
    concatMap(isAuthenticated =>
      isAuthenticated ? this.kindeClient.getToken() : of(null)
    ),
  )
  constructor(@Inject(KINDE_FACTORY_TOKEN) private kindeClient: KindeClient) {
  }

  setIsLoading(isLoading: boolean) {
    this.isLoadingSubject$.next(isLoading);
  }

  setAccessToken(accessToken: string) {
    this._accessToken$.next(accessToken);
  }
}
