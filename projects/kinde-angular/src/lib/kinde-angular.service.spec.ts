import { TestBed } from '@angular/core/testing';

import { KindeAngularService } from './kinde-angular.service';

describe('KindeAngularService', () => {
  let service: KindeAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KindeAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
