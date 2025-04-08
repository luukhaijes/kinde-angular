import { KindeClientFactory } from "./kinde-client-factory.service";
import { KindeConfigInterface } from "./interfaces/kinde-config.interface";
import { isPlatformBrowser } from "@angular/common";
import { VERSION } from "@angular/core";
import { createKindeBrowserClient } from "@kinde-oss/kinde-typescript-sdk";
import { sessionManager } from "./session-manager";

jest.mock("@kinde-oss/kinde-typescript-sdk", () => ({
  createKindeBrowserClient: jest.fn()
}));

jest.mock("@angular/common", () => ({
  isPlatformBrowser: jest.fn()
}));

describe('KindeClientFactory', () => {
  const mockConfig: KindeConfigInterface = {
    clientId: 'client_id_here',
    authDomain: 'https://domain.kinde.com',
    redirectURL: 'http://localhost:4200/',
    logoutRedirectURL: 'http://localhost:4200/',
  };

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should create a Kinde browser client if platform is browser', () => {
    (isPlatformBrowser as jest.Mock).mockReturnValue(true);

    KindeClientFactory.createClient(mockConfig, {});

    expect(isPlatformBrowser).toHaveBeenCalledWith({});
    expect(createKindeBrowserClient).toHaveBeenCalledWith({
      framework: 'Angular',
      frameworkVersion: VERSION.full,
      ...mockConfig,
      sessionManager: sessionManager
    });
  });

  it('should return null if platform is not browser', () => {
    (isPlatformBrowser as jest.Mock).mockReturnValue(false);

    const result = KindeClientFactory.createClient(mockConfig, {});

    expect(isPlatformBrowser).toHaveBeenCalledWith({});
    expect(result).toBeNull();
    expect(createKindeBrowserClient).not.toHaveBeenCalled();
  });
});
