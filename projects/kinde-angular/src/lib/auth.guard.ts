import { inject, Injectable } from "@angular/core";
import { KindeAngularService } from "./kinde-angular.service";
import { take, tap } from "rxjs";
import { CanActivateFn, CanMatchFn } from "@angular/router";

export const canMatchAuthGuard: CanMatchFn = () => {
  const authService = inject(KindeAngularService);
  return authService.isAuthenticated$.pipe(take(1));
}

export const canActivateAuthGuard: CanActivateFn = () => {
  const authService = inject(KindeAngularService);
  return authService.isAuthenticated$.pipe(
    take(1),
    tap(async isAuthenticated => {
      if (!isAuthenticated) {
        await authService.login();
      }
    })
  );
}
