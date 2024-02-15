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
  mergeMap,
  combineLatestWith
} from "rxjs";
import { KindeClient } from "./interfaces/kinde-client.interface";
import { KINDE_FACTORY_TOKEN } from "./kinde-client-factory.service";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";

interface TokenStreamState {
  prev: string | null;
  current: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  /**
   * A variant of Subject that requires an initial value and emits its current value whenever it is subscribed to.
   * We use BehaviorSubject because we want the initial value to be true
   */
  private isLoadingSubject$ = new BehaviorSubject<boolean>(true);
  /**
   * A variant of Subject that "replays" old values to new subscribers by emitting them when they first subscribe.
   * We buffer the last emitted value and emit it to new subscribers if subscribed.
   */
  private _accessToken$ = new ReplaySubject<string>(1);

  private _user$ = new ReplaySubject<UserType>(1);

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

  private _userCache$ = this.isAuthenticatedStream$.pipe(
    switchMap(isAuthenticated =>
      isAuthenticated ? this.kindeClient.getUser() : of(null)
    ),
    shareReplay(1)
  );

  user$ = this.isAuthenticatedStream$.pipe(
    combineLatestWith(this._userCache$),
    concatMap(([isAuthenticated, cachedUser]) => {
        if (cachedUser) {
          return of(cachedUser)
        }
        return isAuthenticated ? this.kindeClient.getUserProfile() : of(null)
      }
    ),
  );

  accessToken$ = this.isAuthenticatedStream$.pipe(
    concatMap(isAuthenticated =>
      isAuthenticated ? this.kindeClient.getToken() : of(null)
    ),
  )

  constructor(@Inject(KINDE_FACTORY_TOKEN) private kindeClient: KindeClient) {
  }

  setIsLoading(isLoading: boolean): void {
    this.isLoadingSubject$.next(isLoading);
  }

  setAccessToken(accessToken: string): void {
    this._accessToken$.next(accessToken);
  }

  setUser(user: UserType): void {
    this._user$.next(user);
  }
}
