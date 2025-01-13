import { TestBed } from '@angular/core/testing';

import { AuthLogoutService } from './auth-logout.service';

describe('AuthLogoutService', () => {
  let service: AuthLogoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthLogoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
