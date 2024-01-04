import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { KindeAngularService } from "./kinde-angular.service";
import { Observable, of } from "rxjs";
import { canActivateAuthGuard, canMatchAuthGuard, featureFlagGuard } from "./auth.guard";
import { ActivatedRoute, RouterStateSnapshot, UrlTree } from "@angular/router";

describe('AuthGuard', () => {
  const serviceSpy = {
    isAuthenticated$: of(true),
    login: jest.fn().mockResolvedValue(undefined),
    getFeatureFlagEnabled: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: KindeAngularService,
          useValue: serviceSpy
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              la: 'bla'
            }
          }
        }
      ]
    })
  });

  it('canActivate should return true if user is authenticated', (done) => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    serviceSpy.isAuthenticated$ = of(true);

    const guardResponse = TestBed.runInInjectionContext(() => {
      return canActivateAuthGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    guardResponse.subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBe(true);
      expect(serviceSpy.login).not.toHaveBeenCalled();
      done();
    })
  });

  it('canActivate should return false if user is not authenticated', (done) => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    serviceSpy.isAuthenticated$ = of(false);

    const guardResponse = TestBed.runInInjectionContext(() => {
      return canActivateAuthGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    guardResponse.subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBe(false);
      expect(serviceSpy.login).toHaveBeenCalled();
      done();
    })
  });

  it('canMatch should return true if user is authenticated', (done) => {
    serviceSpy.isAuthenticated$ = of(true);

    const guardResponse = TestBed.runInInjectionContext(() => {
      return canMatchAuthGuard({}, []) as Observable<boolean>;
    });

    guardResponse.subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBe(true);
      done();
    })
  });

  it('canMatch should return false if user is not authenticated', (done) => {
    serviceSpy.isAuthenticated$ = of(false);

    const guardResponse = TestBed.runInInjectionContext(() => {
      return canMatchAuthGuard({}, []) as Observable<boolean>;
    });

    guardResponse.subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBe(false);
      done();
    })
  });

  it('should redirect to root if user doesn\'t have that feature flag', async () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    serviceSpy.getFeatureFlagEnabled.mockResolvedValue(false);
    const guardResponse = TestBed.runInInjectionContext(() => {
      return (featureFlagGuard('bla')(activatedRoute.snapshot, {} as RouterStateSnapshot)) as Promise<boolean | UrlTree>;
    });
    const result = await guardResponse as UrlTree;
    expect(result.toString()).toBe('/');
  });

  it('should redirect to given route if user doesn\'t have that feature flag', async () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    serviceSpy.getFeatureFlagEnabled.mockResolvedValue(false);
    const guardResponse = TestBed.runInInjectionContext(() => {
      return (featureFlagGuard('bla', '/route')(activatedRoute.snapshot, {} as RouterStateSnapshot)) as Promise<boolean | UrlTree>;
    });
    const result = await guardResponse as UrlTree;
    expect(result.toString()).toBe('/route');
  });

  it('should not redirect if user feature flag exists', async () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    serviceSpy.getFeatureFlagEnabled.mockResolvedValue(true);
    const guardResponse = TestBed.runInInjectionContext(() => {
      return (featureFlagGuard('bla', '/route')(activatedRoute.snapshot, {} as RouterStateSnapshot)) as Promise<boolean | UrlTree>;
    });
    const result = await guardResponse as boolean;
    expect(result).toBe(true);
  });
})
