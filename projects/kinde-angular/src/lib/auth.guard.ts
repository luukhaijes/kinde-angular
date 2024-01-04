import { inject } from "@angular/core";
import { KindeAngularService } from "./kinde-angular.service";
import { take, tap } from "rxjs";
import { CanActivateFn, CanMatchFn, Router, UrlTree } from "@angular/router";

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

export const featureFlagGuard = (flagName: string, redirect?: string): CanActivateFn => {
  return async (): Promise<boolean | UrlTree> => {
    const authService = inject(KindeAngularService);
    const router = inject(Router);
    const isEnabled = await authService.getFeatureFlagEnabled(flagName);

    return isEnabled || router.createUrlTree([redirect || '/']);
  }
};
