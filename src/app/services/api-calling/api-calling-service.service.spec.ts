import { TestBed } from '@angular/core/testing';

import { ApiCallingServiceService } from './api-calling-service.service';

describe('ApiCallingServiceService', () => {
  let service: ApiCallingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCallingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
