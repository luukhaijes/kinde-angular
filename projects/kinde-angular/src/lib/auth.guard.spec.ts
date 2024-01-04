import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { KindeAngularService } from "./kinde-angular.service";
import { Observable, of } from "rxjs";
import { canActivateAuthGuard, canMatchAuthGuard } from "./auth.guard";
import { ActivatedRoute, RouterStateSnapshot } from "@angular/router";

describe('AuthGuard', () => {
  const serviceSpy = {
    isAuthenticated$: of(true),
    login: jest.fn().mockResolvedValue(undefined)
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
})
