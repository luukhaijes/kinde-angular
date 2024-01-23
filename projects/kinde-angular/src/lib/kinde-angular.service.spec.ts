import { TestBed } from '@angular/core/testing';
import { KindeAngularService } from './kinde-angular.service';
import { KindeClient } from './interfaces/kinde-client.interface';
import { AuthStateService } from './auth-state.service';
import { UserType } from '@kinde-oss/kinde-typescript-sdk';
import { KINDE_FACTORY_TOKEN } from "./kinde-client-factory.service";
import { LOCATION_TOKEN } from "./tokens/location.token";

describe('KindeAngularService', () => {
  let kindeClientMock = {
    isAuthenticated: () => Promise.resolve(true),
    getUser: () => Promise.resolve({ family_name: 'test' } as UserType),
    getToken: () => Promise.resolve('test'),
    login: () => Promise.resolve(new URL('https://kinde.com/v2/login')),
    logout: () => Promise.resolve(new URL('https://kinde.com/v2/logout')),
    register: () => Promise.resolve(new URL('https://kinde.com/v2/register')),
    handleRedirectToApp: jest.fn().mockResolvedValue(undefined),
    getFlag: jest.fn(),
  };
  let locationSpy = {
    href: '',
    search: '',
  };
  const createService = () => TestBed.inject(KindeAngularService);

  beforeEach(() => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: KINDE_FACTORY_TOKEN,
          useValue: kindeClientMock as unknown as KindeClient
        },
        {
          provide: LOCATION_TOKEN,
          useValue: locationSpy
        },
        KindeAngularService,
        AuthStateService
      ]
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get user$ correctly', (done) => {
    const service = createService();
    service.user$.subscribe(user => {
      expect(user).toEqual({ family_name: 'test' } as UserType);
      done();
    });
  });

  it('should get isAuthenticated$ correctly', (done) => {
    const service = createService();
    service.isAuthenticated$.subscribe(isAuthenticated => {
      expect(isAuthenticated).toBe(true);
      done();
    });
  });

  it('should get isLoading$ correctly', (done) => {
    const service = createService();
    service.isLoading$.subscribe(isLoading => {
      expect(isLoading).toBe(false);
      done();
    });
  });

  it('should get access token correctly', (done) => {
    const service = createService();
    service.getAccessToken().then(accessToken => {
      expect(accessToken).toBe('test');
      done();
    });
  });

  it('should return login url correctly', async () => {
    const service = createService();
    await service.login();
    expect(locationSpy.href).toBe('https://kinde.com/v2/login');
  });

  it('should return logout url correctly', async () => {
    const service = createService();
    await service.logout();
    expect(locationSpy.href).toBe('https://kinde.com/v2/logout');
  });

  it('should return register url correctly', async () => {
    const service = createService();
    await service.register();
    expect(locationSpy.href).toBe('https://kinde.com/v2/register');
  });

  it('shouldHandleCallback returns if params exist', (done) => {
    const service = createService();
    const mockCallbackParams = {
      code: 'testCode',
      state: 'testState'
    };
    locationSpy.search = `?code=${ mockCallbackParams.code }&state=${ mockCallbackParams.state }`;

    (service as any).shouldHandleCallback().subscribe((shouldHandle: boolean) => {
      expect(shouldHandle).toBe(true);
      done();
    });
  });

  it('should not handle callback correctly if params exist', () => {
    expect(kindeClientMock.handleRedirectToApp).not.toHaveBeenCalled()
  });

  it('should handle callback correctly if params exist', () => {
    const mockCallbackParams = {
      code: 'testCode',
      state: 'testState'
    };
    locationSpy.search = `?code=${ mockCallbackParams.code }&state=${ mockCallbackParams.state }`;
    createService();

    expect(kindeClientMock.handleRedirectToApp).toHaveBeenCalled();
  });

  it('should get feature flag correctly', async () => {
    kindeClientMock.getFlag.mockResolvedValue({ value: 'test' });
    const service = createService();
    await service.getFeatureFlag('test');
    expect(kindeClientMock.getFlag).toHaveBeenCalledWith('test', undefined, undefined);
  });

  it('should get getFeatureFlagEnabled flag correctly', async () => {
    kindeClientMock.getFlag.mockResolvedValue({ value: true });
    const service = createService();
    const result = await service.getFeatureFlagEnabled('test');
    expect(kindeClientMock.getFlag).toHaveBeenCalledWith('test', undefined, 'b');
    expect(result).toBe(true);
  });
});
